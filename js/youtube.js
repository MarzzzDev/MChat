const YOUTUBEI_MODULE_URL = "https://esm.sh/youtubei.js@18.1.0/web?bundle";
const YOUTUBE_RETRY_NOT_LIVE_MS = 20 * 1000;
const YOUTUBE_RETRY_ERROR_MS = 10 * 1000;
const YOUTUBE_BACKLOG_GRACE_MS = 15 * 1000;

let youtubeInnertube = null;
let youtubeChat = null;
let youtubeRunning = false;

const youtubeUserColors = new Map();
const youtubeSeenMessages = new Set();

function youtubeModBadgeIcon() {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">' +
        '<path fill="#5E84F1" d="M8 1.25 14 3.8v3.74c0 3.39-2.1 5.88-6 7.21-3.9-1.33-6-3.82-6-7.21V3.8L8 1.25Z"/>' +
        '<path fill="#3F66D3" d="M8 1.25v13.5c3.9-1.33 6-3.82 6-7.21V3.8L8 1.25Z"/>' +
        '</svg>'
    );
}

function youtubeVerifiedBadgeIcon() {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">' +
        '<circle cx="8" cy="8" r="7" fill="#888888"/>' +
        '<path fill="#ffffff" d="M6.5 11.25 3.75 8.5l1.06-1.06L6.5 9.13l4.69-4.69 1.06 1.06z"/>' +
        '</svg>'
    );
}
function getYouTubeColor(authorId, name) {
	const key = String(authorId || name || Math.random());

	if (!youtubeUserColors.has(key)) {
		youtubeUserColors.set(
			key,
			TWITCH_DEFAULT_COLORS[
				Math.floor(Math.random() * TWITCH_DEFAULT_COLORS.length)
			],
		);
	}

	return youtubeUserColors.get(key);
}

async function youtubeProxyFetch(input, init) {
	const request = new Request(input, init);

	const body = ["GET", "HEAD"].includes(request.method)
		? undefined
		: await request.arrayBuffer();

	return fetch(proxiedUrl(request.url), {
		method: request.method,
		headers: request.headers,
		body,
	});
}

async function getYouTubeInnertube() {
	if (youtubeInnertube) {
		return youtubeInnertube;
	}

	if (!getPlatformProxy()) {
		throw new Error(
			"YouTube chat needs a proxy. Set PLATFORM_PROXY_URL in platforms.js " +
				"(deploy proxy-worker.js) or add ?proxy=https://your-worker to the URL.",
		);
	}

	const { Innertube, UniversalCache } = await import(YOUTUBEI_MODULE_URL);

	youtubeInnertube = await Innertube.create({
		fetch: youtubeProxyFetch,
		cache: new UniversalCache(false),
		generate_session_locally: true,
		retrieve_player: false,
	});

	return youtubeInnertube;
}

function parseYouTubeInput(raw) {
	const value = String(raw || "").trim();

	const videoMatch =
		value.match(/[?&]v=([\w-]{11})/) ||
		value.match(/youtu\.be\/([\w-]{11})/) ||
		value.match(/youtube\.com\/(?:live|embed)\/([\w-]{11})/);

	if (videoMatch) {
		return { videoId: videoMatch[1] };
	}

	const handleInUrl = value.match(/youtube\.com\/(@[\w.-]+)/);

	if (handleInUrl) {
		return { path: `${handleInUrl[1]}/live` };
	}

	const channelInUrl = value.match(/youtube\.com\/channel\/(UC[\w-]{22})/);

	if (channelInUrl) {
		return { path: `channel/${channelInUrl[1]}/live` };
	}

	if (/^UC[\w-]{22}$/.test(value)) {
		return { path: `channel/${value}/live` };
	}

	return { path: `${value.startsWith("@") ? value : `@${value}`}/live` };
}

async function findYouTubeLiveVideoId(target) {
	if (target.videoId) {
		return target.videoId;
	}

	const response = await platformFetch(
		`https://www.youtube.com/${target.path}`,
		{ headers: { "Accept-Language": "en-US,en;q=0.9" } },
	);

	if (!response.ok) {
		throw new Error(`YouTube live page returned ${response.status}`);
	}

	const html = await response.text();

	const canonical =
		html.match(
			/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/,
		) || html.match(/"videoId":"([\w-]{11})","isLive(?:Now)?":true/);

	return canonical ? canonical[1] : null;
}

function pickLargestImage(images) {
	const list = Array.isArray(images) ? images.filter((image) => image?.url) : [];

	if (!list.length) {
		return null;
	}

	list.sort((a, b) => Number(b.width || 0) - Number(a.width || 0));

	return normalizeImageUrl(list[0].url);
}

function youtubeMessageToSegments(message) {
    const runs = message?.runs;

    if (!Array.isArray(runs)) {
        return [{ type: "text", text: String(message?.toString?.() ?? "") }];
    }

    const segments = [];

    for (const run of runs) {
        const emoji = run?.emoji;

        if (emoji) {
            const url = pickLargestImage(emoji.image);
            const name =
                emoji.shortcuts?.[0] ||
                emoji.emoji_id ||
                run.text ||
                "";

            if (url) {
                segments.push({
                    type: "emote",
                    url: url,
                    name: name
                });
            } else {
                segments.push({
                    type: "text",
                    text: String(run.text || name)
                });
            }

            continue;
        }

        if (run?.text) {
            segments.push({
                type: "text",
                text: String(run.text)
            });
        }
    }

    return segments;
}
function buildYouTubeBadges(author) {
    const badges = [];

    for (const badge of Array.isArray(author?.badges) ? author.badges : []) {
        const title = badge?.tooltip || badge?.label || "";
        const memberUrl = pickLargestImage(badge?.custom_thumbnail);

        if (memberUrl) {
            badges.push({ url: memberUrl, title: title || "Member" });
            continue;
        }

        switch (String(badge?.icon_type || "").toUpperCase()) {
            case "MODERATOR":
                badges.push({ url: youtubeModBadgeIcon(), title: title || "Moderator" });
                break;
            case "VERIFIED":
                badges.push({ url: youtubeVerifiedBadgeIcon(), title: title || "Verified" });
                break;
        }
    }

    return badges;
}

const YOUTUBE_MESSAGE_KINDS = new Set([
	"LiveChatTextMessage",
	"LiveChatPaidMessage",
	"LiveChatPaidSticker",
	"LiveChatMembershipItem",
	"LiveChatSponsorshipsGiftPurchaseAnnouncement",
	"LiveChatSponsorshipsGiftRedemptionAnnouncement",
]);

function youtubeText(value) {
	if (value == null) {
		return "";
	}

	if (typeof value === "string") {
		return value;
	}

	if (typeof value.text === "string") {
		return value.text;
	}

	if (Array.isArray(value.runs)) {
		return value.runs.map((run) => run?.text || "").join("");
	}

	const converted = String(value.toString?.() ?? "");

	return converted === "[object Object]" ? "" : converted;
}

function youtubeColorToHex(value) {
	const number = Number(value);

	if (!Number.isFinite(number) || number === 0) {
		return null;
	}

	return `#${(number & 0xffffff).toString(16).padStart(6, "0")}`;
}

function handleYouTubeChatItem(item, startedAt) {
	const kind = item?.type;

	if (!YOUTUBE_MESSAGE_KINDS.has(kind)) {
		return;
	}

	const messageId = item.id ? String(item.id) : null;

	if (messageId) {
		if (youtubeSeenMessages.has(messageId)) {
			return;
		}

		youtubeSeenMessages.add(messageId);

		if (youtubeSeenMessages.size > 5000) {
			youtubeSeenMessages.delete(youtubeSeenMessages.values().next().value);
		}
	}

	const timestamp = Number(item.timestamp);

	if (Number.isFinite(timestamp) && timestamp < startedAt - YOUTUBE_BACKLOG_GRACE_MS) {
		return;
	}

	const author = item.author || {};

	const username =
		youtubeText(author.name) || youtubeText(item.header?.author_name) || "Unknown";

	const userId = author.id
		? String(author.id)
		: item.author_external_channel_id
		  ? String(item.author_external_channel_id)
		  : null;

	if (kind === "LiveChatMembershipItem") {
		appendNoticeCard({
			name: username,
			text:
				youtubeText(item.header_primary_text) ||
				youtubeText(item.header_subtext) ||
				"became a member",
		});

		return;
	}

	if (kind === "LiveChatSponsorshipsGiftPurchaseAnnouncement") {
		appendNoticeCard({
			name: username,
			text: youtubeText(item.header?.primary_text) || "gifted memberships",
		});

		return;
	}

	if (kind === "LiveChatSponsorshipsGiftRedemptionAnnouncement") {
		appendNoticeCard({
			name: username,
			text: youtubeText(item.message) || "received a gifted membership",
		});

		return;
	}

	let segments;
	let extraTags = {};

	if (kind === "LiveChatPaidSticker") {
		const url = pickLargestImage(item.sticker);

		segments = url ? [{ type: "emote", url, name: "Super Sticker" }] : [];
	} else {
		segments = youtubeMessageToSegments(item.message);
	}

	if (kind !== "LiveChatTextMessage") {
		const amount = youtubeText(item.purchase_amount);

		if (amount && hlGiftsEnabled) {
			extraTags = {
				"hl-kind": "paid",
				"hl-label": amount,
				"hl-color":
					youtubeColorToHex(item.header_background_color) ||
					youtubeColorToHex(item.background_color) ||
					youtubeColorToHex(item.body_background_color) ||
					"#e62117",
			};
		} else if (amount) {
			segments.unshift({ type: "text", text: `[${amount}] ` });
		}
	}

	const plainText = segments.map((segment) => segment.text || "").join("");

	if (!botsEnabled && isCommandMessage(plainText)) {
		return;
	}

	emitPlatformMessage({
		platform: "youtube",
		username,
		color: getYouTubeColor(userId, username),
		userId,
		messageId,
		segments,
		badges: buildYouTubeBadges(author),
		extraTags,
	});
}

function handleYouTubeAction(action, startedAt) {
	switch (action?.type) {
		case "AddChatItemAction":
			handleYouTubeChatItem(action.item, startedAt);
			break;

		case "RemoveChatItemAction":
		case "MarkChatItemAsDeletedAction":
			removePlatformMessage(action.target_item_id);
			break;

		case "RemoveChatItemByAuthorAction":
			removePlatformUserMessages("youtube", action.external_channel_id);
			break;
	}
}

function waitMs(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runYouTubeSession(target) {
	const videoId = await findYouTubeLiveVideoId(target);

	if (!videoId) {
		return "not-live";
	}

	const youtube = await getYouTubeInnertube();
	const info = await youtube.getInfo(videoId);
	const chat = info.getLiveChat();

	if (!chat) {
		return "not-live";
	}

	youtubeChat = chat;

	const startedAt = Date.now();

	console.log("Connected to YouTube live chat:", videoId);

	await new Promise((resolve) => {
		chat.on("chat-update", (action) => {
			try {
				handleYouTubeAction(action, startedAt);
			} catch (error) {
				console.error("YouTube chat action error:", error);
			}
		});

		chat.on("error", (error) => {
			console.error("YouTube live chat error:", error);
			resolve();
		});

		chat.on("end", resolve);

		chat.start();
	});

	try {
		chat.stop();
	} catch {}

	youtubeChat = null;

	return "ended";
}

async function startYouTubeChat(input) {
	if (youtubeRunning) {
		return;
	}

	youtubeRunning = true;

	const target = parseYouTubeInput(input);

	while (youtubeRunning) {
		let delay = YOUTUBE_RETRY_ERROR_MS;

		try {
			const result = await runYouTubeSession(target);

			delay = result === "not-live" ? YOUTUBE_RETRY_NOT_LIVE_MS : 5000;

			if (result === "not-live") {
				console.log("YouTube channel is not live yet, retrying…");
			}
		} catch (error) {
			console.error("YouTube chat error:", error);

			if (!getPlatformProxy()) {
				youtubeRunning = false;
				return;
			}
		}

		await waitMs(delay);
	}
}

function stopYouTubeChat() {
	youtubeRunning = false;

	try {
		youtubeChat?.stop();
	} catch {}

	youtubeChat = null;
}