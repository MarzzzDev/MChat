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
			badgeImageCache.set(url, img);

			resolve(img);
		};

		img.onerror = () => {
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

const TWITCH_BADGE_ORDER = [
	"broadcaster",
	"staff",
	"admin",
	"global_mod",
	"moderator",
	"lead_moderator",
	"vip",
	"artist-badge",
	"founder",
	"subscriber",
	"sub-gifter",
	"sub_gifter",
	"bits-leader",
	"bits",
	"bits-charity",
	"hype-train",
	"predictions",
	"partner",
	"turbo",
	"premium",
];

function twitchBadgeRank(entry) {
	const slash = entry.indexOf("/");
	const set = slash === -1 ? entry : entry.substring(0, slash);
	const index = TWITCH_BADGE_ORDER.indexOf(set);

	return index === -1 ? TWITCH_BADGE_ORDER.length : index;
}

function createTwitchBadges(tags) {
	const container = document.createElement("span");

	container.className = "badges twitch-badges";

	if (pfpsEnabled)  {
		addPfpBadge(container, tags);
	}

	if (!badgeTwitch) {
		return container;
	}

	const badgeString = tags.badges || "";

	if (!badgeString) {
		return container;
	}

	const sortedEntries = badgeString
		.split(",")
		.filter(Boolean)
		.map((entry, index) => ({ entry, index }))
		.sort(
			(a, b) =>
				twitchBadgeRank(a.entry) - twitchBadgeRank(b.entry) || a.index - b.index,
		)
		.map(({ entry }) => entry);

	for (const entry of sortedEntries) {
		const slash = entry.indexOf("/");

		if (slash === -1) {
			continue;
		}

		const set = entry.substring(0, slash);

		const version = entry.substring(slash + 1);

		let badge = twitchBadges.get(`${set}/${version}`);

		if (!badge && set === "subscriber") {
			badge = twitchBadges.get("subscriber/1");
		}

		const badgeUrl = badge?.url_2x || badge?.url_1x || badge?.url_4x || null;

		if (!badgeUrl) {
			console.warn("Twitch badge not found:", `${set}/${version}`);

			continue;
		}

		const img = document.createElement("img");

		img.className = "badge";

		img.src = badgeUrl;

		img.alt = badge?.title || set;

		img.title = badge?.title || set;

		img.width = 18;
		img.height = 18;

		img.style.width = "18px";

		img.style.height = "18px";

		img.style.objectFit = "contain";

		img.dataset.badgeType = set;

		img.dataset.badgeProvider = "twitch";

		container.appendChild(img);
	}

	return container;
}

async function loadChatterinoBadges() {
	try {
		const response = await fetch("https://api.chatterino.com/badges");

		if (!response.ok) {
			throw new Error(`Chatterino badges: ${response.status}`);
		}

		const data = await response.json();

		for (const badge of data.badges || []) {
			const url = normalizeImageUrl(
				badge.image3 || badge.image2 || badge.image1,
			);

			if (!url) {
				continue;
			}

			const title = badge.tooltip || "Chatterino Badge";

			for (const rawId of badge.users || []) {
				const id = String(rawId);

				if (!chatterinoBadges.has(id)) {
					chatterinoBadges.set(id, []);
				}

				chatterinoBadges.get(id).push({ url, title });
			}
		}

	} catch (error) {
		console.error("Chatterino badge error:", error);
	}
}

function createFFZRoomBadge(tags) {
	if (!badgeFfz) {
		return null;
	}

	const badgeString = tags.badges || "";

	if (!badgeString) {
		return null;
	}

	const badgeTypes = new Set();

	for (const entry of badgeString.split(",").filter(Boolean)) {
		const slash = entry.indexOf("/");

		const type = slash === -1 ? entry : entry.substring(0, slash);

		badgeTypes.add(type);
	}

	if (badgeTypes.has("moderator") && ffzRoomBadges.moderator) {
		const badge = ffzRoomBadges.moderator;

		const img = createBadge(badge.url, badge.title);

		if (!img) {
			return null;
		}

		img.dataset.badgeType = "moderator";

		img.dataset.badgeProvider = "ffz";

		return {
			type: "moderator",

			img,
		};
	}

	if (badgeTypes.has("vip") && ffzRoomBadges.vip) {
		const badge = ffzRoomBadges.vip;

		const img = createBadge(badge.url, badge.title);

		if (!img) {
			return null;
		}

		img.dataset.badgeType = "vip";

		img.dataset.badgeProvider = "ffz";

		return {
			type: "vip",

			img,
		};
	}

	return null;
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

