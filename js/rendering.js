const REPLY_ICON_PATH = "M3 24V19a7 7 0 0 1 7-7h24";

function createReplyHeader(replyInfo, tags, platform) {
	if (!replyInfo?.username) {
		return null;
	}

	const header = document.createElement("div");

	header.className = "reply-header";

	const svgNS = "http://www.w3.org/2000/svg";
	const icon = document.createElementNS(svgNS, "svg");

	icon.setAttribute("viewBox", "0 0 36 24");
	icon.setAttribute("class", "reply-icon");
	icon.setAttribute("aria-hidden", "true");
	icon.setAttribute("fill", "none");
	icon.setAttribute("stroke", "currentColor");
	icon.setAttribute("stroke-width", "2.2");
	icon.setAttribute("stroke-linecap", "round");
	icon.setAttribute("stroke-linejoin", "round");

	const path = document.createElementNS(svgNS, "path");

	path.setAttribute("d", REPLY_ICON_PATH);
	icon.appendChild(path);

	const label = document.createElement("span");

	label.className = "reply-label";
	label.textContent = "Replying to\u00A0";

	const login = String(replyInfo.username).toLowerCase();
	const known = knownChatters.get(login);

	const target = createMention(
		{
			name: replyInfo.username,
			color: known?.color || tags["reply-parent-color"] || "",
			userId: tags["reply-parent-user-id"] || known?.userId || null,
			platform: known?.platform || platform,
		},
		"@",
	);

	target.classList.add("reply-target");

	const colon = document.createElement("span");

	colon.className = "reply-label";
	colon.textContent = ":";

	header.appendChild(icon);
	header.appendChild(label);
	header.appendChild(target);
	header.appendChild(colon);

	const parentBody = String(tags["reply-parent-msg-body"] || "")
		.replace(/^\x01?ACTION /, "")
		.replace(/\x01$/, "")
		.trim();

	if (parentBody) {
		const body = renderMessageText(
			parentBody,
			{ platform },
			replyInfo.username,
		);

		body.className = "reply-body";
		header.appendChild(body);
	}

	return header;
}

function getReplyInfo(tags, msg) {
	const replyUsername = tags["reply-parent-display-name"] || null;

	if (!replyUsername) {
		let cleanMessage = msg.trim();

		if (tags["is-action"]) {
			cleanMessage = cleanMessage
				.replace(/^\x01?ACTION /, "")
				.replace(/\x01$/, "");
		}

		return { username: null, message: cleanMessage };
	}

	let cleanMessage = msg.trim();
	const escapedUsername = replyUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const replyPrefix = new RegExp(
		`^\\x01?ACTION\\s+@${escapedUsername}\\s*`,
		"i",
	);

	cleanMessage = cleanMessage.replace(replyPrefix, "").replace(/\x01$/, "");

	return { username: replyUsername, message: cleanMessage };
}

function getTwitchDisplayColor(color, login) {
	if (typeof color === "string" && color) {
		let hex = color.trim();

		if (!hex.startsWith("#")) {
			hex = `#${hex}`;
		}

		if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);

			const brightnessOf = (value) => {
				const vr = parseInt(value.slice(1, 3), 16);
				const vg = parseInt(value.slice(3, 5), 16);
				const vb = parseInt(value.slice(5, 7), 16);

				return (vr * 299 + vg * 587 + vb * 114) / 1000;
			};

			if (brightnessOf(hex) >= MIN_NAME_BRIGHTNESS) {
				return hex;
			}

			for (let amount = 5; amount <= 60; amount += 5) {
				const lightened = lightenColor(hex, amount);

				if (brightnessOf(lightened) >= MIN_NAME_BRIGHTNESS) {
					return lightened;
				}
			}

			return lightenColor(hex, 60);
		}
	}

	const nick = String(login || "").toLowerCase();

	if (!nick.length) {
		return TWITCH_DEFAULT_COLORS[0];
	}

	const index =
		(nick.charCodeAt(0) + nick.charCodeAt(nick.length - 1)) %
		TWITCH_DEFAULT_COLORS.length;

	return TWITCH_DEFAULT_COLORS[index];
}

function lightenColor(hex, amount) {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h, s;
	const l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;

		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	const newL = Math.min(1, l + amount / 100);

	return hslToHex(h, s, newL);
}

function hslToHex(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	const toHex = (x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

let lastRepeat = null;

const LINK_TOKEN =
	/^(?:(?:https?:\/\/|www\.)\S+|(?:[a-z0-9-]+\.)+(?:com|net|org|tv|gg|io|co|me|ly|app|dev|xyz|gl|be|fm|to|us|uk|de|ru|ro|fr|info|link|live|site|online|shop|store|page|cc|ai)(?::\d+)?(?:[\/?#]\S*)?)[),.!?]*$/i;

function isLinkToken(part) {
	return LINK_TOKEN.test(part);
}

function isMessageHidden(user, msg, tags = {}) {
	if (botFilterUsers.length) {
		const names = [user, tags.login, tags["display-name"]]
			.filter(Boolean)
			.map((name) => String(name).toLowerCase());

		if (names.some((name) => botFilterUsers.includes(name))) {
			return true;
		}
	}

	if (messageFilters.length) {
		const text = String(msg || "");

		if (
			messageFilters.some((word) => {
				const filter = String(word || "").trim();

				if (!filter) {
					return false;
				}

				const escaped = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

				return new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "i").test(text);
			})
		) {
			return true;
		}
	}

	return false;
}
function getRepeatKey(replyInfo, tags) {
	if (
		tags["hl-kind"] ||
		tags["custom-reward-id"] ||
		tags["msg-id"] === "highlighted-message" ||
		String(tags["first-msg"]) === "1" ||
		Number(tags.bits) > 0 ||
		tags.gifs ||
		tags["reply-parent-display-name"]
	) {
		return null;
	}

	const key = String(replyInfo.message || "")
		.trim()
		.replace(/\s+/g, " ")
		.toLowerCase();

	return key || null;
}

function setRepeatBadge(element, count, animate = true) {
	let badge = element.querySelector(":scope > .msg-count");

	if (!badge) {
		badge = document.createElement("span");

		badge.className = "msg-count";

		element.appendChild(badge);
	}

	badge.textContent = `x${count}`;

	if (animate) {
		badge.classList.remove("msg-count-pop");

		void badge.offsetWidth;

		badge.classList.add("msg-count-pop");
	}
}

function bumpRepeat(state, previewEntry) {
	state.count += 1;

	setRepeatBadge(state.element, state.count);

	if (state.entry) {
		state.entry.count = state.count;
		state.entry.createdAt = Date.now();

		schedulePreviewFade(state.entry);

		if (previewEntry && previewEntry !== state.entry) {
			const index = previewMessageCache.indexOf(previewEntry);

			if (index !== -1) {
				previewMessageCache.splice(index, 1);
			}
		}

		return;
	}

	scheduleMessageFade(
		state.element,
		state.element.dataset.userKey || null,
	);
}

function captureChatPositions(chat) {
	if (entryAnimation !== "smooth-scroll") return [];

	return Array.from(chat.querySelectorAll(":scope > .message")).map((message) => [
		message,
		message.getBoundingClientRect().top,
	]);
}

function animateChatPush(previous) {
	for (const [message, oldTop] of previous) {
		if (!message.isConnected) continue;

		const shift = oldTop - message.getBoundingClientRect().top;
		if (Math.abs(shift) < 1) continue;

		message.animate(
			[{ translate: `0 ${shift}px` }, { translate: "0 0" }],
			{ duration: 320, easing: "cubic-bezier(.2,.75,.25,1)" },
		);
	}
}

function trimChatToLimit(chat) {
	while (chat.querySelectorAll(":scope > .message").length > 100) {
		const oldest = newestTopEnabled
			? chat.lastElementChild
			: chat.firstElementChild;

		if (!oldest) break;
		clearTimeout(oldest._fadeTimer);
		clearTimeout(oldest._removeTimer);
		removePlatformElement(oldest);
	}
}

function insertChatMessage(chat, message) {
	if (newestTopEnabled && chat.firstChild) {
		chat.insertBefore(message, chat.firstChild);
	} else {
		chat.appendChild(message);
	}
}

function placeInChat(chat, element) {
	const previous = captureChatPositions(chat);
	insertChatMessage(chat, element);
	trimChatToLimit(chat);
	animateChatPush(previous);
}

function registerMessageId(message, messageId) {
	if (!messageId) {
		return;
	}

	const id = String(messageId);
	message._messageIds ??= new Set();
	message._messageIds.add(id);
	messageElements.set(id, message);
}

function unregisterMessageIds(message) {
	for (const id of message._messageIds || []) {
		if (messageElements.get(id) === message) {
			messageElements.delete(id);
		}
	}

	message._messageIds?.clear();
}

function scrollPreviewToLatest(previewChat) {
	previewChat.scrollTop = newestTopEnabled ? 0 : previewChat.scrollHeight;
}

	function scheduleMessageFade(message, userKey) {
	clearTimeout(message._fadeTimer);
	clearTimeout(message._removeTimer);

	message.style.animation = "";

	if (fade === false) {
		return;
	}

	message._fadeTimer = setTimeout(
		() => {
			message.style.animation = "messageFadeOut 1s ease-in forwards";

			message._removeTimer = setTimeout(() => {
				message.remove();
				unregisterMessageIds(message);

				if (userKey && userMessageElements.has(userKey)) {
					userMessageElements.get(userKey).delete(message);

					if (userMessageElements.get(userKey).size === 0) {
						userMessageElements.delete(userKey);
					}
				}
			}, 1000);
		},
		Math.max(0, fade * 1000 - 1000),
	);
}

const previewMessageCache = [];
const PREVIEW_CACHE_LIMIT = 12;
const PREVIEW_FADE_OUT_MS = 1000;

function removePreviewEntry(entry) {
	clearTimeout(entry.fadeTimer);
	clearTimeout(entry.removeTimer);

	const index = previewMessageCache.indexOf(entry);

	if (index !== -1) {
		previewMessageCache.splice(index, 1);
	}

	const element = entry.element;
	entry.element = null;

	if (!element) {
		return;
	}

	element.remove();

	const set = userMessageElements.get(entry.userId);

	if (set) {
		set.delete(element);

		if (set.size === 0) {
			userMessageElements.delete(entry.userId);
		}
	}
}

function schedulePreviewFade(entry) {
	clearTimeout(entry.fadeTimer);
	clearTimeout(entry.removeTimer);

	const element = entry.element;

	if (!element) {
		return;
	}

	element.style.animation = "";

	if (fade === false) {
		return;
	}

	const life = entry.createdAt + fade * 1000 - Date.now();

	if (life <= 0) {
		removePreviewEntry(entry);
		return;
	}

	entry.fadeTimer = setTimeout(
		() => {
			const left = Math.max(0, entry.createdAt + fade * 1000 - Date.now());

			const duration = Math.min(left, PREVIEW_FADE_OUT_MS);
			const offset = PREVIEW_FADE_OUT_MS - duration;

			element.style.animation = `messageFadeOut ${PREVIEW_FADE_OUT_MS}ms ease-in ${-offset}ms forwards`;

			entry.removeTimer = setTimeout(() => {
				removePreviewEntry(entry);
			}, duration);
		},
		Math.max(0, life - PREVIEW_FADE_OUT_MS),
	);
}

function reschedulePreviewFades() {
	for (const entry of Array.from(previewMessageCache)) {
		schedulePreviewFade(entry);
	}
}

function addPreviewMessage(user, msg, usernameColor, userId, tags = {}) {
	const previewChat = document.getElementById("chat");

	if (!previewChat) {
		return;
	}

	const entry = {
		user,
		msg,
		usernameColor,
		userId,
		tags,
		createdAt: Date.now(),
		element: null,
		fadeTimer: null,
		removeTimer: null,
	};

	previewMessageCache.push(entry);

	while (previewMessageCache.length > PREVIEW_CACHE_LIMIT) {
		removePreviewEntry(previewMessageCache[0]);
	}

	const result = onMsg(
		user,
		msg,
		usernameColor,
		userId,
		tags,
		previewChat,
		null,
		entry,
	);

	requestAnimationFrame(() => {
		scrollPreviewToLatest(previewChat);
	});

	return result;
}

function rerenderPreviewChat() {
	const previewChat = document.getElementById("chat");

	if (!previewChat) {
		return;
	}

	for (const entry of previewMessageCache) {
		clearTimeout(entry.fadeTimer);
		clearTimeout(entry.removeTimer);
		entry.element = null;
	}

	previewChat.innerHTML = "";
	messageElements.clear();
	userMessageElements.clear();
	lastRepeat = null;

	const now = Date.now();

	for (const entry of Array.from(previewMessageCache)) {
		if (fade !== false && now - entry.createdAt >= fade * 1000) {
			removePreviewEntry(entry);
			continue;
		}

		if (entry.user === "JamiMeow" && !botsEnabled) {
			continue;
		}

		onMsg(
			entry.user,
			entry.msg,
			entry.usernameColor,
			entry.userId,
			entry.tags,
			previewChat,
			null,
			entry,
		);
	}

	requestAnimationFrame(() => {
		scrollPreviewToLatest(previewChat);
	});
}

window.addPreviewMessage = addPreviewMessage;
window.rerenderPreviewChat = rerenderPreviewChat;
window.reschedulePreviewFades = reschedulePreviewFades;


async function onMsg(
	user,
	msg,
	usernameColor,
	userId,
	tags,
	targetChat = null,
	messageId = null,
	previewEntry = null,
) {
	const chat = targetChat || document.getElementById("chat");

	if (!chat) {
		return;
	}

	applyStrokeMode();

	const platform = tags.platform || "twitch";
	const userKey =
		userId == null ? null : platform === "twitch" ? userId : `${platform}:${userId}`;

	if (isMessageHidden(user, msg, tags)) {
		return;
	}

	registerChatter(user, usernameColor, userId, platform, tags);

	const replyInfo = getReplyInfo(tags, msg);
	const repeatKey = collapseEnabled ? getRepeatKey(replyInfo, tags) : null;

	if (
		repeatKey &&
		lastRepeat &&
		lastRepeat.key === repeatKey &&
		(lastRepeat.element.isConnected || lastRepeat.element._pendingChat === chat) &&
		(lastRepeat.element.parentNode === chat || lastRepeat.element._pendingChat === chat)
	) {
		registerMessageId(lastRepeat.element, messageId);
		bumpRepeat(lastRepeat, previewEntry);
		return;
	}

	const message = document.createElement("div");
	message.className = "message";
	message.dataset.platform = platform;

	if (wrapEnabled) {
		message.classList.add("wrap-message");
	}

	message.style.setProperty("--user-color", usernameColor);

	const badges = badgesEnabled
		? platform === "twitch"
			? createTwitchBadges(tags)
			: createPlatformBadges(tags)
		: document.createElement("span");

	const ffzRoomBadge = platform === "twitch" ? createFFZRoomBadge(tags) : null;

	if (ffzRoomBadge) {
		const twitchBadge = badges.querySelector(
			`.badge[data-badge-type="${ffzRoomBadge.type}"]`,
		);

		if (twitchBadge) {
			twitchBadge.replaceWith(ffzRoomBadge.img);
		} else {
			badges.appendChild(ffzRoomBadge.img);
		}
	}

	badges.classList.add("message-badges");

	const authorGroup = document.createElement("span");
	authorGroup.className = "message-author";

	const usernameElement = document.createElement("span");
	usernameElement.className = "username";
	usernameElement.textContent = user;
	usernameElement.style.color = usernameColor;
	usernameElement.style.webkitTextFillColor = usernameColor;

	let colonElement = null;

	if (!tags["is-action"]) {
		colonElement = document.createElement("span");
		colonElement.className = "username username-colon";
		colonElement.textContent = ":\u00A0";

		if (colonMatchUsernameEnabled) {
			colonElement.style.color = usernameColor;
			colonElement.style.webkitTextFillColor = usernameColor;
		} else {
			colonElement.style.color = "var(--text-color)";
			colonElement.style.webkitTextFillColor = "var(--text-color)";
		}
	} else {
		usernameElement.textContent = user + "\u00A0";
	}

	const text = renderMessageText(replyInfo.message, tags, user);

	if (bigEmotesEnabled && isEmoteOnlyMessage(text)) {
		message.classList.add("big-emote-message");
	}

	if (tags["is-action"]) {
		if (userId) {
			get7TVPaint(userId, platform).then((paint) => {
				if (paint) {
					applyPaint(text, paint);
				} else {
					text.style.color = usernameColor;
					text.style.webkitTextFillColor = usernameColor;
				}
			});
		} else {
			text.style.color = usernameColor;
			text.style.webkitTextFillColor = usernameColor;
		}
	}

	const indicatorPlatform = tags["preview-platform"] || platform;

	if (platformIndicatorEnabled && !previewEntry && isMultiChat()) {
		const indicator = createPlatformIndicator(platform);

		if (indicator) {
			authorGroup.appendChild(indicator);
		}
	}

	authorGroup.appendChild(badges);
	authorGroup.appendChild(usernameElement);

	if (colonElement) {
		authorGroup.appendChild(colonElement);
	}

	const replyHeader = createReplyHeader(replyInfo, tags, platform);

	if (replyHeader) {
		message.classList.add("has-reply");
		message.appendChild(replyHeader);
	}

	message.appendChild(authorGroup);
	message.appendChild(text);

	applyMessageHighlights(message, tags, user);
	placeInChat(chat, message);

	if (typeof applyMessageAlignment === "function") {
		applyMessageAlignment(message);
	}

	if (messageId) {
		message.dataset.messageId = messageId;
		registerMessageId(message, messageId);
	}

	if (userId) {
		if (!userMessageElements.has(userKey)) {
			userMessageElements.set(userKey, new Set());
		}

		userMessageElements.get(userKey).add(message);

		get7TVPaint(userId, platform).then((paint) => {
			if (paint) {
				applyPaint(usernameElement, paint);

				if (colonElement && colonMatchUsernameEnabled) {
					applyPaint(colonElement, paint);
				}
			}
		});

		if (badgesEnabled && platform === "twitch") {
			createExternalBadges(userId, tags).then((externalBadges) => {
				if (externalBadges.children.length > 0) {
					externalBadges.classList.add("message-badges");
					authorGroup.insertBefore(externalBadges, usernameElement);
				}
			});
		}

		if (badgesEnabled && platform === "kick") {
			create7TVBadges(userId, "kick").then((sevenTVBadgeContainer) => {
				if (sevenTVBadgeContainer.children.length > 0) {
					sevenTVBadgeContainer.classList.add("message-badges");
					authorGroup.insertBefore(sevenTVBadgeContainer, usernameElement);
				}
			});
		}
	}

	if (userKey) {
		message.dataset.userKey = userKey;
	}

	if (repeatKey) {
		const count = previewEntry?.count > 1 ? previewEntry.count : 1;

		lastRepeat = {
			key: repeatKey,
			element: message,
			count,
			entry: previewEntry,
		};

		if (count > 1) {
			setRepeatBadge(message, count, false);
		}
	} else {
		lastRepeat = null;
	}

	if (previewEntry) {
		previewEntry.element = message;
		schedulePreviewFade(previewEntry);
	} else {
		scheduleMessageFade(message, userKey);
	}
}
