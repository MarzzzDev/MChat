const failedBadgeUrls = new Map();
const BADGE_FAILURE_TTL_MS = 60 * 1000;

function isBadgeUrlFailed(url) {
	const failedAt = failedBadgeUrls.get(url);

	if (failedAt === undefined) {
		return false;
	}

	if (Date.now() - failedAt > BADGE_FAILURE_TTL_MS) {
		failedBadgeUrls.delete(url);

		return false;
	}

	return true;
}

function preloadBadgeImage(url) {
	if (!url) {
		return Promise.resolve(null);
	}

	const cached = badgeImageCache.get(url);

	if (cached instanceof HTMLImageElement) {
		return Promise.resolve(cached);
	}

	if (cached instanceof Promise) {
		return cached;
	}

	const promise = new Promise((resolve) => {
		const img = new Image();

		img.decoding = "async";

		img.onload = () => {
			failedBadgeUrls.delete(url);

			badgeImageCache.set(url, img);

			resolve(img);
		};

		img.onerror = () => {
			failedBadgeUrls.set(url, Date.now());

			badgeImageCache.delete(url);

			resolve(null);
		};

		img.src = url;
	});

	badgeImageCache.set(url, promise);

	return promise;
}

function createBadge(url, title) {
	if (!url) {
		return null;
	}

	const img = document.createElement("img");

	img.className = "badge";

	img.alt = "";

	img.title = title || "";

	img.width = 18;
	img.height = 18;

	img.loading = "eager";

	img.decoding = "async";

	img.style.width = "18px";

	img.style.height = "18px";

	img.style.objectFit = "contain";

	img.style.display = "inline-block";

	img.style.verticalAlign = "middle";

	img.style.marginRight = "2px";

	const cached = badgeImageCache.get(url);

	if (cached instanceof HTMLImageElement) {
		img.src = cached.src;

		return img;
	}

	img.src = url;

	preloadBadgeImage(url);

	return img;
}

function addPfpBadge(container, tags) {
	if (typeof badgePfp !== "undefined" && !badgePfp) {
		return;
	}

	const userId = tags?.["user-id"] || tags?.userId || tags?.user_id;

	if (!userId) {
		return;
	}

	const img = document.createElement("img");

	img.className = "badge pfp-badge";

	img.alt = "";

	img.width = 18;
	img.height = 18;

	img.style.width = "18px";

	img.style.height = "18px";

	img.style.objectFit = "cover";

	img.style.borderRadius = "50%";

	img.dataset.badgeProvider = "pfp";

	container.prepend(img);

	getTwitchPfp(userId, 70).then((url) => {
		if (url) {
			img.src = url;
		} else {
			img.remove();
		}
	});
}

const TWITCH_ROLE_BADGE_SETS = new Set([
	"staff",
	"admin",
	"global_mod",
	"lead_moderator",
	"moderator",
	"vip",
	"broadcaster",
]);

const TWITCH_SUBSCRIBER_BADGE_SETS = new Set(["subscriber", "founder"]);

function getTwitchBadgeCategory(set) {
	if (TWITCH_ROLE_BADGE_SETS.has(set)) {
		return "ta";
	}

	if (TWITCH_SUBSCRIBER_BADGE_SETS.has(set)) {
		return "ts";
	}

	if (set === "predictions") {
		return "tp";
	}

	return "tv";
}

function getFFZRoomBadgeOverride(set) {
	if (!badgeFfz) {
		return null;
	}

	if (set === "moderator" && ffzRoomBadges.moderator) {
		return ffzRoomBadges.moderator;
	}

	if (set === "vip" && ffzRoomBadges.vip) {
		return ffzRoomBadges.vip;
	}

	return null;
}

function createTwitchBadgeContainer(tags) {
	const container = document.createElement("span");

	container.className = "badges twitch-badges";

	if (pfpsEnabled) {
		addPfpBadge(container, tags);
	}

	return container;
}

function getTwitchBadgeEntries(tags) {
	const badgeString = tags?.badges || "";

	if (!badgeString) {
		return [];
	}

	const entries = [];

	for (const entry of badgeString.split(",")) {
		const slash = entry.indexOf("/");

		if (!entry || slash === -1) {
			continue;
		}

		const set = entry.substring(0, slash);

		const version = entry.substring(slash + 1);

		const override = getFFZRoomBadgeOverride(set);

		if (override) {
			entries.push({
				key: `ffz|${set}|${override.url}`,
				category: getTwitchBadgeCategory(set),
				provider: "ffz",
				type: set,
				url: override.url,
				title: override.title,
				fromTwitch: true,
			});

			continue;
		}

		if (!badgeTwitch) {
			continue;
		}

		let badge = twitchBadges.get(`${set}/${version}`);

		if (!badge && set === "subscriber") {
			badge = twitchBadges.get("subscriber/1");
		}

		const url = badge?.url_2x || badge?.url_1x || badge?.url_4x || null;

		if (!url) {
			console.warn("Twitch badge not found:", `${set}/${version}`);

			continue;
		}

		entries.push({
			key: `twitch|${set}/${version}|${url}`,
			category: getTwitchBadgeCategory(set),
			provider: "twitch",
			type: set,
			url,
			title: badge?.title || set,
			fromTwitch: true,
		});
	}

	return entries;
}

function orderBadgeEntries(entries, userId) {
    const layout = getMoltorinoLayout(userId);

    const visible = layout
        ? entries.filter((entry) => !layout.hidden.has(entry.category))
        : entries.slice();

    const orderKeys = layout ? layout.order : BADGE_CATEGORY_ORDER;
    const rank = new Map(orderKeys.map((key, index) => [key, index]));
    const maxRank = orderKeys.length;

    return visible.sort((a, b) => {
        const rankA = rank.has(a.category) ? rank.get(a.category) : maxRank;
        const rankB = rank.has(b.category) ? rank.get(b.category) : maxRank;
        return rankA - rankB;
    });
}

function buildBadgeElement(entry) {
	let img;

	if (entry.provider === "twitch") {
		img = document.createElement("img");

		img.className = "badge";

		img.src = entry.url;

		img.alt = entry.title;

		img.title = entry.title;

		img.width = 18;
		img.height = 18;

		img.style.width = "18px";

		img.style.height = "18px";

		img.style.objectFit = "contain";
	} else {
		img = createBadge(entry.url, entry.title);

		if (!img) {
			return null;
		}
	}

	if (entry.type) {
		img.dataset.badgeType = entry.type;
	}

	img.dataset.badgeProvider = entry.provider;

	img.dataset.badgeCategory = entry.category;

	img.dataset.badgeKey = entry.key;

	img.addEventListener(
		"error",
		() => {
			failedBadgeUrls.set(entry.url, Date.now());

			img.remove();
		},
		{ once: true },
	);

	return img;
}

function renderBadgeEntries(container, entries) {
	const existing = new Map();

	for (const child of Array.from(container.children)) {
		if (child.classList.contains("pfp-badge")) {
			continue;
		}

		const key = child.dataset.badgeKey;

		if (key && !existing.has(key)) {
			existing.set(key, child);
		} else {
			child.remove();
		}
	}

	const desired = [];
	const seen = new Set();

	for (const entry of entries) {
		if (seen.has(entry.key) || isBadgeUrlFailed(entry.url)) {
			continue;
		}

		seen.add(entry.key);

		let node = existing.get(entry.key);

		if (node) {
			existing.delete(entry.key);
		} else {
			node = buildBadgeElement(entry);
		}

		if (node) {
			desired.push(node);
		}
	}

	for (const node of existing.values()) {
		node.remove();
	}

	const current = Array.from(container.children).filter(
		(child) => !child.classList.contains("pfp-badge"),
	);

	const unchanged =
		current.length === desired.length &&
		current.every((node, index) => node === desired[index]);

	if (!unchanged) {
		for (const node of desired) {
			container.appendChild(node);
		}
	}
}

async function refreshMessageBadges(message) {
	const context = message?._badgeContext;

	if (!context) {
		return;
	}

	const token = (context.token = (context.token || 0) + 1);

	let external = [];

	try {
		external = await getExternalBadgeEntries(context.userId, context.tags);
	} catch (error) {
		console.error("External badge error:", error);
	}

	if (token !== context.token) {
		return;
	}

	renderBadgeEntries(
		context.badges,
		orderBadgeEntries(
			getTwitchBadgeEntries(context.tags).concat(external),
			context.userId,
		),
	);

	context.authorGroup.classList.toggle(
		"has-badges",
		context.badges.childElementCount > 0,
	);
}

let badgeRerenderFrame = 0;

function refreshAllMessageBadges() {
	if (badgeRerenderFrame) {
		return;
	}

	badgeRerenderFrame = requestAnimationFrame(() => {
		badgeRerenderFrame = 0;

		for (const message of document.querySelectorAll(".message")) {
			if (message._badgeContext) {
				refreshMessageBadges(message);
			}
		}
	});
}

function onBadgeRegistriesChanged() {
	refreshAllMessageBadges();
}

function hasTwitchBadge(tags, badgeType) {
	if (!tags) {
		return false;
	}

	const badgeString = tags.badges || "";

	if (!badgeString) {
		return false;
	}

	return badgeString
		.split(",")
		.filter(Boolean)
		.some((entry) => {
			const slash = entry.indexOf("/");

			const type = slash === -1 ? entry : entry.substring(0, slash);

			return type === badgeType;
		});
}

function isFFZVipBadge(id, badge) {
	const badgeId = String(id || "").toLowerCase();

	const badgeName = String(badge?.name || "").toLowerCase();

	const badgeTitle = String(badge?.title || "").toLowerCase();

	return (
		badgeId === "vip" ||
		badgeName === "vip" ||
		badgeTitle === "vip" ||
		badgeTitle.includes("vip")
	);
}

function isBadgeProviderEnabled(provider) {
	switch (provider) {
		case "FFZ":
			return badgeFfz;
		case "7TV":
			return badgeSeventv;
		case "Chatterino":
			return badgeChatterino;
		case "Homies":
			return badgeHomies;
		case "BTTV":
			return badgeBttv;
		case "DankChat":
			return badgeDankchat;
		case "Moltorino":
			return badgeMoltorino;
		default:
			return true;
	}
}