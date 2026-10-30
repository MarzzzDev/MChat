const TIKTOK_EVENTS_URL = "https://tiktok-api.marz.lol/events";
let tikTokPollController = null;
let tikTokStopped = false;
let tikTokConnectionWarningShown = false;
const tikTokSeen = new Set();
const tiktokUsers = {};

function tikTokUserName(user) {
	if (typeof user === "string") return user;
	return String(user?.nickname || user?.displayName || user?.uniqueId || user?.username || user?.userName || "TikTok user");
}

function tikTokUserId(user) {
	return String(user?.userId || user?.id || user?.secUid || tikTokUserName(user));
}

const TIKTOK_BADGE_SCENES = new Map([
	[1, "Moderator"], [4, "Subscriber"], [7, "Subscriber"], [8, "Gifter level"],
	[10, "Fan club"], [11, "LIVE Pro"], [12, "Host"],
]);

function tikTokBadges(user) {
	return (Array.isArray(user?.userBadges) ? user.userBadges : Array.isArray(user?.badges) ? user.badges : [])
		.filter((badge) => badge && typeof badge === "object" && tikTokImageUrl(badge.url || badge.imageUrl))
		.slice(0, 8)
		.map((badge) => ({
			url: tikTokImageUrl(badge.url || badge.imageUrl),
			title: String(badge.label || TIKTOK_BADGE_SCENES.get(Number(badge.badgeSceneType)) || "TikTok badge"),
			combined: badge.combined === true,
			text: String(badge.text || "").slice(0, 32),
			textColor: String(badge.textColor || ""),
			backgroundColor: String(badge.backgroundColor || ""),
			darkBackgroundColor: String(badge.darkBackgroundColor || ""),
			backgroundUrl: tikTokImageUrl(badge.backgroundUrl),
			darkBackgroundUrl: tikTokImageUrl(badge.darkBackgroundUrl),
		}));
}

function tikTokImageUrl(value) {
	if (typeof value !== "string") return "";
	try {
		const url = new URL(value.trim());
		const hosts = ["tiktokcdn.com", "tiktokcdn-us.com", "tiktokcdn-eu.com", "byteoversea.com", "ibytedtos.com", "muscdn.com", "byteimg.com"];
		return url.protocol === "https:" && !url.username && !url.password && !url.port && url.href.length <= 4096 && hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.href : "";
	} catch {
		return "";
	}
}

function tikTokEmoteSegments(comment, emotes) {
	const value = String(comment || "");
	const list = Array.isArray(emotes) ? emotes : [];
	const normalized = list.map((emote) => ({
		emote,
		url: tikTokImageUrl(emote?.imageUrl || emote?.url || emote?.image?.url || emote?.image?.uri),
		name: String(emote?.name || emote?.emoteName || emote?.displayName || emote?.emoteId || "TikTok emote"),
		index: Number(emote?.index ?? emote?.startIndex ?? emote?.start ?? -2),
	})).filter((entry) => entry.url && Number.isInteger(entry.index) && entry.index >= -1);
	const matches = normalized.map(({ index, url, name }) => ({ index: index < 0 ? value.length : index, url, name }))
		.filter((entry) => entry.index <= value.length && !(entry.index > 0 && entry.index < value.length && /[\uDC00-\uDFFF]/.test(value[entry.index])))
		.sort((a, b) => a.index - b.index);
	const segments = [];
	let cursor = 0;
	const appendText = (text) => {
		let position = 0;
		for (const match of text.matchAll(/\[([a-z0-9]+)\]/gi)) {
			const emoteName = match[1].toLowerCase();
			const url = TIKTOK_BUILTIN_EMOTES[emoteName];
			if (!url) continue;
			if (match.index > position) segments.push({ type: "text", text: text.slice(position, match.index) });
			segments.push({ type: "emote", name: `[${emoteName}]`, url });
			position = match.index + match[0].length;
		}
		if (position < text.length) segments.push({ type: "text", text: text.slice(position) });
	};
	for (const match of matches) {
		if (match.index < cursor) continue;
		appendText(value.slice(cursor, match.index));
		segments.push({ type: "emote", name: match.name, url: match.url });
		cursor = match.index;
	}
	appendText(value.slice(cursor));
	if (!segments.length) return [{ type: "text", text: value }];
	return segments;
}

const TIKTOK_BUILTIN_NAMES = ["wow", "laugh", "thanks", "laughcry", "thumb", "hi", "heart", "congrat", "rockyserious", "rockyloveit", "rockyproud", "rockycool", "rosiedislike", "rosieawkward", "rosiekisskiss", "rosiecute", "jolliekissingface", "jolliewow", "jolliespeechless", "jolliesatisfied", "sagethink", "sagefulfilled", "sageclever", "sagemoney"];
const TIKTOK_BUILTIN_EMOTES = Object.fromEntries(TIKTOK_BUILTIN_NAMES.map((name) => [name, new URL(`./assets/tiktok-emotes/${name}.png`, location.href).href]));

function tikTokAttachedMedia(event) {
	const segments = [];
	const mediaKeys = ["imageUrl", "gifUrl", "stickerUrl", "photoUrl", "mediaUrl", "giftImageUrl", "images", "gifs", "stickers", "photos", "media", "imageList", "sticker", "image", "gif"];
	const add = (item, label) => {
		if (typeof item === "string") {
			const url = tikTokImageUrl(item);
			if (url && !segments.some((entry) => entry.url === url)) segments.push({ type: "emote", name: label, url });
			return;
		}
		if (Array.isArray(item)) {
			for (const child of item) add(child, label);
			return;
		}
		if (item && typeof item === "object") {
			for (const key of ["imageUrl", "gifUrl", "stickerUrl", "photoUrl", "url", "uri", "src"]) if (item[key]) add(item[key], item.name || item.title || label);
			for (const key of ["urlList", "urls", "images", "image", "sticker", "media"]) if (item[key]) add(item[key], item.name || item.title || label);
		}
	};
	for (const key of mediaKeys) if (event?.[key]) add(event[key], event.giftName || "TikTok media");
	return segments;
}

function tikTokMessageSegments(text, event) {
	const segments = tikTokEmoteSegments(text, event?.emotes || event?.emoteList);
	const media = tikTokAttachedMedia(event);
	for (const item of media) if (!segments.some((segment) => segment.url === item.url)) segments.push(item);
	if (media.length && segments.length && segments[0].type === "text" && segments[0].text) segments[0].text += " ";
	return segments;
}

function tikTokRender(user, text, event, tags = {}) {
	const name = tikTokUserName(user);
	const id = tikTokUserId(user);
	const uid = user?.userId || user?.id;
	const eventId = String(event?.msgId || event?.messageId || event?.id || "");
	if (eventId && tikTokSeen.has(eventId)) return;
	if (eventId) {
		tikTokSeen.add(eventId);
		if (tikTokSeen.size > 5000) tikTokSeen.delete(tikTokSeen.values().next().value);
	}
	const normalized = {
		platform: "tiktok",
		"platform-badges": tikTokBadges(user),
		"profile-picture": tikTokImageUrl(user?.profilePictureUrl || user?.avatarUrl || ""),
		"display-name": name,
		"tmi-sent-ts": Number(event?.timestamp || event?.createTime || Date.now()),
		...tags,
	};
	if (!normalized.segments) normalized.segments = tikTokMessageSegments(text, event);
	Promise.resolve(onMsg(name, text, tiktokUsers[id], uid || id, normalized, null, eventId || null)).catch((error) => console.error("TikTok message rendering error:", error));
}

function tikTokHandleEvent(message) {
	const event = message.event || {};
	const user = event.user || {};
	switch (event.type) {
		case "chat": {
			const userId = tikTokUserId(user);

			if (!Object.hasOwn(tiktokUsers, userId)) {
				tiktokUsers[userId] = TWITCH_DEFAULT_COLORS[
					Math.floor(Math.random() * TWITCH_DEFAULT_COLORS.length)
				];
			}

			tikTokRender(user, event.comment || event.text || "", event);
			break;
		}
		case "gift":
			if (event.streaking) break;
			tikTokRender(user, `sent ${event.giftName || "a gift"}${Number(event.repeatCount) > 1 ? ` ×${event.repeatCount}` : ""}`, event, { "is-action": true });
			break;
		case "emote": {
			const segments = tikTokEmoteSegments("", event.emotes || []);
			tikTokRender(user, "", event, { segments });
			break;
		}
		case "subscribe": tikTokRender(user, `subscribed${event.subMonth ? ` (${event.subMonth} months)` : ""}`, event, { "is-action": true }); break;
		case "question": tikTokRender(user, `asked: ${event.question || ""}`, event); break;
		case "chatDelete":
			for (const id of event.msgIds || []) removePlatformMessage(id);
			for (const id of event.userIds || []) removePlatformUserMessages("tiktok", id);
			break;
	}
}

async function startTikTokChat() {
	if (!selectedTikTok || tikTokPollController) return;
	tikTokStopped = false;
	let cursor = 0;
	let retryDelay = 2000;
	while (!tikTokStopped) {
		const controller = new AbortController();
		tikTokPollController = controller;
		try {
			const url = new URL(TIKTOK_EVENTS_URL, location.href);
			url.searchParams.set("username", selectedTikTok);
			url.searchParams.set("cursor", String(cursor));
			const response = await fetch(url, { cache: "no-store", signal: controller.signal });
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const data = await response.json();
			if (!Array.isArray(data.events)) throw new Error("Invalid TikTok events response");
			for (const entry of data.events) tikTokHandleEvent({ event: entry.event });
			cursor = Number(data.cursor) || cursor;
			retryDelay = 2000;
			tikTokConnectionWarningShown = false;
		} catch (error) {
			if (tikTokStopped || error.name === "AbortError") break;
			if (!tikTokConnectionWarningShown) {
				console.warn(`MChat TikTok service is unavailable at ${TIKTOK_EVENTS_URL} (${error.message}).`);
				tikTokConnectionWarningShown = true;
			}
			await new Promise((resolve) => setTimeout(resolve, retryDelay));
			retryDelay = Math.min(retryDelay * 2, 30000);
		} finally {
			if (tikTokPollController === controller) tikTokPollController = null;
		}
	}
}

function reconnectTikTokChat() {
	tikTokStopped = true;
	tikTokPollController?.abort();
	if (selectedTikTok) {
		setTimeout(() => {
			if (!tikTokPollController) startTikTokChat();
		}, 0);
	}
}

window.addEventListener("pagehide", () => {
	tikTokStopped = true;
	tikTokPollController?.abort();
});
