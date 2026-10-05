const KICK_PUSHER_URL =
	"wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679" +
	"?protocol=7&client=js&version=8.4.0&flash=false";

const KICK_CHANNEL_ENDPOINTS = [
	"https://kick.com/api/v2/channels/",
	"https://kick.com/api/v1/channels/",
];

const KICK_EMOTE_TOKEN = /\[emote:(\d+):([^\]]+)\]/g;

const KICK_BOTS = new Set([
	"botrix",
	"kickbot",
	"nightbot",
	"moobot",
	"streamelements",
	"streamlabs",
	"fossabot",
]);

const KICK_BADGE_ORDER = [
	"broadcaster",
	"owner",
	"staff",
	"moderator",
	"verified",
	"sidekick",
	"og",
	"vip",
	"founder",
	"sub_gifter",
	"subscriber",
];

const KICK_BADGE_BASE = (
	params.get("kickBadgeBase") || "https://www.kickdatabase.com/kickBadges/"
).replace(/\/*$/, "/");

const KICK_BADGE_FILES = {
	broadcaster: "broadcaster",
	owner: "broadcaster",
	moderator: "moderator",
	vip: "vip",
	og: "og",
	founder: "founder",
	staff: "staff",
	verified: "verified",
	sidekick: "sidekick",
	subscriber: "subscriber",
	sub_gifter: "subGifter",
};

function kickBadgeUrl(type, count = 0) {
	let file = KICK_BADGE_FILES[type];

	if (!file) {
		return null;
	}

	if (type === "sub_gifter") {
		const tier = [200, 100, 50, 25].find((value) => count >= value);

		file = tier ? `subGifter${tier}` : "subGifter";
	}

	return `${KICK_BADGE_BASE}${file}.svg`;
}

const KICK_GLYPHS = {
	camera:
		'<rect x="5" y="10" width="15" height="12" rx="2"/>' +
		'<path d="M22 14.5l5-3v9l-5-3z"/>',
	sword:
		'<path d="M24 5l3 3-11 11-3-3z"/>' +
		'<path d="M11 16l5 5-2 2-5-5z"/>' +
		'<path d="M8 20l4 4-3 3-2-2-2 1 1-2z"/>',
	gem: '<path d="M10 7h12l5 7-11 13L5 14z"/>',
	crown: '<path d="M5 24V10l6 5 5-8 5 8 6-5v14z"/>',
	star:
		'<path d="M16 4.5l3.5 7.2 7.9 1.1-5.7 5.5 1.4 7.8L16 22.4l-7.1 3.7 ' +
		'1.4-7.8-5.7-5.5 7.9-1.1z"/>',
	gift:
		'<path d="M6 12h20v5H6zM8 18h16v9H8z"/>' +
		'<path d="M16 12c-3-6-9-4-6 0M16 12c3-6 9-4 6 0" fill="none" ' +
		'stroke="#fff" stroke-width="2.4"/>',
	shield:
		'<path d="M16 4l10 3.5V16c0 5.5-4.3 9.5-10 12C10.3 25.5 6 21.5 6 16V7.5z"/>',
};

let kickBadgeIconCache = null;

function getKickBadgeIcons() {
	if (!kickBadgeIconCache) {
		const broadcaster = glyphBadgeIcon("#e91916", KICK_GLYPHS.camera);

		kickBadgeIconCache = {
			broadcaster,
			owner: broadcaster,
			moderator: glyphBadgeIcon("#00a94f", KICK_GLYPHS.sword),
			vip: glyphBadgeIcon("#d62ecf", KICK_GLYPHS.gem),
			og: glyphBadgeIcon("#e08a00", KICK_GLYPHS.crown),
			founder: glyphBadgeIcon("#b8860b", KICK_GLYPHS.star),
			sub_gifter: glyphBadgeIcon("#2563eb", KICK_GLYPHS.gift),
			staff: glyphBadgeIcon("#2b2b2b", KICK_GLYPHS.shield),
			subscriber: glyphBadgeIcon("#2fa80e", KICK_GLYPHS.star),
			sidekick: glyphBadgeIcon("#7c3aed", KICK_GLYPHS.star),
			verified: checkBadgeIcon("#2fb80f"),
		};
	}

	return kickBadgeIconCache;
}

let kickSocket = null;
let kickReconnectTimer = null;
let kickDataReady = Promise.resolve();

const kickSeenEvents = new Set();

function markKickSeen(key) {
	if (!key) {
		return true;
	}

	if (kickSeenEvents.has(key)) {
		return false;
	}

	kickSeenEvents.add(key);

	if (kickSeenEvents.size > 3000) {
		kickSeenEvents.delete(kickSeenEvents.values().next().value);
	}

	return true;
}

function kickTimeBucket() {
	return Math.floor(Date.now() / 5000);
}

async function resolveKickChannel(slug) {
	const manualChatroom = params.get("kickChatroom");

	if (manualChatroom) {
		KICK_CHATROOM_ID = String(manualChatroom);
		KICK_USER_ID = params.get("kickUserId") || null;
		KICK_CHANNEL_ID = params.get("kickChannelId") || null;

		return;
	}

	const encodedSlug = encodeURIComponent(slug.replace(/_/g, "-"));

	let data = null;
	let lastStatus = 0;

	for (const base of KICK_CHANNEL_ENDPOINTS) {
		try {
			const response = await platformFetch(base + encodedSlug, {
				headers: { Accept: "application/json" },
			});

			if (!response.ok) {
				lastStatus = response.status;

				continue;
			}

			data = await response.json();

			break;
		} catch (error) {
			console.warn("Kick channel lookup failed:", base, error);
		}
	}

	if (!data) {
		throw new Error(
			`Kick channel lookup failed: ${lastStatus || "network error"}`,
		);
	}

	KICK_CHATROOM_ID = data?.chatroom?.id != null ? String(data.chatroom.id) : null;

	KICK_CHANNEL_ID = data?.id != null ? String(data.id) : null;

	KICK_USER_ID =
		data?.user_id != null
			? String(data.user_id)
			: data?.user?.id != null
				? String(data.user.id)
				: null;

	kickSubscriberBadges = (data?.subscriber_badges || [])
		.map((badge) => ({
			months: Number(badge?.months) || 0,
			url: normalizeImageUrl(badge?.badge_image?.src) || null,
		}))
		.filter((badge) => badge.url)
		.sort((a, b) => a.months - b.months);

	if (!KICK_CHATROOM_ID) {
		throw new Error("Kick channel lookup returned no chatroom id.");
	}
}

function pickKickSubscriberBadge(months) {
	if (!kickSubscriberBadges.length) {
		return null;
	}

	let chosen = kickSubscriberBadges[0];

	for (const badge of kickSubscriberBadges) {
		if (badge.months <= months) {
			chosen = badge;
		}
	}

	return chosen.url;
}

function kickBadgeRank(type) {
	const index = KICK_BADGE_ORDER.indexOf(type);

	return index === -1 ? KICK_BADGE_ORDER.length : index;
}

function buildKickBadges(rawBadges) {
	const icons = getKickBadgeIcons();
	const entries = [];

	for (const badge of Array.isArray(rawBadges) ? rawBadges : []) {
		const type = String(badge?.type || "").toLowerCase();
		const count = Number(badge?.count) || 0;
		const label = badge?.text || type;

		if (type === "subscriber") {
			const custom = pickKickSubscriberBadge(count);

			entries.push({
				type,
				url: custom || kickBadgeUrl("subscriber"),
				fallback: icons.subscriber,
				title: count > 1 ? `${label} (${count} months)` : label,
			});

			continue;
		}

		const url = kickBadgeUrl(type, count);

		if (!url) {
			continue;
		}

		entries.push({
			type,
			url,
			fallback: icons[type] || null,
			title: type === "sub_gifter" && count > 0 ? `${label} (${count})` : label,
		});
	}

	entries.sort((a, b) => kickBadgeRank(a.type) - kickBadgeRank(b.type));

	return entries.map(({ url, title, fallback }) => ({ url, title, fallback }));
}

function parseKickContent(content) {
	const segments = [];
	let cursor = 0;

	for (const match of content.matchAll(KICK_EMOTE_TOKEN)) {
		if (match.index > cursor) {
			segments.push({ type: "text", text: content.slice(cursor, match.index) });
		}

		segments.push({
			type: "emote",
			url: `https://files.kick.com/emotes/${match[1]}/fullsize`,
			name: match[2],
		});

		cursor = match.index + match[0].length;
	}

	if (cursor < content.length) {
		segments.push({ type: "text", text: content.slice(cursor) });
	}

	return segments;
}

function handleKickChatMessage(data) {
	const sender = data?.sender || {};
	const username = sender.username || sender.slug || "Unknown";
	const login = String(sender.slug || username).toLowerCase();
	const userId = sender.id != null ? String(sender.id) : null;
	const identity = sender.identity || {};
	const content = String(data?.content || "");

	if (!markKickSeen(data?.id ? `msg:${data.id}` : null)) {
		return;
	}

	if (!botsEnabled && (KICK_BOTS.has(login) || isCommandMessage(content))) {
		return;
	}

	const replyTo = data?.metadata?.original_sender?.username || "";
	const replyBody = data?.metadata?.original_message?.content || "";

	const extraTags = replyTo
		? {
				"reply-parent-display-name": replyTo,
				"reply-parent-msg-body": replyBody,
			}
		: {};

	kickDataReady
		.catch(() => {})
		.then(() =>
			emitPlatformMessage({
				platform: "kick",
				username,
				color: getTwitchDisplayColor(identity.color, login),
				userId,
				messageId: data?.id ? String(data.id) : null,
				segments: parseKickContent(content),
				badges: buildKickBadges(identity.badges),
				extraTags,
			}),
		);
}

function handleKickReward(data) {
	const username = String(data?.username || "").trim();

	if (!username) {
		return;
	}

	const title = String(data?.reward_title || "Reward");
	const userId = data?.user_id != null ? String(data.user_id) : null;
	const input = String(data?.user_input || "").trim();

	if (!markKickSeen(`reward:${userId || username}:${title}:${kickTimeBucket()}`)) {
		return;
	}

	kickDataReady
		.catch(() => {})
		.then(() =>
			emitPlatformMessage({
				platform: "kick",
				username,
				color: getTwitchDisplayColor("", username.toLowerCase()),
				userId,
				messageId: null,
				segments: parseKickContent(input || `redeemed ${title}`),
				extraTags: {
					"custom-reward-id": `kick:${title}`,
					"hl-label": title,
					"is-action": !input,
				},
			}),
		);
}

function handleKickSubscription(data) {
	const username = String(data?.username || "").trim();

	if (!username) {
		return;
	}

	if (!markKickSeen(`sub:${username}:${kickTimeBucket()}`)) {
		return;
	}

	const months = Number(data?.months) || 1;

	appendNoticeCard({
		name: username,
		text: months > 1 ? `Subscribed for ${months} months` : "Subscribed",
	});
}

function handleKickGiftedSubscriptions(data) {
	const recipients = Array.isArray(data?.gifted_usernames)
		? data.gifted_usernames.filter(Boolean)
		: [];

	if (!recipients.length || !hlGiftsEnabled) {
		return;
	}

	const gifter = String(data?.gifter_username || "Anonymous");

	if (!markKickSeen(`gift:${gifter}:${recipients.join(",")}:${kickTimeBucket()}`)) {
		return;
	}

	if (recipients.length === 1) {
		hlAppendToChat(
			createSubGiftCard({
				gifter,
				recipient: String(recipients[0]),
				tier: "",
			}),
		);

		return;
	}

	hlAppendToChat(
		createMassGiftCard({
			gifter,
			count: recipients.length,
			senderCount: Number(data?.gifter_total) || 0,
			tier: "",
		}),
	);
}

function getKickChannels() {
	const channels = [
		`chatrooms.${KICK_CHATROOM_ID}.v2`,
		`chatroom_${KICK_CHATROOM_ID}`,
	];

	if (KICK_CHANNEL_ID) {
		channels.push(`channel.${KICK_CHANNEL_ID}`);
	}

	return channels;
}

function handleKickPusherEvent(message) {
	const event = message?.event;

	if (event === "pusher:ping") {
		kickSocket?.send(JSON.stringify({ event: "pusher:pong", data: {} }));
		return;
	}

	if (event === "pusher:connection_established") {
		for (const channel of getKickChannels()) {
			kickSocket?.send(
				JSON.stringify({
					event: "pusher:subscribe",
					data: { auth: "", channel },
				}),
			);
		}

		return;
	}

	if (typeof event !== "string" || !event.startsWith("App\\Events\\")) {
		return;
	}

	let data = message.data;

	try {
		data = typeof data === "string" ? JSON.parse(data) : data;
	} catch {
		return;
	}

	switch (event) {
		case "App\\Events\\ChatMessageEvent":
			handleKickChatMessage(data);
			break;

		case "App\\Events\\MessageDeletedEvent":
			removePlatformMessage(data?.message?.id);
			break;

		case "App\\Events\\UserBannedEvent":
			removePlatformUserMessages("kick", data?.user?.id);
			break;

		case "App\\Events\\ChatroomClearEvent":
			clearPlatformMessages("kick");
			break;

		case "App\\Events\\RewardRedeemedEvent":
			handleKickReward(data);
			break;

		case "App\\Events\\SubscriptionEvent":
			handleKickSubscription(data);
			break;

		case "App\\Events\\GiftedSubscriptionsEvent":
			handleKickGiftedSubscriptions(data);
			break;
	}
}

function connectKickSocket() {
	clearTimeout(kickReconnectTimer);

	const socket = new WebSocket(KICK_PUSHER_URL);

	kickSocket = socket;

	socket.onopen = () => console.log("Connected to Kick (Pusher).");

	socket.onmessage = (event) => {
		try {
			handleKickPusherEvent(JSON.parse(event.data));
		} catch (error) {
			console.error("Kick message error:", error);
		}
	};

	socket.onerror = (error) => console.error("Kick WebSocket error:", error);

	socket.onclose = (event) => {
		console.log("Kick WebSocket closed:", event.code, event.reason);

		if (kickSocket === socket) {
			kickSocket = null;
		}

		kickReconnectTimer = setTimeout(connectKickSocket, 3000);
	};
}

async function startKickChat(slug) {
	KICK_CHANNEL = slug;

	await resolveKickChannel(slug);

	console.log(
		"Kick chatroom:",
		KICK_CHATROOM_ID,
		"channel:",
		KICK_CHANNEL_ID,
		"user:",
		KICK_USER_ID,
	);

	kickDataReady = load7TVKickEmotes();

	connectKickSocket();

	await kickDataReady;
}