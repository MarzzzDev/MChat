let sevenTVEventSocket = null;
let sevenTVSessionId = null;
let sevenTVEmoteSetId = null;
let sevenTVHeartbeatTimeout = null;
let sevenTVReconnectTimer = null;
let sevenTVHeartbeatMs = 0;
let sevenTVHadSession = false;
const sevenTVSubscriptions = new Set();

const SEVENTV_OPCODES = Object.freeze({
	DISPATCH: 0,
	HELLO: 1,
	HEARTBEAT: 2,
	RECONNECT: 4,
	ACK: 5,
	ERROR: 6,
	END_OF_STREAM: 7,
	IDENTIFY: 33,
	RESUME: 34,
	SUBSCRIBE: 35,
	UNSUBSCRIBE: 36,
});

function add7TVPersonalEmote(username, name, activeEmote) {
	username = String(username || "")
		.trim()
		.toLowerCase();

	name = String(name || "").trim();

	if (!username || !name || !activeEmote) {
		return;
	}

	const data = activeEmote.data;

	const host = get7TVHostUrl(activeEmote);

	if (!data || !host) {
		return;
	}

	const webpFiles = Array.isArray(data.host?.files)
		? data.host.files
			.filter((file) => file?.format === "WEBP")
			.slice()
			.sort((a, b) => Number(a?.width || 0) - Number(b?.width || 0))
		: [];

	const maxSizeName = webpFiles.length
		? webpFiles[webpFiles.length - 1]?.name
		: null;

	if (!maxSizeName) {
		return;
	}

	const zeroWidth =
		Boolean(Number(activeEmote.flags || 0) & 1) ||
		Boolean(Number(data.flags || 0) & 256);

	const normalizedEmote = {
		platform: "7TV",

		id: data.id
			? String(data.id)
			: activeEmote.id
				? String(activeEmote.id)
				: null,

		name,

		image: `${host}/${maxSizeName}`,

		global: false,

		listed: data.listed !== false,

		zeroWidth,

		originalName: activeEmote.name === data.name ? null : data.name || null,
	};

	if (!sevenTVPersonalEmotes.has(username)) {
		sevenTVPersonalEmotes.set(username, new Map());
	}

	sevenTVPersonalEmotes.get(username).set(name, normalizedEmote);

	console.debug(
		"[7TV] Personal emote added:",
		username,
		name,
		normalizedEmote.image,
	);
}

function remove7TVPersonalEmote(username, name) {
	username = String(username || "")
		.trim()
		.toLowerCase();

	const userEmotes = sevenTVPersonalEmotes.get(username);

	if (!userEmotes) {
		return;
	}

	userEmotes.delete(String(name || ""));

	if (userEmotes.size === 0) {
		sevenTVPersonalEmotes.delete(username);
	}

	console.debug("[7TV] Personal emote removed:", username, name);
}

function get7TVPersonalEmotesForUser(username) {
	username = String(username || "")
		.trim()
		.toLowerCase();

	if (sevenTVPersonalEmotes.has(username)) {
		return sevenTVPersonalEmotes.get(username);
	}

	return new Map();
}

async function get7TVUsernameById(userId) {
	if (!userId) {
		return null;
	}

	userId = String(userId);

	if (sevenTVUserIdToUsername.has(userId)) {
		return sevenTVUserIdToUsername.get(userId);
	}

	try {
		const response = await fetch(
			`https://7tv.io/v3/users/${encodeURIComponent(userId)}`,
		);

		if (!response.ok) {
			sevenTVUserIdToUsername.set(userId, null);

			return null;
		}

		const data = await response.json();

		const username = data?.username
			? String(data.username).trim().toLowerCase()
			: null;

		sevenTVUserIdToUsername.set(userId, username);

		console.debug("[7TV] actor_id -> username:", userId, username);

		return username;
	} catch (error) {
		console.error("7TV personal emote username lookup error:", error);

		sevenTVUserIdToUsername.set(userId, null);

		return null;
	}
}

function subscribeToSevenTVChannelEmoteSets(channelId, platform = "TWITCH") {
	const twitchChannelId = channelId;

	if (!sevenTVEventSocket || !twitchChannelId) {
		return;
	}

	const subKey = `channel:${platform}:${twitchChannelId}`;

	if (sevenTVSubscriptions.has(subKey)) {
		return;
	}

	sevenTVSubscriptions.add(subKey);

	const payload = {
		op: SEVENTV_OPCODES.SUBSCRIBE,

		d: {
			type: "emote_set.*",

			condition: {
				platform,

				ctx: "channel",

				id: String(twitchChannelId),
			},
		},
	};

	sevenTVEventSocket.send(JSON.stringify(payload));

	console.log(
		`Subscribed to 7TV ${platform} channel emote_set.* for:`,
		twitchChannelId,
	);
}

function connectSevenTVEvents(emoteSetId, url = null) {
	if (emoteSetId) {
		sevenTVEmoteSetId = emoteSetId;
	}

	if (
		!sevenTVEmoteSetId &&
		!sevenTVKickEmoteSetId &&
		!TWITCH_USER_ID &&
		!KICK_USER_ID
	) {
		return;
	}

	if (sevenTVEventSocket) {
		if (sevenTVSessionId) {
			subscribeToEmoteSetUpdates(sevenTVEmoteSetId);
			subscribeToSevenTVChannelEmoteSets(TWITCH_USER_ID, "TWITCH");
		}

		return sevenTVEventSocket;
	}

	const socketUrl = url || "wss://events.7tv.io/v3";

	console.log("Connecting to 7TV EventAPI:", socketUrl);

	const socket = new WebSocket(socketUrl);
	sevenTVEventSocket = socket;

	socket.onopen = () => {
		console.log("Connected to 7TV EventAPI WebSocket.");
	};

	socket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			handleSevenTVEventMessage(data);
		} catch (error) {
			console.error("7TV EventAPI message error:", error);
		}
	};

	socket.onerror = (error) => {
		console.error("7TV EventAPI WebSocket error:", error);
	};

	socket.onclose = (event) => {
		console.log("7TV EventAPI WebSocket closed:", event.code, event.reason);

		sevenTVEventSocket = null;
		sevenTVSessionId = null;
		sevenTVSubscriptions.clear();

		clearTimeout(sevenTVHeartbeatTimeout);
		clearTimeout(sevenTVReconnectTimer);

		sevenTVReconnectTimer = setTimeout(() => {
			if (!sevenTVEventSocket) {
				connectSevenTVEvents(null);
			}
		}, 3000);
	};

	return socket;
}

function handleSevenTVEventMessage(data) {
	const op = data?.op;

	if (op === SEVENTV_OPCODES.HELLO) {
		sevenTVSessionId = data.d?.session_id || null;

		console.log("7TV EventAPI session:", sevenTVSessionId);

		sevenTVSubscriptions.clear();

		resetSevenTVHeartbeatWatchdog(data.d?.heartbeat_interval);

		subscribeToEmoteSetUpdates(sevenTVEmoteSetId);
		subscribeToEmoteSetUpdates(sevenTVKickEmoteSetId);

		subscribeToSevenTVChannelEmoteSets(TWITCH_USER_ID, "TWITCH");
		subscribeToSevenTVChannelEmoteSets(KICK_USER_ID, "KICK");

		if (sevenTVHadSession && typeof refreshChannelEmotes === "function") {
			refreshChannelEmotes();
		}

		sevenTVHadSession = true;

		return;
	}

	if (op === SEVENTV_OPCODES.HEARTBEAT) {
		resetSevenTVHeartbeatWatchdog(data.d?.heartbeat_interval);
		return;
	}

	if (op === SEVENTV_OPCODES.RECONNECT) {
		console.log("7TV requested EventAPI reconnect.");

		if (sevenTVEventSocket) {
			sevenTVEventSocket.close();
		}

		return;
	}

	if (op === SEVENTV_OPCODES.ACK) {
		console.log("[7TV] subscription ack:", JSON.stringify(data.d));
		return;
	}

	if (op === SEVENTV_OPCODES.ERROR) {
		console.error("7TV EventAPI error:", data.d);
		return;
	}

	if (op === SEVENTV_OPCODES.DISPATCH) {
		const type = data.d?.type;

		console.log("[7TV] dispatch:", type, data.d?.body?.id || "");

		if (type === "emote_set.update") {
			handleSevenTVEmoteSetUpdate(data.d.body);
		}

		return;
	}
}

function resetSevenTVHeartbeatWatchdog(intervalMs) {
	clearTimeout(sevenTVHeartbeatTimeout);

	intervalMs = Number(intervalMs) || sevenTVHeartbeatMs;

	if (!intervalMs) {
		return;
	}

	sevenTVHeartbeatMs = intervalMs;

	sevenTVHeartbeatTimeout = setTimeout(() => {
		console.warn("7TV EventAPI heartbeat timeout, reconnecting.");

		if (sevenTVEventSocket) {
			sevenTVEventSocket.close();
		}
	}, intervalMs * 2);
}

function subscribeToEmoteSetUpdates(emoteSetId) {
	if (!sevenTVEventSocket || !emoteSetId) {
		return;
	}

	const subKey = `set:${emoteSetId}`;

	if (sevenTVSubscriptions.has(subKey)) {
		return;
	}

	sevenTVSubscriptions.add(subKey);

	const payload = {
		op: SEVENTV_OPCODES.SUBSCRIBE,
		d: {
			type: "emote_set.update",
			condition: {
				object_id: emoteSetId,
			},
		},
	};

	sevenTVEventSocket.send(JSON.stringify(payload));

	console.log("Subscribed to 7TV emote_set.update for:", emoteSetId);
}

function addSevenTVChannelEmote(emote, targets) {
	for (const target of targets) {
		add7TVEmote(emote, target);

		if (target === sevenTVEmotes && emote?.name) {
			sevenTVChannelNames.add(emote.name);
		}
	}
}

function removeSevenTVChannelEmote(name, targets) {
	if (!name) {
		return;
	}

	for (const target of targets) {
		const global = target === sevenTVEmotes ? sevenTVGlobalEmotes.get(name) : null;

		if (global) {
			target.set(name, global);
		} else {
			target.delete(name);
		}

		if (target === sevenTVEmotes) {
			sevenTVChannelNames.delete(name);
		}
	}
}

async function handleSevenTVEmoteSetUpdate(body) {
	if (!body) {
		return;
	}

	const emoteSetId = body.id || body.object_id || null;

	const targets = [];

	if (emoteSetId && emoteSetId === sevenTVEmoteSetId) {
		targets.push(sevenTVEmotes);
	}

	if (emoteSetId && emoteSetId === sevenTVKickEmoteSetId) {
		targets.push(sevenTVKickEmotes);
	}

	const personalEmoteSet = Boolean(emoteSetId && !targets.length);

	const emotesUpdated = body.updated || [];

	const emotesRemoved = (body.pulled || [])
		.map((entry) => entry?.old_value)
		.filter(Boolean);

	const emotesAdded = (body.pushed || [])
		.map((entry) => entry?.value)
		.filter(Boolean);

	for (const update of emotesUpdated) {
		const oldEmote = update?.old_value;

		const newActiveEmote = update?.value;

		if (!oldEmote || !newActiveEmote) {
			continue;
		}

		if (!personalEmoteSet) {
			removeSevenTVChannelEmote(oldEmote.name, targets);

			addSevenTVChannelEmote(newActiveEmote, targets);

			continue;
		}

		const username = await get7TVUsernameById(newActiveEmote.actor_id);

		if (!username) {
			continue;
		}

		remove7TVPersonalEmote(username, oldEmote.name);

		add7TVPersonalEmote(username, newActiveEmote.name, newActiveEmote);
	}

	for (const emote of emotesRemoved) {
		if (!personalEmoteSet) {
			removeSevenTVChannelEmote(emote.name, targets);

			continue;
		}

		const username = await get7TVUsernameById(emote.actor_id);

		if (username) {
			remove7TVPersonalEmote(username, emote.name);
		}
	}

	for (const activeEmote of emotesAdded) {
		if (!personalEmoteSet) {
			addSevenTVChannelEmote(activeEmote, targets);

			continue;
		}

		const username = await get7TVUsernameById(activeEmote.actor_id);

		if (username) {
			add7TVPersonalEmote(username, activeEmote.name, activeEmote);
		}
	}

	console.debug("7TV emote_set.update:", {
		emoteSetId,
		personalEmoteSet,
		added: emotesAdded.length,
		removed: emotesRemoved.length,
		updated: emotesUpdated.length,
	});
}

async function load7TVKickEmotes() {
	if (!KICK_USER_ID) {
		return;
	}

	try {
		const userResponse = await fetch(
			`https://7tv.io/v3/users/kick/${encodeURIComponent(KICK_USER_ID)}`,
		);

		if (userResponse.ok) {
			const userData = await userResponse.json();
			const emoteSetId = userData.emote_set?.id;

			if (emoteSetId) {
				let setData = userData.emote_set;

				if (!Array.isArray(setData?.emotes) || !setData.emotes.length) {
					const setResponse = await fetch(
						`https://7tv.io/v3/emote-sets/${emoteSetId}`,
					);

					if (!setResponse.ok) {
						throw new Error(`7TV Kick emote set error: ${setResponse.status}`);
					}

					setData = await setResponse.json();
				}

				for (const emote of setData.emotes || []) {
					add7TVEmote(emote, sevenTVKickEmotes);
				}

				sevenTVKickEmoteSetId = emoteSetId;
			}

			if (!emoteRefreshing) {
				console.log(`Loaded ${sevenTVKickEmotes.size} 7TV Kick channel emotes.`);
			}
		} else {
			console.warn(`7TV has no Kick user for ${KICK_USER_ID}: ${userResponse.status}`);
		}
	} catch (error) {
		console.error("7TV Kick emote error:", error);
	}

	if (sevenTVEventSocket) {
		if (sevenTVSessionId) {
			subscribeToEmoteSetUpdates(sevenTVKickEmoteSetId);
			subscribeToSevenTVChannelEmoteSets(KICK_USER_ID, "KICK");
		}
	} else {
		connectSevenTVEvents(null);
	}
}
