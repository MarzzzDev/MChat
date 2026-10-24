async function createExternalBadges(userId, tags = null) {
	const container = document.createElement("span");

	container.className = "badges external-badges";

	if (!userId) {
		return container;
	}

	userId = String(userId);

	if (externalBadgeCache.has(userId)) {
		const cached = externalBadgeCache.get(userId);

		for (const badge of cached) {
			if (!isBadgeProviderEnabled(badge.provider)) {
				continue;
			}

			if (
				badge.provider === "FFZ" &&
				badge.type === "vip" &&
				ffzRoomBadges.vip &&
				hasTwitchBadge(tags, "vip")
			) {
				continue;
			}

			const img = createBadge(badge.url, badge.title);

			if (img) {
				container.appendChild(img);
			}
		}

		return container;
	}

	if (externalBadgePromises.has(userId)) {
		const badges = await externalBadgePromises.get(userId);

		for (const badge of badges) {
			if (!isBadgeProviderEnabled(badge.provider)) {
				continue;
			}

			if (
				badge.provider === "FFZ" &&
				badge.type === "vip" &&
				ffzRoomBadges.vip &&
				hasTwitchBadge(tags, "vip")
			) {
				continue;
			}

			const img = createBadge(badge.url, badge.title);

			if (img) {
				container.appendChild(img);
			}
		}

		return container;
	}

	const promise = (async () => {
		const badges = [];
		const ffzUser = await getFFZUser(userId);

		if (ffzUser) {
			const ffzUserBadges = ffzUser.badges || {};

			for (const [id, badge] of Object.entries(ffzUserBadges)) {
				if (
					ffzRoomBadges.vip &&
					hasTwitchBadge(tags, "vip") &&
					isFFZVipBadge(id, badge)
				) {
					continue;
				}

				const url =
					badge?.urls?.["4"] ||
					badge?.urls?.["2"] ||
					badge?.urls?.["1"] ||
					badge?.image;

				if (!url) {
					continue;
				}

				const normalizedUrl = normalizeImageUrl(url);

				if (!normalizedUrl) {
					continue;
				}

				badges.push({
					url: normalizedUrl,

					title: badge?.title || badge?.name || `FFZ ${id}`,

					provider: "FFZ",

					type: isFFZVipBadge(id, badge) ? "vip" : null,
				});

				preloadBadgeImage(normalizedUrl);
			}
		}

		const sevenTV = await load7TVUserBadges(userId);

		for (const badge of sevenTV) {
			let url = badge.loadedUrl || null;

			if (!url) {
				for (const candidate of badge.urls || []) {
					const image = await preloadBadgeImage(candidate);

					if (image) {
						url = candidate;

						break;
					}
				}
			}

			if (!url) {
				continue;
			}

			badges.push({
				url,

				title: badge.name || "7TV",

				provider: "7TV",

				type: null,
			});
		}

		const chatterino = chatterinoBadges.get(userId) || [];

		for (const badge of chatterino) {
			const image = await preloadBadgeImage(badge.url);

			if (!image) {
				continue;
			}

			badges.push({
				url: badge.url,

				title: badge.title,

				provider: "Chatterino",

				type: null,
			});
		}

		const homies = homiesBadges.get(userId) || [];

		for (const badge of homies) {
			const image = await preloadBadgeImage(badge.url);

			if (!image) {
				continue;
			}

			badges.push({
				url: badge.url,

				title: badge.title,

				provider: "Homies",

				type: null,
			});
		}

		const bttv = bttvBadges.get(userId) || [];

		for (const badge of bttv) {
			const image = await preloadBadgeImage(badge.url);

			if (!image) {
				continue;
			}

			badges.push({
				url: badge.url,

				title: badge.title,

				provider: "BTTV",

				type: null,
			});
		}

		const dankchat = dankchatBadges.get(userId) || [];

		for (const badge of dankchat) {
			const image = await preloadBadgeImage(badge.url);

			if (!image) {
				continue;
			}

			badges.push({
				url: badge.url,

				title: badge.title,

				provider: "DankChat",

				type: null,
			});
		}

		const moltorino = moltorinoBadges.get(userId) || [];

		for (const badge of moltorino) {
			const image = await preloadBadgeImage(badge.url);

			if (!image) {
				continue;
			}

			badges.push({
				url: badge.url,

				title: badge.title,

				provider: "Moltorino",

				type: null,
			});
		}

		return badges;
	})();

	externalBadgePromises.set(userId, promise);

	try {
		const badges = await promise;

		externalBadgeCache.set(userId, badges);

		for (const badge of badges) {
			if (!isBadgeProviderEnabled(badge.provider)) {
				continue;
			}

			if (
				badge.provider === "FFZ" &&
				badge.type === "vip" &&
				ffzRoomBadges.vip &&
				hasTwitchBadge(tags, "vip")
			) {
				continue;
			}

			const img = createBadge(badge.url, badge.title);

			if (img) {
				container.appendChild(img);
			}
		}

		return container;
	} finally {
		externalBadgePromises.delete(userId);
	}
}

async function load7TVUserBadges(userId, platform = "twitch") {
	if (!userId) {
		return [];
	}

	userId = String(userId);

	const cacheKey = platform === "twitch" ? userId : `${platform}:${userId}`;

	if (sevenTVBadges.has(cacheKey)) {
		return sevenTVBadges.get(cacheKey);
	}

	const { badge } = await get7TVStyle(userId, platform);

	if (!badge?.id) {
		sevenTVBadges.set(cacheKey, []);

		return [];
	}

	const badgeId = encodeURIComponent(String(badge.id));

	const badgeData = {
		id: String(badge.id),

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

	const badges = badgeData.loadedUrl ? [badgeData] : [];

	sevenTVBadges.set(cacheKey, badges);

	return badges;
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