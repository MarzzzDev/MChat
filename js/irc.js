const MAX_IRC_LINE_LENGTH = 16 * 1024;
const MAX_IRC_FRAME_LENGTH = 1024 * 1024;
const MAX_IRC_TAGS = 64;
const MAX_IRC_TAG_KEY_LENGTH = 64;
const MAX_IRC_TAG_VALUE_LENGTH = 4096;
const MAX_IRC_MESSAGE_CHARS = 1000;
const MAX_IRC_QUEUE_SIZE = 1000;
const IRC_RENDER_BATCH_SIZE = 20;
const IRC_RENDER_INTERVAL_MS = 50;
const MAX_IRC_PENDING_RENDERS = 500;
const TWITCH_CHANNEL_PATTERN = /^[a-z0-9_]{1,25}$/i;
const IRC_TAG_KEY_PATTERN = /^[A-Za-z0-9_.\/+-]+$/;
const IRC_TAG_ESCAPES = { s: " ", ":": ";", r: "\r", n: "\n", "\\": "\\" };
const IRC_BLOCKED_TAG_KEYS = new Set(["__proto__", "constructor", "prototype"]);

let twitchIRCDiscarding = false;
let twitchIRCPendingRenders = 0;
let twitchIRCQueue = null;

function parseIRCtags(raw) {
	const tags = {};

	if (!raw) {
		return tags;
	}

	let count = 0;

	for (const part of String(raw).split(";")) {
		if (count >= MAX_IRC_TAGS) {
			break;
		}

		const equals = part.indexOf("=");
		const key = equals === -1 ? part : part.substring(0, equals);

		if (
			!key ||
			key.length > MAX_IRC_TAG_KEY_LENGTH ||
			!IRC_TAG_KEY_PATTERN.test(key) ||
			IRC_BLOCKED_TAG_KEYS.has(key)
		) {
			continue;
		}

		count += 1;

		if (equals === -1) {
			tags[key] = "";

			continue;
		}

		tags[key] = part
			.substring(equals + 1, equals + 1 + MAX_IRC_TAG_VALUE_LENGTH)
			.replace(/\\(.?)/g, (_, char) =>
				Object.prototype.hasOwnProperty.call(IRC_TAG_ESCAPES, char)
					? IRC_TAG_ESCAPES[char]
					: char,
			);
	}

	return tags;
}

function isTwitchMod(tags) {
	return (
		tags.mod === "1" || /(^|,)(broadcaster|moderator)\//.test(tags.badges || "")
	);
}

function isTwitchBroadcaster(tags, login) {
	if (/(^|,)broadcaster\//.test(tags.badges || "")) {
		return true;
	}

	const channel = String(CHANNEL || "").toLowerCase();

	if (channel && String(login || "").toLowerCase() === channel) {
		return true;
	}

	if (TWITCH_USER_ID && String(tags["user-id"] || "") === String(TWITCH_USER_ID)) {
		return true;
	}

	return false;
}

function getAnonymousIRCNick() {
	return `justinfan${Math.floor(10000 + Math.random() * 90000)}`;
}

function createTwitchIRCSocket() {
	if (!CHANNEL) {
		return Promise.reject(new Error("No Twitch channel configured."));
	}

	if (!TWITCH_CHANNEL_PATTERN.test(String(CHANNEL))) {
		return Promise.reject(new Error("Invalid Twitch channel name."));
	}

	if (twitchIRCSocket) {
		try {
			twitchIRCSocket.close();
		} catch { }
		twitchIRCSocket = null;
	}

	clearTimeout(twitchIRCReconnectTimer);
	twitchIRCBuffer = "";
	twitchIRCDiscarding = false;
	getTwitchIRCQueue().clear();

	twitchIRCReadyPromise = new Promise((resolve, reject) => {
		twitchIRCReadyResolve = resolve;
		twitchIRCReadyReject = reject;

		const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

		twitchIRCSocket = socket;

		socket.onopen = () => {
			console.log("Connected to Twitch IRC.");

			socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands\r\n");

			const nick = getAnonymousIRCNick();

			socket.send("PASS SCHMOOPIIE\r\n");
			socket.send(`NICK ${nick}\r\n`);
			socket.send(`USER ${nick} 8 * :${nick}\r\n`);
			socket.send(`JOIN #${String(CHANNEL).toLowerCase()}\r\n`);
		};

		socket.onmessage = (event) => {
			if (twitchIRCSocket !== socket || typeof event.data !== "string") {
				return;
			}

			let data = event.data;

			if (data.length > MAX_IRC_FRAME_LENGTH) {
				console.warn("Twitch IRC frame too large; reconnecting.");
				twitchIRCBuffer = "";

				try {
					socket.close(1009, "Frame too large");
				} catch {}

				return;
			}

			if (twitchIRCDiscarding) {
				const end = data.indexOf("\r\n");

				if (end === -1) {
					return;
				}

				data = data.substring(end + 2);
				twitchIRCDiscarding = false;
			}

			const messages = (twitchIRCBuffer + data).split("\r\n");

			twitchIRCBuffer = messages.pop() || "";

			if (twitchIRCBuffer.length > MAX_IRC_LINE_LENGTH) {
				twitchIRCBuffer = "";
				twitchIRCDiscarding = true;
			}

			for (const raw of messages) {
				if (!raw) {
					continue;
				}

				if (raw.length > MAX_IRC_LINE_LENGTH) {
					console.warn("Dropped oversized Twitch IRC line.");
					continue;
				}

				enqueueTwitchIRCLine(raw);
			}
		};

		socket.onerror = (error) => {
			console.error("Twitch IRC WebSocket error:", error);
		};

		socket.onclose = (event) => {
			console.log("Twitch IRC WebSocket closed:", event.code, event.reason);

			if (twitchIRCSocket !== socket) {
				return;
			}

			twitchIRCSocket = null;

			if (twitchIRCReadyReject) {
				const rejectReady = twitchIRCReadyReject;

				twitchIRCReadyResolve = null;
				twitchIRCReadyReject = null;

				rejectReady(
					new Error("Twitch IRC connection closed before ROOMSTATE."),
				);
			}

			clearTimeout(twitchIRCReconnectTimer);
			const delay = twitchIRCReconnectDelay;
			twitchIRCReconnectDelay = Math.min(twitchIRCReconnectDelay * 2, 60000);

			twitchIRCReconnectTimer = setTimeout(() => {
				if (CHANNEL && !twitchIRCSocket) {
					createTwitchIRCSocket().catch(() => { });
				}
			}, delay);
		};
	});

	return twitchIRCReadyPromise;
}

function reconnectTwitchChat() {
	clearTimeout(twitchIRCReconnectTimer);
	twitchIRCReconnectTimer = null;
	twitchIRCReconnectDelay = 3000;
	const socket = twitchIRCSocket;
	twitchIRCSocket = null;
	if (socket) {
		try {
			socket.close(1000, "Manual reconnect");
		} catch {}
	}
	if (CHANNEL) {
		return createTwitchIRCSocket();
	}
	return Promise.resolve();
}

function parseTwitchIRCLine(raw) {
	let line = String(raw || "");
	let tags = {};

	if (line.startsWith("@")) {
		const tagEnd = line.indexOf(" ");

		if (tagEnd !== -1) {
			tags = parseIRCtags(line.substring(1, tagEnd));

			line = line.substring(tagEnd + 1);
		}
	}

	let prefix = "";

	if (line.startsWith(":")) {
		const prefixEnd = line.indexOf(" ");

		if (prefixEnd !== -1) {
			prefix = line.substring(1, prefixEnd);

			line = line.substring(prefixEnd + 1);
		}
	}

	const colonIndex = line.indexOf(" :");

	const commandPart = colonIndex === -1 ? line : line.substring(0, colonIndex);

	const trailing = colonIndex === -1 ? "" : line.substring(colonIndex + 2);

	const parts = commandPart.split(" ").filter(Boolean);

	const command = parts.shift() || "";

	return {
		raw,
		tags,
		prefix,
		command,
		params: parts,
		trailing,
	};
}

function getTwitchIRCQueue() {
	twitchIRCQueue ??= createBoundedQueue({
		maxSize: MAX_IRC_QUEUE_SIZE,
		batchSize: IRC_RENDER_BATCH_SIZE,
		intervalMs: IRC_RENDER_INTERVAL_MS,
		handler: handleTwitchIRCMessage,
	});

	return twitchIRCQueue;
}

function peekIRCCommand(raw) {
	let rest = raw;

	if (rest.startsWith("@")) {
		const end = rest.indexOf(" ");

		if (end === -1) {
			return "";
		}

		rest = rest.substring(end + 1);
	}

	if (rest.startsWith(":")) {
		const end = rest.indexOf(" ");

		if (end === -1) {
			return "";
		}

		rest = rest.substring(end + 1);
	}

	const end = rest.indexOf(" ");

	return end === -1 ? rest : rest.substring(0, end);
}

function enqueueTwitchIRCLine(raw) {
	if (raw.startsWith("PING ") || peekIRCCommand(raw) === "ROOMSTATE") {
		handleTwitchIRCMessage(raw);
		return;
	}

	getTwitchIRCQueue().push(raw);
}

function handleTwitchIRCMessage(raw) {
	if (raw.length > MAX_IRC_LINE_LENGTH) {
		return;
	}

	if (raw.startsWith("PING ")) {
		if (twitchIRCSocket?.readyState === WebSocket.OPEN) {
			twitchIRCSocket.send(`PONG ${raw.substring(5)}\r\n`);
		}
		return;
	}

	const message = parseTwitchIRCLine(raw);

	if (message.command === "ROOMSTATE") {
		twitchIRCReconnectDelay = 3000;
		const roomId = message.tags["room-id"];

		if (roomId) {
			TWITCH_USER_ID = String(roomId);
			cacheChannelId(CHANNEL, TWITCH_USER_ID);
			console.log("Overlay channel ID from IRC:", TWITCH_USER_ID);
		}

		if (typeof onTwitchRoomReady === "function") {
			onTwitchRoomReady();
		}

		if (twitchIRCReadyResolve) {
			const resolve = twitchIRCReadyResolve;

			twitchIRCReadyResolve = null;
			twitchIRCReadyReject = null;

			resolve({
				roomId: TWITCH_USER_ID,
			});
		}

		return;
	}

	if (message.command === "PRIVMSG") {
		handleTwitchIRCPrivmsg(message);
		return;
	}

	if (message.command === "CLEARMSG") {
		handleTwitchIRCClearMessage(message.tags["target-msg-id"]);
		return;
	}

	if (message.command === "CLEARCHAT") {
		const userId = message.tags["target-user-id"];

		if (userId) {
			handleTwitchIRCClearUserMessages(userId);
		} else {
			handleTwitchIRCClearChat();
		}
	}
	if (message.command === "USERNOTICE") {
		if (message.tags["msg-id"] === "announcement") {
			handleTwitchIRCPrivmsg(message);
			return;
		}

		handleTwitchIRCUsernotice(message);
		return;
	}
}

function handleTwitchIRCClearUserMessages(userId) {
	if (!userId) {
		return;
	}

	const elements = userMessageElements.get(String(userId));

	if (!elements) {
		return;
	}

	for (const element of Array.from(elements)) {
		removePlatformElement(element);
	}

	userMessageElements.delete(String(userId));
}

function handleTwitchIRCClearChat() {
	lastRepeat = null;
	if (selectedKick || selectedYouTube || selectedTikTok) {
		clearPlatformMessages("twitch");
		return;
	}

	const chat = document.getElementById("chat");

	if (chat) {
		chat.innerHTML = "";
	}

	messageElements.clear();
	userMessageElements.clear();
}

function handleTwitchIRCPrivmsg(message) {
	const tags = message.tags || {};

	const isAnnouncement = message.command === "USERNOTICE";

	const prefixUser = message.prefix ? message.prefix.split("!")[0] : "";

	const username =
		tags["display-name"] || prefixUser || tags["login"] || "Unknown";

	const userId = tags["user-id"] || null;

	const usernameColor = getTwitchDisplayColor(
		tags.color,
		tags.login || prefixUser,
	);

	const messageId = tags.id || null;

	const rawText = String(message.trailing || "").slice(0, MAX_IRC_MESSAGE_CHARS);

	const login = (tags.login || prefixUser || "").toLowerCase();

	if (
		!isAnnouncement &&
		runModCommand(
			rawText,
			isTwitchMod(tags),
			isTwitchBroadcaster(tags, login),
		)
	) {
		return;
	}

	if (!botsEnabled && isKnownBot(login)) {
		return;
	}

	if (!botsEnabled && !isAnnouncement) {
		const bareText = rawText
			.replace(/^\x01?ACTION /, "")
			.replace(/\x01$/, "")
			.trim();

		if (bareText.startsWith("!")) {
			return;
		}
	}

	const actionMatch = rawText.match(/^\x01?ACTION /);

	const isAction = Boolean(actionMatch);

	let emotes = tags.emotes || "";

	if (isAction && emotes) {
		const actionPrefixLength = actionMatch[0].length;

		emotes = emotes
			.split("/")
			.map((group) => {
				const separator = group.indexOf(":");

				if (separator === -1) {
					return group;
				}

				const id = group.substring(0, separator);

				const ranges = group
					.substring(separator + 1)
					.split(",")
					.map((range) => {
						const dash = range.indexOf("-");

						if (dash === -1) {
							return range;
						}

						const start = Number(range.substring(0, dash));

						const end = Number(range.substring(dash + 1));

						if (Number.isNaN(start) || Number.isNaN(end)) {
							return range;
						}

						return (
							`${start - actionPrefixLength}` + `-${end - actionPrefixLength}`
						);
					})
					.join(",");

				return `${id}:${ranges}`;
			})
			.join("/");
	}

	const messageTags = {
		emotes: emotes,
		badges: tags.badges || "",
		gifs: tags.gifs || "",
		"display-name": username,
		"user-id": userId,
		"is-action": isAction,
		"custom-reward-id": tags["custom-reward-id"] || "",
		"reply-parent-msg-id": tags["reply-parent-msg-id"] || "",
		"reply-parent-user-id": tags["reply-parent-user-id"] || "",
		"reply-parent-user-login": tags["reply-parent-user-login"] || "",
		"reply-parent-display-name": tags["reply-parent-display-name"] || "",
		"reply-parent-msg-body": tags["reply-parent-msg-body"] || "",
	};
	if (isAnnouncement) {
		messageTags["hl-kind"] = "announcement";
	}
	const ircTags = Object.assign({}, tags, messageTags);

	if (twitchIRCPendingRenders >= MAX_IRC_PENDING_RENDERS) {
		return;
	}

	twitchIRCPendingRenders += 1;

	twitchBadgesReadyPromise
		.catch(() => {})
		.then(() => {
			twitchIRCPendingRenders = Math.max(0, twitchIRCPendingRenders - 1);

			try {
				onMsg(
					username,
					rawText,
					usernameColor,
					userId,
					ircTags,
					null,
					messageId,
				);
			} catch (error) {
				console.error("Twitch IRC message rendering error:", error);
			}
		});
}

function handleTwitchIRCClearMessage(messageId) {
	if (!messageId) {
		return;
	}

	removePlatformMessage(messageId);
}