let sevenTVEventSocket = null;
let sevenTVSessionId = null;
let sevenTVEmoteSetId = null;
let sevenTVHeartbeatTimeout = null;
let sevenTVReconnectTimer = null;

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

		resetSevenTVHeartbeatWatchdog(data.d?.heartbeat_interval);

		subscribeToEmoteSetUpdates(sevenTVEmoteSetId);
		subscribeToEmoteSetUpdates(sevenTVKickEmoteSetId);

		subscribeToSevenTVChannelEmoteSets(TWITCH_USER_ID, "TWITCH");
		subscribeToSevenTVChannelEmoteSets(KICK_USER_ID, "KICK");

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

	if (op === SEVENTV_OPCODES.ERROR) {
		console.error("7TV EventAPI error:", data.d);
		return;
	}

	if (op === SEVENTV_OPCODES.DISPATCH) {
		const type = data.d?.type;

		if (type === "emote_set.update") {
			handleSevenTVEmoteSetUpdate(data.d.body);
		}

		return;
	}
}

function resetSevenTVHeartbeatWatchdog(intervalMs) {
	clearTimeout(sevenTVHeartbeatTimeout);

	if (!intervalMs) {
		return;
	}

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

async function handleSevenTVEmoteSetUpdate(body) {
	if (!body) {
		return;
	}

	const emoteSetId = body.id || body.object_id || null;

	const isKickChannelSet = Boolean(
		emoteSetId && emoteSetId === sevenTVKickEmoteSetId,
	);

	const personalEmoteSet = Boolean(
		emoteSetId && emoteSetId !== sevenTVEmoteSetId && !isKickChannelSet,
	);

	const targetEmotes = isKickChannelSet ? sevenTVKickEmotes : sevenTVEmotes;

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
			if (oldEmote.name) {
				targetEmotes.delete(oldEmote.name);
			}

			add7TVEmote(newActiveEmote, targetEmotes);

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
			if (emote.name) {
				targetEmotes.delete(emote.name);
			}

			continue;
		}

		const username = await get7TVUsernameById(emote.actor_id);

		if (username) {
			remove7TVPersonalEmote(username, emote.name);
		}
	}

	for (const activeEmote of emotesAdded) {
		if (!personalEmoteSet) {
			add7TVEmote(activeEmote, targetEmotes);

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

function disconnectSevenTVEvents() {
	clearTimeout(sevenTVHeartbeatTimeout);
	clearTimeout(sevenTVReconnectTimer);

	sevenTVEmoteSetId = null;
	sevenTVKickEmoteSetId = null;

	if (sevenTVEventSocket) {
		sevenTVEventSocket.close();
		sevenTVEventSocket = null;
	}
}

async function load7TVGlobalEmotes() {
	try {
		const response = await fetch("https://7tv.io/v3/emote-sets/global");

		if (!response.ok) {
			throw new Error(`7TV global emote error: ${response.status}`);
		}

		const data = await response.json();

		for (const emote of data.emotes || []) {
			add7TVEmote(emote);
			add7TVEmote(emote, sevenTVGlobalEmotes);
		}

		console.log(`Loaded ${sevenTVEmotes.size} total 7TV emotes.`);
	} catch (error) {
		console.error("7TV global emote error:", error);
	}
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

			console.log(`Loaded ${sevenTVKickEmotes.size} 7TV Kick channel emotes.`);
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