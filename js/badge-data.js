const homiesBadges = new Map();

const sevenTVBadgeUrlCache = new Map();

const HOMIES_BADGE_URLS = [
	"https://chatterinohomies.com/api/badges/list",
	"https://itzalex.github.io/badges",
	"https://itzalex.github.io/badges2",
];

const BADGE_CATEGORY_ORDER = [
    "ta",
    "ts",
    "tv",
    "tp",
    "ff",
    "fa",
    "bt",
    "bl",
    "c",
    "jc",
    "bh",
    "m",
    "hc",
    "hs",
    "7", 
];

const BADGE_CATEGORY_SET = new Set(BADGE_CATEGORY_ORDER);
const MAX_LAYOUT_ORDER_KEYS = 64;
const BADGE_REFRESH_FAST_MS = 30 * 1000;
const BADGE_REFRESH_SLOW_MS = 5 * 60 * 1000;
const MOLTORINO_BADGE_URL = "https://api.moltorino.com/v2/badges";

const badgeBodySignatures = new Map();

function hashBadgeBody(text) {
	let hash = 5381;

	for (let index = 0; index < text.length; index++) {
		hash = ((hash << 5) + hash + text.charCodeAt(index)) | 0;
	}

	return hash >>> 0;
}

function badgeBodyChanged(name, text) {
	const signature = `${text.length}:${hashBadgeBody(text)}`;

	if (badgeBodySignatures.get(name) === signature) {
		return false;
	}

	badgeBodySignatures.set(name, signature);

	return true;
}

function replaceMapContents(target, source) {
	target.clear();

	for (const [key, value] of source) {
		target.set(key, value);
	}
}

const homiesSourceMaps = HOMIES_BADGE_URLS.map(() => new Map());

function parseHomiesSource(data, category) {
	const parsed = new Map();

	for (const badge of data?.badges || []) {
		const url = normalizeImageUrl(
			badge.image3 || badge.image2 || badge.image1,
		);

		if (!url) {
			continue;
		}

		const title = badge.tooltip || "Homies Badge";

		const ids = Array.isArray(badge.users) ? badge.users.slice() : [];

		if (badge.userId) {
			ids.push(badge.userId);
		}

		for (const rawId of ids) {
			const id = String(rawId).trim();

			if (!id) {
				continue;
			}

			if (!parsed.has(id)) {
				parsed.set(id, []);
			}

			parsed.get(id).push({ url, title, category });
		}
	}

	return parsed;
}

async function loadHomiesBadges() {
	const results = await Promise.allSettled(
		HOMIES_BADGE_URLS.map(async (url) => {
			const response = await fetch(url, { cache: "no-cache" });

			if (!response.ok) {
				throw new Error(`${url}: ${response.status}`);
			}

			return response.text();
		}),
	);

	let changed = false;

	results.forEach((result, index) => {
		if (result.status !== "fulfilled") {
			console.error(
				"Homies badge source failed:",
				HOMIES_BADGE_URLS[index],
				result.reason,
			);
			return;
		}

		if (!badgeBodyChanged(`homies:${index}`, result.value)) {
			return;
		}

		try {
			homiesSourceMaps[index] = parseHomiesSource(
				JSON.parse(result.value),
				index === 0 ? "hc" : "hs",
			);

			changed = true;
		} catch (error) {
			badgeBodySignatures.delete(`homies:${index}`);

			console.error("Homies badge parse error:", HOMIES_BADGE_URLS[index], error);
		}
	});

	if (!changed) {
		return false;
	}

	const merged = new Map();

	for (const source of homiesSourceMaps) {
		for (const [id, list] of source) {
			if (!merged.has(id)) {
				merged.set(id, []);
			}

			merged.get(id).push(...list);
		}
	}

	replaceMapContents(homiesBadges, merged);

	return true;
}

const bttvBadges = new Map();
const dankchatBadges = new Map();
const moltorinoBadges = new Map();
const moltorinoLayouts = new Map();

let moltorinoDefaultOrder = BADGE_CATEGORY_ORDER.slice();
let moltorinoGeneration = null;
let moltorinoBundleVersion = -1;

const DANKCHAT_BADGE_API = "https://flxrs.com/api/badges";

const DANKCHAT_BADGE_PROXY = "https://dank-chat-badges.marseceva.workers.dev";

const DANKCHAT_BADGE_SOURCES = [
	{
		label: DANKCHAT_BADGE_PROXY,
		load: () => fetch(DANKCHAT_BADGE_PROXY, { cache: "no-cache" }),
	},
	{ label: DANKCHAT_BADGE_API, load: () => platformFetch(DANKCHAT_BADGE_API) },
];

async function loadChatterinoBadges() {
	try {
		const response = await fetch("https://api.chatterino.com/badges", {
			cache: "no-cache",
		});

		if (!response.ok) {
			throw new Error(`Chatterino badges: ${response.status}`);
		}

		const text = await response.text();

		if (!badgeBodyChanged("chatterino", text)) {
			return false;
		}

		const data = JSON.parse(text);
		const parsed = new Map();

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

				if (!parsed.has(id)) {
					parsed.set(id, []);
				}

				parsed.get(id).push({ url, title });
			}
		}

		replaceMapContents(chatterinoBadges, parsed);

		return true;
	} catch (error) {
		badgeBodySignatures.delete("chatterino");

		console.error("Chatterino badge error:", error);

		return false;
	}
}

async function loadBTTVBadges() {
	try {
		const response = await fetch(
			"https://api.betterttv.net/3/cached/badges/twitch",
			{ cache: "no-cache" },
		);

		if (!response.ok) {
			throw new Error(`BTTV badges: ${response.status}`);
		}

		const text = await response.text();

		if (!badgeBodyChanged("bttv", text)) {
			return false;
		}

		const data = JSON.parse(text);
		const parsed = new Map();

		for (const entry of Array.isArray(data) ? data : []) {
			const id = String(entry?.providerId || "").trim();

			const url = normalizeImageUrl(entry?.badge?.svg);

			if (!id || !url) {
				continue;
			}

			if (!parsed.has(id)) {
				parsed.set(id, []);
			}

			parsed.get(id).push({
				url,
				title: entry?.badge?.description || "BTTV Badge",
			});
		}

		replaceMapContents(bttvBadges, parsed);

		return true;
	} catch (error) {
		badgeBodySignatures.delete("bttv");

		console.error("BTTV badge error:", error);

		return false;
	}
}

async function loadDankChatBadges() {
	try {
		let text = null;

		for (const source of DANKCHAT_BADGE_SOURCES) {
			try {
				const response = await source.load();

				if (!response.ok) {
					throw new Error(`${source.label}: ${response.status}`);
				}

				text = await response.text();

				break;
			} catch (error) {
				console.warn("DankChat badge source failed:", source.label, error);
			}
		}

		if (text === null) {
			throw new Error("DankChat badges: all sources failed");
		}

		if (!badgeBodyChanged("dankchat", text)) {
			return false;
		}

		const data = JSON.parse(text);
		const parsed = new Map();

		for (const badge of Array.isArray(data) ? data : []) {
			const url = normalizeImageUrl(badge?.url);

			if (!url) {
				continue;
			}

			const title = badge?.tooltip || "DankChat Badge";

			for (const rawId of badge?.users || []) {
				const id = String(rawId).trim();

				if (!id) {
					continue;
				}

				if (!parsed.has(id)) {
					parsed.set(id, []);
				}

				parsed.get(id).push({ url, title });
			}
		}

		replaceMapContents(dankchatBadges, parsed);

		return true;
	} catch (error) {
		badgeBodySignatures.delete("dankchat");

		console.error("DankChat badge error:", error);

		return false;
	}
}

function normalizeBadgeCategoryKeys(raw) {
	const keys = [];
	const seen = new Set();

	for (const value of Array.isArray(raw) ? raw : []) {
		if (typeof value !== "string") {
			continue;
		}

		const key = value.trim().toLowerCase();

		if (!BADGE_CATEGORY_SET.has(key) || seen.has(key)) {
			continue;
		}

		seen.add(key);
		keys.push(key);

		if (keys.length >= MAX_LAYOUT_ORDER_KEYS) {
			break;
		}
	}

	return keys;
}

function completeBadgeCategoryOrder(order) {
	const TWITCH_FIRST = ["ta", "ts", "tv", "tp"];

	const withoutTwitch = order.filter((key) => !TWITCH_FIRST.includes(key));
	const result = [...TWITCH_FIRST, ...withoutTwitch];

	for (const key of BADGE_CATEGORY_ORDER) {
		if (result.includes(key)) {
			continue;
		}

		if (key === "fa") {
			result.splice(result.indexOf("ff") + 1, 0, key);
		} else if (key === "bl") {
			const index = result.indexOf("m");

			if (index === -1) {
				result.push(key);
			} else {
				result.splice(index, 0, key);
			}
		} else {
			result.push(key);
		}
	}

	return result;
}

function buildMoltorinoLayout(user, defaultOrder) {
	const hasOrder = Object.prototype.hasOwnProperty.call(user, "order");
	const hasHidden = Object.prototype.hasOwnProperty.call(user, "hidden");
	const hasActive = Object.prototype.hasOwnProperty.call(user, "activeBadge");

	if (!hasOrder && !hasHidden && !hasActive) {
		return null;
	}

	let order = hasOrder
		? normalizeBadgeCategoryKeys(user.order)
		: defaultOrder.slice();

	if (!order.length) {
		order = BADGE_CATEGORY_ORDER.slice();
	}

	return {
		order: completeBadgeCategoryOrder(order),
		hidden: new Set(normalizeBadgeCategoryKeys(user.hidden)),
	};
}

function selectMoltorinoBadge(user, definitions) {
	const assigned = [];

	for (const rawId of Array.isArray(user.badges) ? user.badges : []) {
		const id = String(rawId).trim().toLowerCase();

		if (id && definitions.has(id) && !assigned.includes(id)) {
			assigned.push(id);
		}
	}

	if (Object.prototype.hasOwnProperty.call(user, "activeBadge")) {
		const active = user.activeBadge;

		if (typeof active !== "string" || !active.trim()) {
			return null;
		}

		const id = active.trim().toLowerCase();

		if (assigned.includes(id)) {
			return definitions.get(id);
		}
	}

	return assigned.length ? definitions.get(assigned[0]) : null;
}

async function loadMoltorinoBadges() {
	try {
		const response = await fetch(MOLTORINO_BADGE_URL, { cache: "no-store" });

		if (!response.ok) {
			throw new Error(`Moltorino badges: ${response.status}`);
		}

		const data = await response.json();

		const generation = String(data?.generation || "");
		const bundleVersion = Number(data?.bundleVersion);

		if (
			generation &&
			generation === moltorinoGeneration &&
			Number.isFinite(bundleVersion) &&
			bundleVersion <= moltorinoBundleVersion
		) {
			return false;
		}

		const definitions = new Map();

		for (const badge of data?.badges || []) {
			const id = String(badge?.id || "").trim().toLowerCase();

			if (!id || !String(badge?.images?.["1x"] || "").trim()) {
				continue;
			}

			const url = normalizeImageUrl(
				badge.images["4x"] ||
				badge.images["3x"] ||
				badge.images["2x"] ||
				badge.images["1x"],
			);

			if (!url) {
				continue;
			}

			definitions.set(id, {
				url,
				title: badge.tooltip || "Moltorino Badge",
			});
		}

		const defaultOrder = completeBadgeCategoryOrder(BADGE_CATEGORY_ORDER);

		const nextBadges = new Map();
		const nextLayouts = new Map();

		for (const [rawId, user] of Object.entries(data?.users || {})) {
			const id = String(rawId).trim();

			if (!id || !user || typeof user !== "object") {
				continue;
			}

			const layout = buildMoltorinoLayout(user, defaultOrder);

			if (layout) {
				nextLayouts.set(id, layout);
			}

			const definition = selectMoltorinoBadge(user, definitions);

			if (definition) {
				nextBadges.set(id, [
					{
						url: definition.url,
						title: definition.title,
					},
				]);
			}
		}

		replaceMapContents(moltorinoBadges, nextBadges);
		replaceMapContents(moltorinoLayouts, nextLayouts);

		moltorinoDefaultOrder = defaultOrder;
		moltorinoGeneration = generation || null;
		moltorinoBundleVersion = Number.isFinite(bundleVersion) ? bundleVersion : -1;

		return true;
	} catch (error) {
		console.error("Moltorino badge error:", error);

		return false;
	}
}

function getMoltorinoLayout(userId) {
	if (userId == null) {
		return null;
	}

	return moltorinoLayouts.get(String(userId)) || null;
}

function normalizeFFZRoomBadge(badge, title) {
	if (!badge) {
		return null;
	}

	let url = null;

	if (typeof badge === "object" && !Array.isArray(badge)) {
		url =
			badge["4"] ||
			badge["2"] ||
			badge["1"] ||
			badge.image ||
			badge.url ||
			null;
	}
	if (typeof badge === "string") {
		url = badge;
	}

	url = normalizeImageUrl(url);

	if (!url) {
		return null;
	}

	return {
		url,

		title: title || "FFZ Badge",
	};
}

async function loadFFZBadges() {
	try {
		if (!TWITCH_USER_ID || !CHANNEL) {
			return;
		}

		const [response, roomResponse] = await Promise.all([
			fetch(`https://api.frankerfacez.com/v1/user/id/${TWITCH_USER_ID}`),
			fetch(
				`https://api.frankerfacez.com/v1/room/${encodeURIComponent(CHANNEL)}`,
			).catch(() => null),
		]);

		if (response.ok) {
			const data = await response.json();

			const badges = data.badges || {};

			for (const [id, badge] of Object.entries(badges)) {
				const image =
					badge.urls?.["4"] ||
					badge.urls?.["2"] ||
					badge.urls?.["1"] ||
					badge.image;

				if (!image) {
					continue;
				}

				const url = normalizeImageUrl(image);

				if (!url) {
					continue;
				}

				ffzBadges.set(String(id), {
					url,

					title: badge.title || badge.name || `FFZ ${id}`,
				});
			}
		}

		if (!roomResponse?.ok) {
			console.warn(`FFZ room badge request failed: ${roomResponse?.status}`);

			return;
		}

		const roomData = await roomResponse.json();

		const room = roomData.room || {};

		if (room.vip_badge) {
			ffzRoomBadges.vip = normalizeFFZRoomBadge(
				room.vip_badge,
				"FFZ Custom VIP",
			);
		} else {
			ffzRoomBadges.vip = null;
		}

		if (room.moderator_badge) {
			ffzRoomBadges.moderator = normalizeFFZRoomBadge(
				room.moderator_badge,
				"FFZ Custom Moderator",
			);
		} else {
			ffzRoomBadges.moderator = null;
		}

		if (ffzRoomBadges.vip?.url) {
			preloadBadgeImage(ffzRoomBadges.vip.url);
		}

		if (ffzRoomBadges.moderator?.url) {
			preloadBadgeImage(ffzRoomBadges.moderator.url);
		}
	} catch (error) {
		console.error("FFZ badge error:", error);
	}
}

async function refreshFFZRoomBadges() {
	if (typeof previewActive !== "undefined" && previewActive) {
		return false;
	}

	const snapshot = () =>
		JSON.stringify([ffzRoomBadges.vip, ffzRoomBadges.moderator]);

	const before = snapshot();

	await loadFFZBadges();

	return before !== snapshot();
}

const badgeRefreshRunning = { fast: false, slow: false };
let badgeRefreshStarted = false;

async function refreshBadgeSource(loader) {
	try {
		return Boolean(await loader());
	} catch (error) {
		console.error("Badge refresh error:", error);

		return false;
	}
}

async function refreshBadgeRegistries(full) {
	const tier = full ? "slow" : "fast";

	if (document.hidden || badgeRefreshRunning[tier]) {
		return;
	}

	badgeRefreshRunning[tier] = true;

	try {
		const loaders = [loadMoltorinoBadges];

		if (full) {
			loaders.push(
				loadChatterinoBadges,
				loadHomiesBadges,
				loadBTTVBadges,
				loadDankChatBadges,
				refreshFFZRoomBadges,
			);
		}

		const results = await Promise.all(loaders.map(refreshBadgeSource));

		if (results.some(Boolean) && typeof onBadgeRegistriesChanged === "function") {
			onBadgeRegistriesChanged();
		}
	} finally {
		badgeRefreshRunning[tier] = false;
	}
}

function startBadgeRefreshLoop() {
	if (badgeRefreshStarted) {
		return;
	}

	badgeRefreshStarted = true;

	setInterval(() => refreshBadgeRegistries(false), BADGE_REFRESH_FAST_MS);
	setInterval(() => refreshBadgeRegistries(true), BADGE_REFRESH_SLOW_MS);

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) {
			refreshBadgeRegistries(true);
		}
	});
}