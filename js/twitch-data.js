const TWITCH_GQL_URL = "https://gql.twitch.tv/gql";
const TWITCH_PUBLIC_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

let twitchBadgesReadyPromise = Promise.resolve();

const TWITCH_COMMON_BADGE_FALLBACKS = [
	["partner", "1", "Twitch Partner", "d12a2e27-16f6-41d0-ab77-b780518f00a3"],
	["staff", "1", "Twitch Staff", "d97c37bd-a6f5-4c38-8f57-4e4bef88af34"],
	["admin", "1", "Twitch Admin", "9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe"],
	["broadcaster", "1", "Broadcaster", "5527c58c-fb7d-422d-b71b-f309dcb85cc1"],
	["moderator", "1", "Moderator", "3267646d-33f0-4b17-b3df-f923a41db1d0"],
	["vip", "1", "VIP", "b817aba4-fad8-49e2-b88a-7cc744dfa6ec"],
	["founder", "0", "Founder", "511b78a9-ab37-472f-9569-457753bbe7d3"],
	["artist-badge", "1", "Artist", "4300a897-03dc-4e83-8c0e-c332fee7057f"],
	["premium", "1", "Twitch Turbo", "bbbe0db0-a598-423e-86d0-f9fb98ca1933"],
	["no_audio", "1", "Watching without audio", "aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0"],
	["no_video", "1", "Watching without video", "199a0dba-58f3-494e-a7fc-1fa0a1001fb8"],
];

function addCommonTwitchBadges() {
	for (const [set, version, title, id] of TWITCH_COMMON_BADGE_FALLBACKS) {
		const key = `${set}/${version}`;
		if (twitchBadges.has(key)) continue;
		const base = `https://static-cdn.jtvnw.net/badges/v1/${id}`;
		twitchBadges.set(key, {
			title,
			url_1x: `${base}/1`,
			url_2x: `${base}/2`,
			url_4x: `${base}/3`,
		});
	}
}

function cacheTwitchBadgeDisplaySets(sets) {
	let loaded = 0;
	for (const [set, data] of Object.entries(sets || {})) {
		for (const [version, badge] of Object.entries(data?.versions || {})) {
			const imageUrl = badge.image_url_4x || badge.image_url_2x || badge.image_url_1x;
			if (!imageUrl) continue;
			twitchBadges.set(`${set}/${version}`, {
				title: badge.title || badge.description || set,
				url_1x: badge.image_url_1x || imageUrl,
				url_2x: badge.image_url_2x || imageUrl,
				url_4x: badge.image_url_4x || imageUrl,
			});
			loaded++;
		}
	}
	return loaded;
}

function cacheTwitchGraphQLBadges(badges) {
	let loaded = 0;

	for (const badge of Array.isArray(badges) ? badges : []) {
		const setId = badge?.setID || badge?.setId || badge?.set_id;

		const versionId = badge?.version ?? badge?.id;

		if (!setId || versionId == null) {
			continue;
		}

		const imageUrl = badge?.imageURL || badge?.imageUrl || badge?.image_url;

		if (!imageUrl) {
			continue;
		}

		twitchBadges.set(`${setId}/${versionId}`, {
			title: badge?.title || badge?.description || setId,
			url_1x: imageUrl,
			url_2x: imageUrl,
			url_4x: imageUrl,
		});

		loaded++;
	}

	return loaded;
}

async function twitchGraphQL(query) {
	const response = await fetch(TWITCH_GQL_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Client-ID": TWITCH_PUBLIC_CLIENT_ID,
		},
		body: JSON.stringify({ query }),
		cache: "no-store",
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		const detail =
			payload?.message ||
			payload?.error ||
			(Array.isArray(payload?.errors)
				? payload.errors
					.map((error) => error?.message || "Unknown GraphQL error")
					.join("; ")
				: "");

		throw new Error(
			`Twitch GraphQL returned ${response.status}` +
			(detail ? `: ${detail}` : ""),
		);
	}

	if (Array.isArray(payload?.errors) && payload.errors.length) {
		throw new Error(
			payload.errors
				.map((error) => error?.message || "Unknown GraphQL error")
				.join("; "),
		);
	}

	return payload?.data || {};
}

async function loadTwitchBadges() {
	const load = (async () => {
		let loaded = 0;

		const channelId = TWITCH_USER_ID
			? String(TWITCH_USER_ID).replace(/\\/g, "\\\\").replace(/"/g, '\\"')
			: null;

		const [globalResult, channelResult, globalDisplayResult, channelDisplayResult] = await Promise.allSettled([
			twitchGraphQL(
				`query {
					badges {
						imageURL(size: DOUBLE)
						description
						title
						setID
						version
					}
				}`,
			),
			channelId
				? twitchGraphQL(
					`query {
						user(id: "${channelId}") {
							broadcastBadges {
								imageURL(size: DOUBLE)
								description
								title
								setID
								version
							}
						}
					}`,
				)
				: Promise.resolve(null),
			fetch("https://badges.twitch.tv/v1/badges/global/display?language=en", { cache: "force-cache" }).then((response) => {
				if (!response.ok) throw new Error(`Twitch global badge catalog returned ${response.status}`);
				return response.json();
			}),
			channelId
				? fetch(`https://badges.twitch.tv/v1/badges/channels/${encodeURIComponent(channelId)}/display?language=en`, { cache: "force-cache" }).then((response) => {
					if (!response.ok) throw new Error(`Twitch channel badge catalog returned ${response.status}`);
					return response.json();
				})
				: Promise.resolve(null),
		]);

		if (globalResult.status === "fulfilled") {
			loaded += cacheTwitchGraphQLBadges(globalResult.value?.badges);
		} else {
			console.warn("Twitch global badge catalog unavailable:", globalResult.reason);
		}

		if (channelResult.status === "fulfilled") {
			loaded += cacheTwitchGraphQLBadges(
				channelResult.value?.user?.broadcastBadges,
			);
		} else {
			console.warn("Twitch channel badge catalog unavailable:", channelResult.reason);
		}

		if (globalDisplayResult.status === "fulfilled") {
			loaded += cacheTwitchBadgeDisplaySets(globalDisplayResult.value?.badge_sets);
		}

		if (channelDisplayResult.status === "fulfilled" && channelDisplayResult.value) {
			loaded += cacheTwitchBadgeDisplaySets(channelDisplayResult.value?.badge_sets);
		}

		addCommonTwitchBadges();

		if (!twitchBadges.has("subscriber/1")) {
			twitchBadges.set("subscriber/1", {
				title: "Subscriber",
				url_1x:
					"https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
				url_2x:
					"https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/2",
				url_4x:
					"https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3",
			});
		}

		console.log(
			`Loaded ${twitchBadges.size} Twitch badge definitions (${loaded} from Twitch GraphQL).`,
		);

		return true;
	})();

	twitchBadgesReadyPromise = load;
	return load;
}

const PREVIEW_LIVE_URLS = ["https://api.moltorino.com/v2/badges"];

const pfpCache = new Map();

async function getTwitchPfp(user, width = 300) {
	const isId = /^\d+$/.test(user);
	const key = `${isId ? "id" : "login"}:${String(user).toLowerCase()}:${width}`;

	if (!pfpCache.has(key)) {
		const safe = String(user).replace(/[^a-zA-Z0-9_]/g, "");
		const arg = isId ? `id: "${safe}"` : `login: "${safe.toLowerCase()}"`;

		pfpCache.set(
			key,
			twitchGraphQL(`query { user(${arg}) { profileImageURL(width: ${width}) } }`)
				.then((data) => data?.user?.profileImageURL || null)
				.catch(() => { pfpCache.delete(key); return null; }),
		);
	}

	return pfpCache.get(key);
}

let previewManifestPromise;
function installPreviewFetch() {
	const originalFetch = window.fetch;
	previewManifestPromise ??= originalFetch("preview-cache/manifest.json").then(
		(response) => response.json(),
	);

	window.fetch = async (input, init = {}) => {
		const requestUrl = typeof input === "string" ? input : input.url;

		if (PREVIEW_LIVE_URLS.includes(requestUrl)) {
			try {
				const liveResponse = await originalFetch(input, init);
				if (liveResponse.ok) return liveResponse;
			} catch {}
		}

		try {
			const manifest = await previewManifestPromise;
			const requestMethod = (init.method || input.method || "GET").toUpperCase();
			const requestBody = typeof init.body === "string" ? init.body : "";
			const cachedRequest = manifest.api.find(
				(entry) =>
					entry.url === requestUrl &&
					entry.method === requestMethod &&
					entry.body === requestBody,
			);

			if (cachedRequest) {
				const cachedResponse = await originalFetch(
					"preview-cache/" + cachedRequest.file,
				);
				return new Response(await cachedResponse.text(), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
		} catch {}

		return originalFetch(input, init);
	};

	return () => {
		window.fetch = originalFetch;
	};
}

async function loadPreviewEmotes() {
	const previousChannel = CHANNEL;
	const previousUserId = TWITCH_USER_ID;
	const restoreFetch = installPreviewFetch();

	CHANNEL = PREVIEW_CHANNEL;
	TWITCH_USER_ID = PREVIEW_TWITCH_USER_ID;
	seedPreviewTwitchBadges();

	const tasks = [ 
		load7TVGlobalEmotes(),
		load7TVEmotes(),
		loadFFZEmotes(),
		loadBTTVEmotes(),
		loadFFZBadges(),
		loadChatterinoBadges(),
		loadHomiesBadges(),
		loadBTTVBadges(),
		loadDankChatBadges(),
		loadMoltorinoBadges(),
	];
	tasks.push(loadTwitchBadges());
	tasks.push(loadFFZBotBadgeList());

	await Promise.allSettled(tasks);

	restoreFetch();
	CHANNEL = previousChannel;
	TWITCH_USER_ID = previousUserId;
}

const PREVIEW_TWITCH_BADGES = {
	"48hgold/1": {
		title: "48 Hour Sub Gold",
		url: "https://static-cdn.jtvnw.net/badges/v1/af11047c-a3b6-424d-808e-7fc7aaa0e74d/3",
	},
	"founder/1": {
		title: "Founder",
		url: "https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/3",
	},
	"subtember/1": {
		title: "Subtember",
		url: "https://static-cdn.jtvnw.net/badges/v1/a9c01f28-179e-486d-a4c7-2277e4f6adb4/3",
	},
	"subscriber/1": {
		title: "subscriber",
		url: "https://static-cdn.jtvnw.net/badges/v1/3a37cb42-c1dc-48c1-9262-6266ca29ebf3/3",
	},
	"pikachu/1": {
		title: "pikachu",
		url: "https://static-cdn.jtvnw.net/badges/v1/20f214cf-36b0-4b42-8992-3b769bcb0461/3",
	},
	"noob/1": {
		title: "noob",
		url: "https://static-cdn.jtvnw.net/badges/v1/d87a78f5-76d9-451f-8f31-752a369e6045/3",
	},
	"omecash/1": {
		title: "omecash",
		url: "https://static-cdn.jtvnw.net/badges/v1/4cae4630-f0fd-4642-bd2d-120017968d61/3",
	},
	"bot/1": {
		title: "bot",
		url: "https://static-cdn.jtvnw.net/badges/v1/3ffa9565-c35b-4cad-800b-041e60659cf2/3",
	},
	"ewcgold/1": {
		title: "EWC Cold",
		url: "https://static-cdn.jtvnw.net/badges/v1/aa891ef7-b24b-49ff-ae08-13819621fc4b/3",
	},
	"custommod/1": {
		title: "ffz mod",
		url: "https://cdn.frankerfacez.com/room-badge/mod/id/195845559/v/b25f904c/4",
	}
};

function seedPreviewTwitchBadges() {
	for (const [key, badge] of Object.entries(PREVIEW_TWITCH_BADGES)) {
		twitchBadges.set(key, {
			title: badge.title,
			url_1x: badge.url,
			url_2x: badge.url,
			url_4x: badge.url,
		});
	}
}

const PREVIEW_CHANNEL = "marz_dev";
const PREVIEW_TWITCH_USER_ID = "1208634685";
