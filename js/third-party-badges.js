const FFZ_USER_BADGE_TTL_MS = 5 * 60 * 1000;
const FFZ_USER_BADGE_EMPTY_TTL_MS = 60 * 1000;
const FFZ_USER_BADGE_CACHE_LIMIT = 3000;

const ffzUserBadgeCache = new Map();
const ffzUserBadgePending = new Map();

function getFFZUserBadges(userId) {
	const cached = ffzUserBadgeCache.get(userId);

	if (cached && Date.now() - cached.t < cached.ttl) {
		return Promise.resolve(cached.badges);
	}

	if (ffzUserBadgePending.has(userId)) {
		return ffzUserBadgePending.get(userId);
	}

	const promise = (async () => {
		const ffzUser = await getFFZUser(userId);

		const badges = [];

		for (const [id, badge] of Object.entries(ffzUser?.badges || {})) {
			const url = normalizeImageUrl(
				badge?.urls?.["4"] ||
				badge?.urls?.["2"] ||
				badge?.urls?.["1"] ||
				badge?.image,
			);

			if (!url) {
				continue;
			}

			badges.push({
				url,
				title: badge?.title || badge?.name || `FFZ ${id}`,
				isVip: isFFZVipBadge(id, badge),
			});

			preloadBadgeImage(url);
		}

		setBoundedCache(
			ffzUserBadgeCache,
			userId,
			{
				t: Date.now(),
				ttl: ffzUser ? FFZ_USER_BADGE_TTL_MS : FFZ_USER_BADGE_EMPTY_TTL_MS,
				badges,
			},
			FFZ_USER_BADGE_CACHE_LIMIT,
		);

		return badges;
	})().finally(() => {
		ffzUserBadgePending.delete(userId);
	});

	ffzUserBadgePending.set(userId, promise);

	return promise;
}

function pushRegistryBadgeEntries(entries, list, provider, categoryFor) {
	for (const badge of list) {
		if (!badge?.url || isBadgeUrlFailed(badge.url)) {
			continue;
		}

		preloadBadgeImage(badge.url);

		entries.push({
			key: `${provider}|${badge.url}`,
			category: categoryFor(badge),
			provider: provider.toLowerCase(),
			type: null,
			url: badge.url,
			title: badge.title,
			fromTwitch: false,
		});
	}
}

async function getExternalBadgeEntries(userId, tags = null) {
	if (!userId) {
		return [];
	}

	userId = String(userId);

	const [ffz, sevenTV] = await Promise.all([
		isBadgeProviderEnabled("FFZ") ? getFFZUserBadges(userId) : [],
		isBadgeProviderEnabled("7TV") ? load7TVUserBadges(userId) : [],
	]);

	const entries = [];

	for (const badge of ffz) {
		if (
			badge.isVip &&
			ffzRoomBadges.vip &&
			hasTwitchBadge(tags, "vip")
		) {
			continue;
		}

		if (isBadgeUrlFailed(badge.url)) {
			continue;
		}

		entries.push({
			key: `ffz-user|${badge.url}`,
			category: "ff",
			provider: "ffz",
			type: badge.isVip ? "vip" : null,
			url: badge.url,
			title: badge.title,
			fromTwitch: false,
		});
	}

	if (isBadgeProviderEnabled("Chatterino")) {
		pushRegistryBadgeEntries(
			entries,
			chatterinoBadges.get(userId) || [],
			"Chatterino",
			() => "c",
		);
	}

	if (isBadgeProviderEnabled("Moltorino")) {
		pushRegistryBadgeEntries(
			entries,
			moltorinoBadges.get(userId) || [],
			"Moltorino",
			() => "m",
		);
	}

	for (const badge of sevenTV) {
		if (!badge.loadedUrl || isBadgeUrlFailed(badge.loadedUrl)) {
			continue;
		}

		entries.push({
			key: `7tv|${badge.loadedUrl}`,
			category: "7",
			provider: "7tv",
			type: null,
			url: badge.loadedUrl,
			title: badge.name || "7TV",
			fromTwitch: false,
		});
	}

	if (isBadgeProviderEnabled("Homies")) {
		pushRegistryBadgeEntries(
			entries,
			homiesBadges.get(userId) || [],
			"Homies",
			(badge) => badge.category || "hs",
		);
	}

	if (isBadgeProviderEnabled("BTTV")) {
		pushRegistryBadgeEntries(
			entries,
			bttvBadges.get(userId) || [],
			"BTTV",
			() => "bt",
		);
	}

	if (isBadgeProviderEnabled("DankChat")) {
		pushRegistryBadgeEntries(
			entries,
			dankchatBadges.get(userId) || [],
			"DankChat",
			() => "dc",
		);
	}

	return entries;
}
async function load7TVUserBadges(userId, platform = "twitch") {
	if (!userId) {
		return [];
	}

	userId = String(userId);

	const cacheKey = platform === "twitch" ? userId : `${platform}:${userId}`;

	const { badge } = await get7TVStyle(userId, platform);

	const styleId = badge?.id ? String(badge.id) : null;

	const cached = sevenTVBadges.get(cacheKey);

	if (cached && cached.styleId === styleId) {
		return cached.list;
	}

	if (!styleId) {
		sevenTVBadges.set(cacheKey, { styleId: null, list: [] });

		return [];
	}

	const badgeId = encodeURIComponent(styleId);

	const badgeData = {
		id: styleId,

		name: badge.name || "7TV Badge",

		urls: [
			`https://cdn.7tv.app/badge/${badgeId}/3x.webp`,
			`https://cdn.7tv.app/badge/${badgeId}/4x.webp`,
			`https://cdn.7tv.app/badge/${badgeId}/2x.webp`,
			`https://cdn.7tv.app/badge/${badgeId}/1x.webp`,
			`https://cdn.7tv.app/badge/${badgeId}/3x`,
			`https://cdn.7tv.app/badge/${badgeId}/4x`,
			`https://cdn.7tv.app/badge/${badgeId}/2x`,
			`https://cdn.7tv.app/badge/${badgeId}/1x`,
		],

		loadedUrl: null,
	};

	if (!sevenTVBadgeUrlCache.has(badgeData.id)) {
		sevenTVBadgeUrlCache.set(
			badgeData.id,
			pickFirstLoaded(badgeData.urls, preloadBadgeImage),
		);
	}

	badgeData.loadedUrl = await sevenTVBadgeUrlCache.get(badgeData.id);

	const list = badgeData.loadedUrl ? [badgeData] : [];

	sevenTVBadges.set(cacheKey, { styleId, list });

	return list;
}

async function create7TVBadges(userId, platform = "twitch") {
	const container = document.createElement("span");

	container.className = "badges external-badges";

	if (!userId || !badgeSeventv) {
		return container;
	}

	const badges = await load7TVUserBadges(userId, platform);

	for (const badge of badges) {
		const img = createBadge(badge.loadedUrl, badge.name || "7TV");

		if (img) {
			img.dataset.badgeProvider = "7tv";

			container.appendChild(img);
		}
	}

	return container;
}

async function getFFZUser(userId) {
	if (!userId) {
		return null;
	}

	try {
		const response = await fetch(
			`https://api.frankerfacez.com/v1/user/id/${userId}`,
		);

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch {
		return null;
	}
}