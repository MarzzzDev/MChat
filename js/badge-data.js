const homiesBadges = new Map();

const sevenTVBadgeUrlCache = new Map();

const HOMIES_BADGE_URLS = [
	"https://chatterinohomies.com/api/badges/list",
	"https://itzalex.github.io/badges",
	"https://itzalex.github.io/badges2",
];

async function loadHomiesBadges() {
	homiesBadges.clear();

	const results = await Promise.allSettled(
		HOMIES_BADGE_URLS.map(async (url) => {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`${url}: ${response.status}`);
			}

			return response.json();
		}),
	);

	results.forEach((result, index) => {
		if (result.status !== "fulfilled") {
			console.error(
				"Homies badge source failed:",
				HOMIES_BADGE_URLS[index],
				result.reason,
			);
			return;
		}

		for (const badge of result.value?.badges || []) {
			const url = normalizeImageUrl(
				badge.image3 || badge.image2 || badge.image1,
			);

			if (!url) {
				continue;
			}

			const title = badge.tooltip || "Homies Badge";

			const ids = Array.isArray(badge.users) ? badge.users.slice() : [];
			if (badge.userId) ids.push(badge.userId);

			for (const rawId of ids) {
				const id = String(rawId).trim();

				if (!id) {
					continue;
				}

				if (!homiesBadges.has(id)) {
					homiesBadges.set(id, []);
				}

				homiesBadges.get(id).push({ url, title });
			}
		}
	});
}

const bttvBadges = new Map();
const dankchatBadges = new Map();
const moltorinoBadges = new Map();

const DANKCHAT_BADGE_API = "https://flxrs.com/api/badges";

const DANKCHAT_BADGE_PROXY = "https://dank-chat-badges.marseceva.workers.dev";

const DANKCHAT_BADGE_SOURCES = [
	{ label: DANKCHAT_BADGE_PROXY, load: () => fetch(DANKCHAT_BADGE_PROXY) },
	{ label: DANKCHAT_BADGE_API, load: () => platformFetch(DANKCHAT_BADGE_API) },
];

async function loadBTTVBadges() {
	try {
		const response = await fetch(
			"https://api.betterttv.net/3/cached/badges/twitch",
		);

		if (!response.ok) {
			throw new Error(`BTTV badges: ${response.status}`);
		}

		const data = await response.json();

		bttvBadges.clear();

		for (const entry of Array.isArray(data) ? data : []) {
			const id = String(entry?.providerId || "").trim();

			const url = normalizeImageUrl(entry?.badge?.svg);

			if (!id || !url) {
				continue;
			}

			if (!bttvBadges.has(id)) {
				bttvBadges.set(id, []);
			}

			bttvBadges.get(id).push({
				url,
				title: entry?.badge?.description || "BTTV Badge",
			});
		}
	} catch (error) {
		console.error("BTTV badge error:", error);
	}
}

async function loadDankChatBadges() {
	try {
		let data = null;

		for (const source of DANKCHAT_BADGE_SOURCES) {
			try {
				const response = await source.load();

				if (!response.ok) {
					throw new Error(`${source.label}: ${response.status}`);
				}

				data = await response.json();

				break;
			} catch (error) {
				console.warn("DankChat badge source failed:", source.label, error);
			}
		}

		if (!data) {
			throw new Error("DankChat badges: all sources failed");
		}

		dankchatBadges.clear();

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

				if (!dankchatBadges.has(id)) {
					dankchatBadges.set(id, []);
				}

				dankchatBadges.get(id).push({ url, title });
			}
		}

	} catch (error) {
		console.error("DankChat badge error:", error);
	}
}

async function loadMoltorinoBadges() {
	try {
		const response = await fetch("https://api.moltorino.com/v2/badges");

		if (!response.ok) {
			throw new Error(`Moltorino badges: ${response.status}`);
		}

		const data = await response.json();

		const definitions = new Map();

		for (const badge of data?.badges || []) {
			const url = normalizeImageUrl(
				badge?.images?.["4x"] ||
				badge?.images?.["3x"] ||
				badge?.images?.["2x"] ||
				badge?.images?.["1x"],
			);

			if (!badge?.id || !url) {
				continue;
			}

			definitions.set(String(badge.id), {
				url,
				title: badge.tooltip || "Moltorino Badge",
				priority: Number(badge.priority) || 0,
			});
		}

		moltorinoBadges.clear();

		for (const [rawId, user] of Object.entries(data?.users || {})) {
			const id = String(rawId).trim();

			if (!id || !user) {
				continue;
			}

			let definition = null;

			if (Object.prototype.hasOwnProperty.call(user, "activeBadge")) {
				if (user.activeBadge === null) {
					continue;
				}

				definition = definitions.get(String(user.activeBadge));
			}

			if (!definition) {
				for (const badgeId of user.badges || []) {
					const candidate = definitions.get(String(badgeId));

					if (
						candidate &&
						(!definition || candidate.priority < definition.priority)
					) {
						definition = candidate;
					}
				}
			}

			if (!definition) {
				continue;
			}

			moltorinoBadges.set(id, [
				{
					url: definition.url,
					title: definition.title,
				},
			]);
		}
	} catch (error) {
		console.error("Moltorino badge error:", error);
	}
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
