function parseIRCtags(raw) {
	const tags = {};

	if (!raw) {
		return tags;
	}

	for (const part of raw.split(";")) {
		const equals = part.indexOf("=");

		if (equals === -1) {
			tags[part] = "";

			continue;
		}

		const key = part.substring(0, equals);

		const value = part.substring(equals + 1);

		tags[key] = value
			.replace(/\\s/g, " ")
			.replace(/\\:/g, ";")
			.replace(/\\r/g, "\r")
			.replace(/\\n/g, "\n")
			.replace(/\\\\/g, "\\");
	}

	return tags;
}

function getAnonymousIRCNick() {
	return `justinfan${Math.floor(10000 + Math.random() * 90000)}`;
}

function createTwitchIRCSocket() {
	if (!CHANNEL) {
		return Promise.reject(new Error("No Twitch channel configured."));
	}

	if (twitchIRCSocket) {
		try {
			twitchIRCSocket.close();
		} catch { }
		twitchIRCSocket = null;
	}

	clearTimeout(twitchIRCReconnectTimer);
	twitchIRCBuffer = "";

	twitchIRCReadyPromise = new Promise((resolve, reject) => {
		twitchIRCReadyResolve = resolve;
		twitchIRCReadyReject = reject;

		const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

		twitchIRCSocket = socket;

		socket.onopen = () => {
			console.log("Connected to Twitch IRC anonymously.");

			socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands\r\n");

			const nick = getAnonymousIRCNick();

			socket.send("PASS SCHMOOPIIE\r\n");
			socket.send(`NICK ${nick}\r\n`);
			socket.send(`USER ${nick} 8 * :${nick}\r\n`);
			socket.send(`JOIN #${CHANNEL}\r\n`);
		};

		socket.onmessage = (event) => {
			twitchIRCBuffer += String(event.data || "");

			const messages = twitchIRCBuffer.split("\r\n");

			twitchIRCBuffer = messages.pop() || "";

			for (const raw of messages) {
				if (raw) {
					handleTwitchIRCMessage(raw);
				}
			}
		};

		socket.onerror = (error) => {
			console.error("Twitch IRC WebSocket error:", error);
		};

		socket.onclose = (event) => {
			console.log("Twitch IRC WebSocket closed:", event.code, event.reason);

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

			twitchIRCReconnectTimer = setTimeout(() => {
				if (CHANNEL && !twitchIRCSocket) {
					createTwitchIRCSocket().catch(() => { });
				}
			}, 3000);
		};
	});

	return twitchIRCReadyPromise;
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

function handleTwitchIRCMessage(raw) {
	if (raw.startsWith("PING ")) {
		if (twitchIRCSocket?.readyState === WebSocket.OPEN) {
			twitchIRCSocket.send(`PONG ${raw.substring(5)}\r\n`);
		}
		return;
	}

	const message = parseTwitchIRCLine(raw);

	if (message.command === "ROOMSTATE") {
		const roomId = message.tags["room-id"];

		if (roomId) {
			TWITCH_USER_ID = String(roomId);

			console.log("Overlay channel ID from IRC:", TWITCH_USER_ID);
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

	for (const element of elements) {
		const messageId = element.dataset.messageId;

		element.remove();

		if (messageId) {
			messageElements.delete(messageId);
		}
	}

	userMessageElements.delete(String(userId));
}

function handleTwitchIRCClearChat() {
	if (selectedKick || selectedYouTube) {
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

	const prefixUser = message.prefix ? message.prefix.split("!")[0] : "";

	const username =
		tags["display-name"] || prefixUser || tags["login"] || "Unknown";

	const userId = tags["user-id"] || null;

	const usernameColor = getTwitchDisplayColor(
		tags.color,
		tags.login || prefixUser,
	);

	const messageId = tags.id || null;

	const rawText = message.trailing || "";

	const login = (tags.login || prefixUser || "").toLowerCase();

	if (!botsEnabled && isKnownBot(login)) {
		return;
	}

	if (!botsEnabled) {
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

	const ircTags = {
		...tags,
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

	twitchBadgesReadyPromise
		.catch(() => { })
		.then(() => {
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

	const element = messageElements.get(messageId);

	if (element) {
		element.remove();
		messageElements.delete(messageId);
	}
}