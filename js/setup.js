const previewMessages = [
	[
		"Dodorej",
		"订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK",
		"#FF0000",
		"504585840",
		{ badges: "vip/1,founder/1,48hgold/1" },
	],
	[
		"marz_dev",
		"wowie an overlay with support for ffz effects",
		"#8A2BE2",
		"1208634685",
		{ badges: "broadcaster/1,subscriber/1,subtember/1" },
	],
	[
		"NonCre8ive",
		"hello men",
		"#00FF7F",
		"405299735",
		{ badges: "moderator/1,ewcgold/1", "msg-id": "highlighted-message" },
	],
	[
		"XDR412",
		"Maybe",
		"#DAA520",
		"195845559",
		{ badges: "moderator/1,subscriber/1,pikachu/1" },
	],
	[
		"Muesli_Cornflake",
		"[Seal Hey Gif by wtf]",
		"#94FDFF",
		"omecash",
		{
			badges: "vip/1,omecash/1",
			gifs: "0-20|hey-seal|hey.gif",
		},
	],
	[
		"SkibidiDalbajobas44",
		"Fiddy ffzBounce buh_fish_",
		"#FF0000",
		"260019982",
		{ badges: "moderator/1,founder/1,omecash/1" },
	],
	[
		"buh_official_",
		"lookUp FiddyWtf wtf did i do ?",
		"#FF0000",
		"717566574",
		{ badges: "vip/1,omecash/1" },
	],
	[
		"paidchatter",
		"ur a great streamer",
		"#8A2BE2",
		"812345670",
		{ badges: "subtember/1", "first-msg": "1" },
	],
	[
		"JamiMeow",
		"waga",
		"#FF69B4",
		"458139207",
		{ badges: "vip/1,bot/1,omecash/1" },
	],
	[
		"skibidifan5342",
		"Cheer100 TAKE MY MONEY!",
		"#1E90FF",
		"733445521",
		{ badges: "subscriber/1,omecash/1", bits: "100" },
	],
	[
		"Underpaid_Actor",
		"PagMan ffzSpin",
		"#FF69B4",
		"406239629",
		{ badges: "founder/1,noob/1" },
	],
];
let currentPreviewMessage = 0;

const SIMULATE_CLIPS = [
	"https://media.marz.lol/cs_1.mp4",
	"https://media.marz.lol/cs_2.mp4",
	"https://media.marz.lol/cs_3.mp4",
	"https://media.marz.lol/cs_4.mp4",
	"https://media.marz.lol/cs_5.mp4",
	"https://media.marz.lol/cs_6.mp4",
	"https://media.marz.lol/cs_7.mp4",
	"https://media.marz.lol/cs_8.mp4",
	"https://media.marz.lol/cs_9.mp4",
	"https://media.marz.lol/cs_10.mp4",
	"https://media.marz.lol/cs_11.mp4",
	"https://media.marz.lol/cs_12.mp4",
	"https://media.marz.lol/cs_13.mp4",
];

const SIM_ORIGIN = "https://media.marz.lol";

function ensureMediaPreconnect() {
	if (document.querySelector("link[data-mc-preconnect]")) {
		return;
	}

	const link = document.createElement("link");
	link.rel = "preconnect";
	link.href = SIM_ORIGIN;
	link.crossOrigin = "anonymous";
	link.dataset.mcPreconnect = "true";
	document.head.appendChild(link);
}

let badgeSources = {
	twitch: badgeTwitch,
	ffz: badgeFfz,
	seventv: badgeSeventv,
	chatterino: badgeChatterino,
	homies: badgeHomies,
	bttv: badgeBttv,
	dankchat: badgeDankchat,
	moltorino: badgeMoltorino,
};
const PLATFORM_BADGE_SOURCES = [
	{
		key: "twitch",
		label: "Twitch",
		logo: "logos/twitch.png",
		color: "#9147ff",
	},
	{ key: "ffz", label: "FFZ", logo: "logos/ffz.svg", color: "#755000" },
	{ key: "seventv", label: "7TV", logo: "logos/7tv.svg", color: "#29b6f6" },
	{
		key: "chatterino",
		label: "Chatterino",
		logo: "logos/chatterino.svg",
		color: "#a7efff",
	},
	{
		key: "homies",
		label: "Homies",
		logo: "logos/homies.svg",
		color: "#d400ff",
	},
	{ key: "bttv", label: "BTTV", logo: "logos/bttv.svg", color: "#ff0000" },
	{
		key: "dankchat",
		label: "DankChat",
		logo: "logos/dankchat.png",
		color: "#efe08a",
	},
	{
		key: "moltorino",
		label: "Moltorino",
		logo: "logos/moltorino.png",
		color: "#ff6a00",
	},
];

let backgroundOpacity = (() => {
	const raw = parseFloat(
		new URLSearchParams(window.location.search).get("backgroundOpacity"),
	);
	return Number.isFinite(raw) ? Math.max(0, Math.min(raw, 1)) : 0;
})();

function hexToRgba(hex, alpha) {
	let h = String(hex || "#000000")
		.replace("#", "")
		.trim();

	if (h.length === 3) {
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	}

	if (!/^[0-9a-fA-F]{6}$/.test(h)) {
		h = "000000";
	}

	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyChatBackground() {
	const enabled =
		typeof backgroundEnabled !== "undefined" ? !!backgroundEnabled : true;

	const color =
		typeof backgroundColor !== "undefined" && backgroundColor
			? backgroundColor
			: "#000000";

	document.documentElement.style.setProperty(
		"--chat-bg",
		enabled ? hexToRgba(color, backgroundOpacity) : "transparent",
	);

	document.body.classList.toggle("has-background", enabled);
}

document.addEventListener("DOMContentLoaded", applyChatBackground);

let previewTimer = null;
let previewActive = false;
let previewIntervalSec = 3.5;

function runPreviewMessage() {
	if (!previewActive) {
		return;
	}

	const message = previewMessages[currentPreviewMessage];

	if (message[0] === "JamiMeow" && !botsEnabled) {
		currentPreviewMessage =
			(currentPreviewMessage + 1) % previewMessages.length;

		previewTimer = setTimeout(runPreviewMessage, 0);
		return;
	}

	addPreviewMessage(...message);

	currentPreviewMessage = (currentPreviewMessage + 1) % previewMessages.length;

	const jitter = 0.8 + Math.random() * 0.4;
	const delay = Math.max(20, previewIntervalSec * 1000 * jitter);

	previewTimer = setTimeout(runPreviewMessage, delay);
}
async function startPreviewMessages() {
	previewActive = true;

	try {
		await loadPreviewEmotes();
	} catch (error) {
		console.warn("Preview emotes failed to load:", error);
	}

	if (!previewActive) {
		return;
	}

	previewTimer = setTimeout(runPreviewMessage, 500);
}

function stopPreviewMessages() {
	previewActive = false;
	clearTimeout(previewTimer);
	previewTimer = null;
}
async function loadCommitInfo(target) {
	if (!target) {
		return;
	}

	try {
		const response = await fetch(
			"https://api.github.com/repos/MarzzzDev/MChat/commits/main",
		);

		if (!response.ok) {
			throw new Error(`GitHub API returned ${response.status}`);
		}

		const data = await response.json();
		const shortSha = data.sha.slice(0, 7);

		target.textContent = shortSha;
		target.href = data.html_url;
		target.title = data.commit.message.split("\n")[0];
	} catch (error) {
		console.warn("Could not load latest commit info:", error);

		target.textContent = "unknown";
	}
}

const IMPORT_CHATIS_FONTS = [
	"Baloo Tammudu",
	"Segoe UI",
	"Roboto",
	"Lato",
	"Noto Sans",
	"Source Code Pro",
	"Impact",
	"Comfortaa",
	"Dancing Script",
	"Indie Flower",
	"Open Sans",
	"Alsina Ultrajada",
];

const IMPORT_CHATIS_SIZES = {
	1: { font: 20, badge: 16, emote: 25 },
	2: { font: 34, badge: 28, emote: 42 },
	3: { font: 48, badge: 40, emote: 60 },
};

const IMPORT_CHATIS_SHADOW_BLUR = [0, 3.2, 5.6, 8];

const IMPORT_UCHAT_KEYS = [
	"msgBold",
	"msgCaps",
	"smoothScroll",
	"fontColor",
	"fontSize",
	"firstMsg",
	"fontStroke",
	"fontShadow",
	"emoteSize",
	"gifSize",
	"ffzEffects",
	"fadeOut",
	"badgesTTV",
	"redeem",
	"userBL",
	"prefixBL",
	"modAction",
	"mentionColor",
	"paints",
	"paintShadows",
	"lastMsg",
	"clearLive",
	"track",
];

const IMPORT_UCHAT_BADGE_BITS = {
	badgeTwitch: 1,
	badgeSeventv: 3,
	badgeBttv: 4,
	badgeFfz: 5,
	badgeChatterino: 6,
	badgeHomies: 7,
};

function importClamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function importRound(value, digits = 2) {
	const factor = 10 ** digits;

	return Math.round(value * factor) / factor;
}

function importNumber(value, fallback) {
	if (value === null || value === undefined || String(value).trim() === "") {
		return fallback;
	}

	const number = Number(value);

	return Number.isFinite(number) ? number : fallback;
}

function importBool(value, fallback) {
	if (value === null || value === undefined) {
		return fallback;
	}

	const text = String(value).trim().toLowerCase();

	if (["1", "true", "yes", "on"].includes(text)) {
		return true;
	}

	if (["0", "false", "no", "off"].includes(text)) {
		return false;
	}

	return fallback;
}

function importColor(value, fallback) {
	let text = String(value || "")
		.trim()
		.replace(/^#/, "")
		.toLowerCase();

	if (/^[0-9a-f]{3}$/.test(text)) {
		text = text
			.split("")
			.map((char) => char + char)
			.join("");
	}

	return /^[0-9a-f]{6}$/.test(text) ? `#${text}` : fallback;
}

function importList(value, stripAt = false) {
	return String(value || "")
		.split(/[,\s]+/)
		.map((item) => item.trim().toLowerCase())
		.map((item) => (stripAt ? item.replace(/^@/, "") : item))
		.filter(Boolean)
		.join(",");
}

function importResolveFont(name) {
	const clean = sanitizeFontName(name);
	const key = clean.toLowerCase().replace(/\s+/g, "");

	const known = {
		opensans: "'Open Sans', sans-serif",
		arial: "Arial, sans-serif",
		comicsans: "'Comic Sans MS', sans-serif",
		comicsansms: "'Comic Sans MS', sans-serif",
		roboto: "'Roboto', sans-serif",
		montserrat: "'Montserrat', sans-serif",
		minecraft: "'Minecraft', sans-serif",
	};

	if (known[key]) {
		return { font: known[key], customFont: "" };
	}

	if (!clean) {
		return { font: "'Open Sans', sans-serif", customFont: "" };
	}

	return { font: "custom", customFont: clean };
}

function importLayout(fontPx, badgePx, emotePx) {
	const scale = importClamp(importRound(fontPx / 50, 2), 0.25, 3);

	return {
		scale,
		badgeScale: importClamp(importRound(badgePx / (45 * scale), 3), 0.25, 2),
		emoteScale: importClamp(importRound(emotePx / (65 * scale), 3), 0.25, 3),
	};
}

function importShadow(offset, blur, intensity, scale) {
	if (!(intensity > 0)) {
		return {
			shadow: false,
			shadowIntensity: 0.9,
			shadowSize: 6,
			shadowOffset: 3,
		};
	}

	return {
		shadow: true,
		shadowIntensity: importClamp(importRound(intensity, 2), 0, 1),
		shadowSize: importClamp(importRound(blur / scale, 1), 0, 40),
		shadowOffset: importClamp(importRound(offset / scale, 1), 0, 20),
	};
}

function importFromChatis(p) {
	const sizeValue = Number(p.get("size"));
	const size = [1, 2, 3].includes(sizeValue) ? sizeValue : 1;
	const base = IMPORT_CHATIS_SIZES[size];

	let emoteMultiplier = importNumber(p.get("emoteScale"), 1);

	if (!(emoteMultiplier > 0)) {
		emoteMultiplier = 1;
	}

	emoteMultiplier = Math.min(emoteMultiplier, 3);

	const layout = importLayout(base.font, base.badge, base.emote * emoteMultiplier);

	const fontIndex = importNumber(p.get("font"), 11);

	let fontName = "Open Sans";

	if (fontIndex >= 1 && fontIndex <= 12) {
		fontName = IMPORT_CHATIS_FONTS[Math.round(fontIndex) - 1];
	} else if (fontIndex === 0 && p.get("fontCustom")) {
		fontName = p.get("fontCustom");
	}

	const font = importResolveFont(fontName);

	const strokeLevel = importClamp(Math.round(importNumber(p.get("stroke"), 0)), 0, 4);

	const shadowLevel = importClamp(Math.round(importNumber(p.get("shadow"), 0)), 0, 3);

	const fadeSeconds = Math.round(importNumber(p.get("fade"), 0));

	const hideSpecial = importBool(p.get("hide_special_badges"), false);

	const showHomies = importBool(p.get("show_homies"), false);

	return {
		source: "ChatIS",
		channel: String(p.get("channel") || "")
			.trim()
			.replace(/^#/, "")
			.toLowerCase(),
		kick: "",
		youtube: "",
		twitchId: "",
		settings: {
			scale: layout.scale,
			badgeScale: layout.badgeScale,
			emoteScale: layout.emoteScale,
			separateTypography: false,
			font: font.font,
			customFont: font.customFont,
			textColor: "#ffffff",
			bold: true,
			uppercase: importBool(p.get("small_caps"), false),
			wrapAfterColon: importBool(p.get("nl_after_name"), false),
			strokeWidth:
				strokeLevel > 0
					? importClamp(importRound(strokeLevel / 2 / layout.scale, 1), 0, 20)
					: 0,
			strokeColor: "#000000",
			...(shadowLevel > 0
				? importShadow(2, IMPORT_CHATIS_SHADOW_BLUR[shadowLevel], 1, layout.scale)
				: importShadow(0, 0, 0, layout.scale)),
			fade: fadeSeconds > 0 ? importClamp(fadeSeconds, 1, 300) : false,
			entryAnimation: importBool(p.get("animate"), false) ? "classic" : "none",
			bots: importBool(p.get("bots"), false),
			botFilter: importList(p.get("botNames"), true),
			badges: true,
			badgeTwitch: true,
			badgeFfz: !hideSpecial,
			badgeSeventv: !hideSpecial,
			badgeBttv: !hideSpecial,
			badgeChatterino: !hideSpecial,
			badgeHomies: !hideSpecial && showHomies,
			badgeDankchat: false,
			badgeMoltorino: false,
		},
		skipped: ["hide_names", "markdown"],
	};
}

function importFromUchat(p) {
	const defaultBadges = 2047 - (1 << 7);

	const fontSize = importClamp(importNumber(p.get("fontSize"), 20), 1, 500);
	const emoteSize = importClamp(importNumber(p.get("emoteSize"), 25), 1, 500);
	const gifSize = importClamp(importNumber(p.get("gifSize"), 100), 1, 2000);

	const layout = importLayout(fontSize, fontSize, emoteSize);

	const font = importResolveFont(p.get("font") || "Geist");

	const shadowValue = importClamp(importNumber(p.get("fontShadow"), 10), 0, 10);

	const bitmap = importNumber(p.get("badges"), defaultBadges);

	const fadeSeconds = Math.round(importNumber(p.get("fadeOut"), 0));

	const settings = {
		scale: layout.scale,
		badgeScale: layout.badgeScale,
		emoteScale: layout.emoteScale,
		gifScale: importClamp(importRound(gifSize / (480 * layout.scale), 3), 0.25, 3),
		separateTypography: false,
		font: font.font,
		customFont: font.customFont,
		textColor: importColor(p.get("fontColor"), "#ffffff"),
		bold: importBool(p.get("msgBold"), true),
		uppercase: importBool(p.get("msgCaps"), false),
		strokeWidth: importBool(p.get("fontStroke"), false)
			? importClamp(importRound(1 / layout.scale, 1), 0, 20)
			: 0,
		strokeColor: "#000000",
		...importShadow(2, 3, shadowValue / 10, layout.scale),
		fade: fadeSeconds > 0 ? importClamp(fadeSeconds, 1, 300) : false,
		entryAnimation: importBool(p.get("smoothScroll"), true) ? "classic" : "none",
		gifs: importBool(p.get("gifs"), false),
		bots: importBool(p.get("bots"), true),
		botFilter: importList(p.get("userBL"), true),
		msgFilter: importList(p.get("prefixBL")),
		highlights: importBool(p.get("mentionColor"), false),
		hlFirst: importBool(p.get("firstMsg"), false),
		hlRedeems: importBool(p.get("redeem"), true),
		badges: bitmap !== 0,
		badgeDankchat: false,
		badgeMoltorino: false,
	};

	for (const [key, bit] of Object.entries(IMPORT_UCHAT_BADGE_BITS)) {
		settings[key] = (bitmap & (1 << bit)) !== 0;
	}

	return {
		source: "UChat",
		channel: String(p.get("channel") || "")
			.trim()
			.replace(/^#/, "")
			.toLowerCase(),
		kick: String(p.get("kick") || "").trim(),
		youtube: String(p.get("youtube") || "").trim(),
		twitchId: String(p.get("id") || "").trim(),
		settings,
		skipped: ["ffzEffects", "modAction", "paints", "paintShadows"],
	};
}

function convertForeignOverlayLink(raw) {
	let text = String(raw || "").trim();

	if (!/^https?:\/\//i.test(text)) {
		text = `https://${text}`;
	}

	let url;

	try {
		url = new URL(text);
	} catch {
		throw new Error("That doesn't look like a valid link.");
	}

	const p = url.searchParams;
	const host = url.hostname.toLowerCase();

	const looksUchat =
		host.includes("unii.dev") ||
		host.includes("uchat") ||
		IMPORT_UCHAT_KEYS.some((key) => p.has(key)) ||
		p.has("kick") ||
		p.has("youtube") ||
		p.has("id");

	const looksChatis =
		host.includes("chatis") ||
		["size", "animate", "small_caps", "nl_after_name", "hide_special_badges", "show_homies", "botNames", "hide_names"].some(
			(key) => p.has(key),
		);

	if (looksChatis && !host.includes("unii.dev")) {
		return importFromChatis(p);
	}

	if (looksUchat) {
		return importFromUchat(p);
	}

	throw new Error("Unrecognised link. Paste a ChatIS or UChat overlay link.");
}

function safeDecodeURIComponent(value) {
	try {
		return decodeURIComponent(String(value || ""));
	} catch {
		return String(value || "");
	}
}

function importFromMChat(p) {
	const fadeParam = p.get("fade");
	let fade;

	if (fadeParam === null || fadeParam === "") {
		fade = 15;
	} else if (/^(?:off|false|0)$/i.test(String(fadeParam).trim())) {
		fade = false;
	} else {
		fade = importNumber(fadeParam, 15);

		if (fade < 1) {
			fade = 15;
		}
	}

	let messageCardBorderStyle = p.get("messageCardBorderStyle");

	if (!["solid", "dashed", "dotted"].includes(messageCardBorderStyle)) {
		messageCardBorderStyle = "solid";
	}

	let entryAnimation = p.get("entryAnimation");

	if (!["classic", "from-left", "from-right", "none"].includes(entryAnimation)) {
		entryAnimation = "classic";
	}

	const usernameFontMode = cleanFontMode(p.get("usernameFont"));
	const messageFontMode = cleanFontMode(p.get("messageFont"));
	const usernameFontName = sanitizeFontName(p.get("usernameFontName"));
	const messageFontName = sanitizeFontName(p.get("messageFontName"));
	const usernameSize = importClamp(importNumber(p.get("usernameSize"), 50), 8, 100);
	const messageSize = importClamp(importNumber(p.get("messageSize"), 50), 8, 100);

	const backgroundOpacityRaw = parseFloat(p.get("backgroundOpacity"));

	const settings = {
		background: importBool(p.get("background"), false),
		backgroundColor: importColor(p.get("backgroundColor"), "#000000"),
		backgroundOpacity: Number.isFinite(backgroundOpacityRaw)
			? importClamp(backgroundOpacityRaw, 0, 1)
			: 0,
		textColor: importColor(p.get("textColor"), "#ffffff"),
		messageCards: importBool(p.get("messageCards"), false),
		messageCardColor: importColor(p.get("messageCardColor"), "#141414"),
		messageCardOpacity: importClamp(importNumber(p.get("messageCardOpacity"), 0.72), 0, 1),
		messageCardRadius: importClamp(importNumber(p.get("messageCardRadius"), 10), 0, 32),
		messageCardBorderWidth: importClamp(importNumber(p.get("messageCardBorderWidth"), 0), 0, 8),
		messageCardBorderColor: importColor(p.get("messageCardBorderColor"), "#3a3a3a"),
		messageCardBorderStyle,
		messageCardPadding: importClamp(importNumber(p.get("messageCardPadding"), 0), 0, 24),
		messageSpacing: importClamp(importNumber(p.get("messageSpacing"), 3), 0, 32),
		fade,
		badges: importBool(p.get("badges"), true),
		badgeTwitch: importBool(p.get("badgeTwitch"), true),
		badgeFfz: importBool(p.get("badgeFfz"), true),
		badgeSeventv: importBool(p.get("badgeSeventv"), true),
		badgeChatterino: importBool(p.get("badgeChatterino"), true),
		badgeHomies: importBool(p.get("badgeHomies"), true),
		badgeBttv: importBool(p.get("badgeBttv"), true),
		badgeDankchat: importBool(p.get("badgeDankchat"), true),
		badgeMoltorino: importBool(p.get("badgeMoltorino"), true),
		gifs: importBool(p.get("gifs"), true),
		bots: importBool(p.get("bots"), true),
		hideLinks: importBool(p.get("hideLinks"), false),
		platformIndicator: importBool(p.get("platformIndicator"), true),
		colonMatchUsername: importBool(p.get("colonMatchUsername"), true),
		highlights: importBool(p.get("highlights"), false),
		hlFirst: importBool(p.get("hlFirst"), true),
		hlRedeems: importBool(p.get("hlRedeems"), true),
		hlGifts: importBool(p.get("hlGifts"), true),
		hlSubs: importBool(p.get("hlSubs"), true),
		hlRaids: importBool(p.get("hlRaids"), true),
		hlStreaks: importBool(p.get("hlStreaks"), true),
		pins: importBool(p.get("pins"), false),
		cheers: importBool(p.get("cheers"), true),
		collapse: importBool(p.get("collapse"), false),
		newestTop: importBool(p.get("newestTop"), false),
		align: cleanAlign(p.get("align")),
		msgFilter: safeDecodeURIComponent(p.get("msgFilter") || ""),
		botFilter: safeDecodeURIComponent(p.get("botFilter") || ""),
		scale: importClamp(importNumber(p.get("scale"), 0.5), 0.25, 3),
		emoteScale: importClamp(importNumber(p.get("emoteScale"), 1), 0.25, 3),
		bigEmotes: importBool(p.get("bigEmotes"), false),
		bigEmoteScale: importClamp(importNumber(p.get("bigEmoteScale"), 1.2), 1, 3),
		badgeScale: importClamp(importNumber(p.get("badgeScale"), 1), 0.25, 2),
		badgeSpacing: importClamp(importNumber(p.get("badgeSpacing"), 3), 0, 30),
		wrap: importBool(p.get("wrap"), false),
		wrapAfterColon: importBool(p.get("wrapAfterColon"), false),
		unlisted: importBool(p.get("unlisted"), true),
		font: fontQueryKeyToValue(p.get("font")),
		entryAnimation,
		customFont: sanitizeFontName(safeDecodeURIComponent(p.get("customFont") || "")),
		usernameFont: usernameFontMode,
		separateTypography: importBool(
			p.get("separateTypography"),
			usernameFontMode !== "chat" ||
				messageFontMode !== "chat" ||
				usernameSize !== 50 ||
				messageSize !== 50,
		),
		usernameFontName,
		messageFont: messageFontMode,
		messageFontName,
		usernameSize,
		messageSize,
		uppercase: importBool(p.get("uppercase"), false),
		bold: importBool(p.get("bold"), true),
		centerBadges: importBool(p.get("centerBadges"), false),
		centerEmotes: importBool(p.get("centerEmotes"), false),
		gifScale: importClamp(importNumber(p.get("gifScale"), 1), 0.25, 3),
		strokeWidth: importClamp(importNumber(p.get("strokeWidth"), 0), 0, 20),
		strokeColor: importColor(p.get("strokeColor"), "#000000"),
		shadow: importBool(p.get("shadow"), true),
		shadowIntensity: importClamp(importNumber(p.get("shadowIntensity"), 0.9), 0, 1),
		shadowSize: importClamp(importNumber(p.get("shadowSize"), 6), 0, 40),
		shadowOffset: importClamp(importNumber(p.get("shadowOffset"), 3), 0, 20),
	};

	return {
		source: "MChat",
		channel: normalizeTwitchChannel(p.get("channel")),
		kick: cleanKickInput(p.get("kick") || ""),
		youtube: cleanYouTubeInput(p.get("youtube") || ""),
		twitchId: null,
		settings,
		skipped: [],
	};
}

function convertMChatOverlayLink(raw) {
	let text = String(raw || "").trim();

	if (!/^https?:\/\//i.test(text)) {
		text = `https://${text}`;
	}

	let url;

	try {
		url = new URL(text);
	} catch {
		throw new Error("That doesn't look like a valid link.");
	}

	const result = importFromMChat(url.searchParams);

	if (!result.channel && !result.kick && !result.youtube) {
		throw new Error("That link doesn't have a Twitch, Kick, or YouTube channel in it.");
	}

	return result;
}

function showOverlaySetupScreen() {
	ensureEmoteScaleStyle();

	let screen = document.getElementById("overlay-setup-screen");

	if (screen) {
		return;
	}

	screen = document.createElement("div");
	screen.id = "overlay-setup-screen";

	loadGoogleFontIfNeeded("'Open Sans', sans-serif");


	const topbar = document.createElement("header");
	topbar.className = "mc-topbar";

	const brand = document.createElement("div");
	brand.className = "mc-brand";

	const brandMark = document.createElement("img");
	brandMark.className = "mc-brand-mark";
	brandMark.src = "waga.gif";
	brandMark.alt = "Waga";
	brandMark.draggable = false;

	const brandText = document.createElement("div");
	brandText.className = "mc-brand-text";

	const brandName = document.createElement("div");
	brandName.className = "mc-brand-name";

	const brandM = document.createElement("span");
	brandM.className = "mc-brand-m";
	brandM.textContent = "M";

	brandName.appendChild(brandM);
	brandName.appendChild(document.createTextNode("Chat"));

	const brandPage = document.createElement("div");
	brandPage.className = "mc-brand-page";
	brandPage.textContent = "The most up-to-date Twitch chat Overlay";

	brandText.appendChild(brandName);
	brandText.appendChild(brandPage);
	brand.appendChild(brandMark);
	brand.appendChild(brandText);

	topbar.appendChild(brand);

	const topLink = document.createElement("a");
	topLink.className = "mc-top-link";
	topLink.href = "privacy.html";
	topLink.textContent = "About & Credits";
	topbar.appendChild(topLink);

	const sidebar = document.createElement("aside");
	sidebar.className = "mc-sidebar";

	const navLabel = document.createElement("div");
	navLabel.className = "mc-nav-label";
	navLabel.textContent = "Setup";

	const nav = document.createElement("nav");
	nav.className = "mc-nav";

	sidebar.appendChild(navLabel);
	sidebar.appendChild(nav);

	const spacer = document.createElement("div");
	spacer.className = "mc-side-spacer";
	sidebar.appendChild(spacer);

	const sideActions = document.createElement("div");
	sideActions.className = "mc-side-actions";
	sidebar.appendChild(sideActions);

	const hint = document.createElement("div");
	hint.className = "mc-side-hint";
	hint.textContent =
		"Changes update the preview immediately. Take a look at the preview to see how your overlay will look on stream.";
	sidebar.appendChild(hint);

	const controls = document.createElement("main");
	controls.className = "mc-controls";

	const controlsHead = document.createElement("div");
	controlsHead.className = "mc-controls-head";

	const controlTitle = document.createElement("h1");
	controlTitle.className = "mc-control-title";
	controlTitle.textContent = "Overlay setup";

	const controlSubtitle = document.createElement("p");
	controlSubtitle.className = "mc-control-subtitle";
	controlSubtitle.textContent = "Tune the overlay without leaving the preview.";

	controlsHead.appendChild(controlTitle);
	controlsHead.appendChild(controlSubtitle);

	const panelStack = document.createElement("div");
	panelStack.className = "mc-panel-stack";

	controls.appendChild(controlsHead);
	controls.appendChild(panelStack);

	const setupFooter = document.createElement("div");
	setupFooter.className = "mc-setup-footer";

	const feedback = document.createElement("div");
	feedback.className = "mc-feedback";

	const discordIcon = document.createElement("span");
	discordIcon.className = "mc-discord-icon";
	discordIcon.setAttribute("aria-hidden", "true");
	discordIcon.innerHTML = `
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18.93 5.45A16.2 16.2 0 0 0 14.9 4.2l-.5 1.03a14.5 14.5 0 0 0-4.8 0L9.1 4.2a16.2 16.2 0 0 0-4.03 1.25C2.52 9.15 1.83 12.97 2.18 16.74a16.4 16.4 0 0 0 4.95 2.5l1.2-1.65c-.66-.24-1.28-.54-1.87-.9l.46-.36c3.62 1.7 7.56 1.7 11.14 0 .15.12.3.25.46.36-.6.36-1.22.66-1.88.9l1.2 1.65a16.4 16.4 0 0 0 4.95-2.5c.42-4.37-.72-8.15-3.86-11.29ZM8.48 15.3c-1.08 0-1.96-1-1.96-2.23 0-1.24.86-2.24 1.96-2.24s1.98 1 1.96 2.24c0 1.23-.87 2.23-1.96 2.23Zm7.04 0c-1.08 0-1.96-1-1.96-2.23 0-1.24.86-2.24 1.96-2.24s1.98 1 1.96 2.24c0 1.23-.87 2.23-1.96 2.23Z" fill="currentColor"/>
		</svg>
	`;

	const feedbackCopy = document.createElement("div");
	feedbackCopy.className = "mc-feedback-copy";

	const feedbackLabel = document.createElement("div");
	feedbackLabel.className = "mc-feedback-label";
	feedbackLabel.textContent = "Feedback & support";

	const feedbackLink = document.createElement("a");
	feedbackLink.className = "mc-feedback-link";
	feedbackLink.href = "https://discord.com/users/1422977056085639309";
	feedbackLink.target = "_blank";
	feedbackLink.rel = "noopener noreferrer";
	feedbackLink.textContent = "Add me on Discord for fast answers";

	feedbackCopy.appendChild(feedbackLabel);
	feedbackCopy.appendChild(feedbackLink);
	feedback.appendChild(discordIcon);
	feedback.appendChild(feedbackCopy);

	const attribution = document.createElement("div");
	attribution.className = "mc-attribution";

	const attributionBrand = document.createElement("span");
	attributionBrand.className = "mc-attribution-brand";
	attributionBrand.textContent = "MChat · made with 🤍 by marz_dev";

	const attributionSeparator = document.createElement("span");
	attributionSeparator.className = "mc-attribution-separator";
	attributionSeparator.textContent = "•";

	const attributionDisclaimer = document.createElement("span");
	attributionDisclaimer.className = "mc-attribution-disclaimer";
	attributionDisclaimer.textContent = "Not affiliated with Twitch";

	const attributionSeparator2 = document.createElement("span");
	attributionSeparator2.className = "mc-attribution-separator";
	attributionSeparator2.textContent = "•";

	const attributionGithub = document.createElement("a");
	attributionGithub.className = "mc-attribution-github";
	attributionGithub.href = "https://github.com/MarzzzDev/MChat";
	attributionGithub.target = "_blank";
	attributionGithub.rel = "noopener noreferrer";
	attributionGithub.textContent = "GitHub";

	const attributionSeparator3 = document.createElement("span");
	attributionSeparator3.className = "mc-attribution-separator";
	attributionSeparator3.textContent = "•";

	const attributionCommit = document.createElement("a");
	attributionCommit.className = "mc-attribution-commit";
	attributionCommit.href = "https://github.com/MarzzzDev/MChat/commits/main";
	attributionCommit.target = "_blank";
	attributionCommit.rel = "noopener noreferrer";
	attributionCommit.textContent = "loading commit…";

	attribution.appendChild(attributionBrand);
	attribution.appendChild(attributionSeparator);
	attribution.appendChild(attributionDisclaimer);
	attribution.appendChild(attributionSeparator2);
	attribution.appendChild(attributionGithub);
	attribution.appendChild(attributionSeparator3);
	attribution.appendChild(attributionCommit);

	setupFooter.appendChild(feedback);
	setupFooter.appendChild(attribution);
	controls.appendChild(setupFooter);

	loadCommitInfo(attributionCommit);

	const stage = document.createElement("section");
	stage.className = "mc-stage";

	const stageHead = document.createElement("div");
	stageHead.className = "mc-stage-head";

	const stageTitle = document.createElement("div");
	stageTitle.className = "mc-stage-title";
	stageTitle.textContent = "Preview Chat";

	const stageMeta = document.createElement("div");
	stageMeta.className = "mc-stage-meta";

	stageHead.appendChild(stageTitle);
	stageHead.appendChild(stageMeta);

	const stageCanvas = document.createElement("div");
	stageCanvas.className = "mc-stage-canvas";

	const previewFrame = document.createElement("div");
	previewFrame.className = "mc-preview-frame";

	let previewChat = document.getElementById("chat");

	if (!previewChat) {
		previewChat = document.createElement("div");
		previewChat.id = "chat";
	}

	const originalKeys = [
		"position",
		"inset",
		"top",
		"left",
		"right",
		"bottom",
		"width",
		"height",
		"zIndex",
		"flex",
		"minHeight",
		"overflowY",
		"display",
		"flexDirection",
		"justifyContent",
		"padding",
	];

	for (const key of originalKeys) {
		previewChat.dataset[
			`original${key.charAt(0).toUpperCase()}${key.slice(1)}`
		] = previewChat.style[key] || "";
	}

	previewChat.classList.add("mc-preview-chat");
	previewChat.style.position = "relative";
	previewChat.style.inset = "auto";
	previewChat.style.top = "auto";
	previewChat.style.left = "auto";
	previewChat.style.right = "auto";
	previewChat.style.bottom = "auto";
	previewChat.style.width = "100%";
	previewChat.style.height = "100%";
	previewChat.style.zIndex = "auto";
	previewChat.style.flex = "1";
	previewChat.style.minHeight = "0";
	previewChat.style.overflowY = "auto";
	previewChat.style.display = "flex";
	previewChat.style.flexDirection = "column";
	previewChat.style.justifyContent = "flex-end";
	previewChat.style.padding = "22px";
	previewChat.innerHTML = "";

	previewFrame.appendChild(previewChat);
	stageCanvas.appendChild(previewFrame);

	stage.appendChild(stageHead);
	stage.appendChild(stageCanvas);

	screen.appendChild(topbar);
	screen.appendChild(sidebar);
	screen.appendChild(controls);
	screen.appendChild(stage);
	document.body.appendChild(screen);

	
	for (const el of [screen, stageCanvas, previewFrame]) {
		el.addEventListener("scroll", () => {
			el.scrollTop = 0;
			el.scrollLeft = 0;
		});
	}

	const simulateButton = document.createElement("button");
	simulateButton.type = "button";
	simulateButton.className = "mc-sim-btn";
	simulateButton.textContent = "Simulate";

	const simNextButton = document.createElement("button");
	simNextButton.type = "button";
	simNextButton.className = "mc-sim-btn";
	simNextButton.textContent = "Next clip";

	const simResetButton = document.createElement("button");
	simResetButton.type = "button";
	simResetButton.className = "mc-sim-btn";
	simResetButton.textContent = "Reset overlay";

	const simExportButton = document.createElement("div");
	simExportButton.className = "mc-sim-btn mc-sim-drag";
	simExportButton.draggable = true;
	simExportButton.textContent = "Drag me into OBS";

	const simHint = document.createElement("span");
	simHint.className = "mc-sim-hint";

	const freqWrap = document.createElement("label");
	freqWrap.style.cssText = "display:inline-flex;align-items:center;gap:6px;";
	freqWrap.title = "Average time between preview messages (randomized +-20%)";
	freqWrap.appendChild(document.createTextNode("Msg every"));

	const freqInput = document.createElement("input");
	freqInput.type = "number";
	freqInput.className = "mc-input";
	freqInput.min = "0.02";
	freqInput.max = "60";
	freqInput.step = "any";
	freqInput.value = String(previewIntervalSec);
	freqInput.style.cssText = "width:64px;height:28px;padding:0 8px;";
	freqWrap.appendChild(freqInput);
	freqWrap.appendChild(document.createTextNode("s"));

	const simBackgroundWrap = document.createElement("label");
	simBackgroundWrap.style.cssText =
		"display:inline-flex;align-items:center;gap:6px;";
	simBackgroundWrap.appendChild(document.createTextNode("Background"));

	const simBackgroundSelect = document.createElement("select");
	simBackgroundSelect.className = "mc-select";
	simBackgroundSelect.title = "Choose the simulation background";
	simBackgroundSelect.style.cssText = "width:126px;height:28px;padding:0 8px;";
	for (const [value, label] of [
		["clips", "Random clips"],
		["local", "Your video"],
		["color", "Solid color"],
	]) {
		const option = document.createElement("option");
		option.value = value;
		option.textContent = label;
		simBackgroundSelect.appendChild(option);
	}
	simBackgroundWrap.appendChild(simBackgroundSelect);

	const simBackgroundColor = document.createElement("input");
	simBackgroundColor.type = "color";
	simBackgroundColor.value = "#171717";
	simBackgroundColor.title = "Choose the simulation background color";
	simBackgroundColor.setAttribute("aria-label", "Simulation background color");
	simBackgroundColor.style.cssText =
		"display:none;width:32px;height:28px;padding:2px;border:1px solid var(--mc-line-strong);border-radius:4px;background:var(--mc-surface);cursor:pointer;";
	simBackgroundWrap.appendChild(simBackgroundColor);

	const simBackgroundFile = document.createElement("input");
	simBackgroundFile.type = "file";
	simBackgroundFile.accept = "video/*,.mp4,.webm,.mov,.m4v";
	simBackgroundFile.hidden = true;

	const simConfigGroup = document.createElement("div");
	simConfigGroup.className = "mc-sim-config";
	simConfigGroup.appendChild(freqWrap);
	simConfigGroup.appendChild(simBackgroundWrap);

	freqInput.addEventListener("input", () => {
		const v = Number(freqInput.value);
		if (!Number.isFinite(v) || v <= 0) {
			return;
		}
		previewIntervalSec = Math.max(0.02, Math.min(v, 60));
		if (previewActive && previewTimer !== null) {
			clearTimeout(previewTimer);
			previewTimer = setTimeout(runPreviewMessage, 100);
		}
	});

	const simZoomOut = document.createElement("button");
	simZoomOut.type = "button";
	simZoomOut.className = "mc-sim-btn";
	simZoomOut.textContent = "\u2212";
	simZoomOut.title = "Zoom out view";

	const simZoomReset = document.createElement("button");
	simZoomReset.type = "button";
	simZoomReset.className = "mc-sim-btn";
	simZoomReset.textContent = "100%";
	simZoomReset.title = "Reset view zoom";

	const simZoomIn = document.createElement("button");
	simZoomIn.type = "button";
	simZoomIn.className = "mc-sim-btn";
	simZoomIn.textContent = "+";
	simZoomIn.title = "Zoom in view";

	const simZoomGroup = document.createElement("div");
	simZoomGroup.className = "mc-sim-tool-group";
	simZoomGroup.appendChild(simZoomOut);
	simZoomGroup.appendChild(simZoomReset);
	simZoomGroup.appendChild(simZoomIn);

	const simClipGroup = document.createElement("div");
	simClipGroup.className = "mc-sim-tool-group";
	simClipGroup.appendChild(simNextButton);
	simClipGroup.appendChild(simResetButton);

	const simActionGroup = document.createElement("div");
	simActionGroup.className = "mc-sim-actions";
	simActionGroup.appendChild(simZoomGroup);
	simActionGroup.appendChild(simClipGroup);
	simActionGroup.appendChild(simExportButton);
	simActionGroup.appendChild(simulateButton);

	const simOnlyEls = [
		simBackgroundWrap,
		simHint,
		simNextButton,
		simResetButton,
		simExportButton,
		simZoomOut,
		simZoomReset,
		simZoomIn,
	];

	for (const el of simOnlyEls) {
		el.style.display = "none";
	}

	stageMeta.appendChild(simConfigGroup);
	stageMeta.appendChild(simActionGroup);
	stageMeta.appendChild(simHint);
	stageMeta.appendChild(simBackgroundFile);

	const sim = {
		active: false,
		x: null,
		y: null,
		scale: 1,
		w: 380,
		h: 520,
		clip: null,
		failed: new Set(),
		backgroundMode: "clips",
		backgroundColor: simBackgroundColor.value,
		localClipUrl: null,
	};

	let simBox = null;
	let simInner = null;
	let simHandle = null;
	let simEdgeL = null;
	let simEdgeR = null;
	let simEdgeT = null;
	let simEdgeB = null;
	let simVideo = null;
	let simVideoNext = null;
	let simActiveVideo = 0;
	let simNextClip = null;
	let simNote = null;
	let simObserver = null;

	const clampSimScale = (value) => Math.max(0.2, Math.min(4, value));
	const clampSimWidth = (value) => Math.max(120, Math.min(1920, value));
	const clampSimHeight = (value) => Math.max(80, Math.min(2160, value));
	const SIM_DEFAULT_WIDTH = 380;
	const SIM_DEFAULT_HEIGHT = 520;

	const view = { z: 1, x: 0, y: 0 };

	function applyView() {
		const W = previewFrame.clientWidth;
		const H = previewFrame.clientHeight;

		view.z = Math.max(1, Math.min(8, view.z));
		view.x = Math.min(0, Math.max(W - W * view.z, view.x));
		view.y = Math.min(0, Math.max(H - H * view.z, view.y));

		previewFrame.style.transformOrigin = "0 0";
		previewFrame.style.transform =
			view.z === 1
				? ""
				: `translate(${view.x}px, ${view.y}px) scale(${view.z})`;
		simZoomReset.textContent = `${Math.round(view.z * 100)}%`;
	}

	function zoomViewAt(factor, p) {
		const nz = Math.max(1, Math.min(8, view.z * factor));

		view.x += p.x * (view.z - nz);
		view.y += p.y * (view.z - nz);
		view.z = nz;
		applyView();
	}

	function resetView() {
		view.z = 1;
		view.x = 0;
		view.y = 0;
		applyView();
	}

	function frameCenter() {
		return { x: previewFrame.clientWidth / 2, y: previewFrame.clientHeight / 2 };
	}

	/*simZoomIn.addEventListener("click", () => zoomViewAt(1.3, frameCenter()));
	simZoomOut.addEventListener("click", () => zoomViewAt(1 / 1.3, frameCenter()));*/
	simZoomReset.addEventListener("click", resetView);
	simBackgroundSelect.addEventListener("change", () =>
		setSimulationBackground(simBackgroundSelect.value),
	);
	simBackgroundColor.addEventListener("input", () => {
		sim.backgroundColor = simBackgroundColor.value;
		if (sim.backgroundMode === "color") {
			previewFrame.style.backgroundColor = sim.backgroundColor;
		}
	});
	simBackgroundFile.addEventListener("change", () => {
		const file = simBackgroundFile.files?.[0];
		if (!file) {
			simBackgroundSelect.value = sim.backgroundMode;
			return;
		}

		if (file.type && !file.type.startsWith("video/")) {
			simBackgroundSelect.value = sim.backgroundMode;
			return;
		}

		if (sim.localClipUrl) {
			stopSimulationVideos();
			URL.revokeObjectURL(sim.localClipUrl);
		}
		sim.localClipUrl = URL.createObjectURL(file);
		playLocalSimulationVideo();
	});
	simBackgroundFile.addEventListener("cancel", () => {
		simBackgroundSelect.value = sim.backgroundMode;
	});
	previewFrame.addEventListener(
		"wheel",
		(event) => {
			if (!sim.active || (!event.ctrlKey && !event.metaKey)) {
				return;
			}

			event.preventDefault();
			zoomViewAt(event.deltaY < 0 ? 1.1 : 1 / 1.1, framePoint(event));
		},
		{ passive: false },
	);

	let pan = null;

	previewFrame.addEventListener("pointerdown", (event) => {
		if (!sim.active || event.button !== 0) {
			return;
		}

		if (simBox && simBox.contains(event.target)) {
			return;
		}

		const rect = previewFrame.getBoundingClientRect();

		pan = {
			sx: event.clientX,
			sy: event.clientY,
			vx: view.x,
			vy: view.y,
			moved: false,
			k: rect.width / previewFrame.offsetWidth / view.z || 1,
		};

		previewFrame.setPointerCapture(event.pointerId);
	});

	previewFrame.addEventListener("pointermove", (event) => {
		if (!pan) {
			return;
		}

		const dx = event.clientX - pan.sx;
		const dy = event.clientY - pan.sy;

		if (!pan.moved && Math.hypot(dx, dy) < 4) {
			return;
		}

		pan.moved = true;
		view.x = pan.vx + dx / pan.k;
		view.y = pan.vy + dy / pan.k;
		applyView();
	});

	previewFrame.addEventListener("pointerup", (event) => {
		if (pan && !pan.moved) {
			/*zoomViewAt(1.5, framePoint(event));*/
		}

		pan = null;
	});

	previewFrame.addEventListener("pointercancel", () => {
		pan = null;
	});

	previewFrame.addEventListener("contextmenu", (event) => {
		if (!sim.active) {
			return;
		}

		event.preventDefault();
		/*zoomViewAt(1 / 1.5, framePoint(event));*/
	});

	function framePoint(event) {
		const rect = previewFrame.getBoundingClientRect();
		const k = rect.width / previewFrame.offsetWidth || 1;

		return {
			x: (event.clientX - rect.left) / k - previewFrame.clientLeft,
			y: (event.clientY - rect.top) / k - previewFrame.clientTop,
		};
	}

	function fitSimFrame() {
		const cs = getComputedStyle(stageCanvas);
		const availW =
			stageCanvas.clientWidth -
			parseFloat(cs.paddingLeft) -
			parseFloat(cs.paddingRight);
		const availH =
			stageCanvas.clientHeight -
			parseFloat(cs.paddingTop) -
			parseFloat(cs.paddingBottom);

		let w = availW;
		let h = (w * 9) / 16;

		if (h > availH) {
			h = availH;
			w = (h * 16) / 9;
		}

		previewFrame.style.width = `${Math.max(0, w)}px`;
		previewFrame.style.height = `${Math.max(0, h)}px`;
	}

	function applySimBox() {
		if (!simBox) {
			return;
		}

		const fw = previewFrame.clientWidth;
		const fh = previewFrame.clientHeight;
		const bw = sim.w * sim.scale;
		const bh = sim.h * sim.scale;

		sim.fw = fw;

		sim.x = Math.min(Math.max(sim.x, 48 - bw), fw - 48);
		sim.y = Math.min(Math.max(sim.y, 48 - bh), fh - 48);

		simBox.style.left = `${sim.x}px`;
		simBox.style.top = `${sim.y}px`;
		simBox.style.width = `${bw}px`;
		simBox.style.height = `${bh}px`;

		simInner.style.width = `${sim.w}px`;
		simInner.style.height = `${sim.h}px`;
		simInner.style.transform = `scale(${sim.scale})`;

		simHint.textContent = `${Math.round(sim.w)} x ${Math.round(sim.h)} px - ${Math.round(sim.scale * 100)}%`;
		simHint.title =
			"Drag the chat to move it; drag edges to resize; drag the corner or scroll to scale. Click to zoom in, right-click to zoom out, and drag outside the chat to pan.";
	}

	function resetSimBox() {
		const fw = previewFrame.clientWidth;
		const fh = previewFrame.clientHeight;

		sim.w = SIM_DEFAULT_WIDTH;
		sim.h = SIM_DEFAULT_HEIGHT;
		sim.scale = clampSimScale(Math.min(1, (fh - 32) / sim.h));
		sim.x = Math.max(0, fw - sim.w * sim.scale - 16);
		sim.y = Math.max(0, fh - sim.h * sim.scale - 16);

		applySimBox();
	}

	function buildDropUrl() {
		const url = getOverlayUrl();

		if (!url) {
			return null;
		}

		const dropUrl = new URL(url);

		dropUrl.searchParams.set("layer-name", "MChat");

		if (sim.x !== null) {
			const k = 1920 / (sim.fw || 1);

			dropUrl.searchParams.set(
				"layer-width",
				String(Math.max(1, Math.round(sim.w * sim.scale * k))),
			);
			dropUrl.searchParams.set(
				"layer-height",
				String(Math.max(1, Math.round(sim.h * sim.scale * k))),
			);
			dropUrl.searchParams.set(
				"mcfit",
				`${Math.round(sim.w)},${Math.round(sim.h)}`,
			);
		}

		return dropUrl.toString();
	}

	function attachDropDrag(element) {
		element.draggable = true;

		element.addEventListener("dragstart", (event) => {
			const dropUrl = buildDropUrl();

			if (!dropUrl) {
				event.preventDefault();
				return;
			}

			event.dataTransfer.effectAllowed = "copyLink";
			event.dataTransfer.setData("text/uri-list", dropUrl);
			event.dataTransfer.setData("text/plain", dropUrl);
		});
	}

	attachDropDrag(simExportButton);

	function getRandomClip() {
		const usable = SIMULATE_CLIPS.filter((clip) => !sim.failed.has(clip));

		if (!usable.length) {
			return null;
		}

		const others = usable.filter((clip) => clip !== sim.clip);
		const pool = others.length ? others : usable;

		return pool[Math.floor(Math.random() * pool.length)];
	}

	function prewarmFirstClip() {
		ensureMediaPreconnect();
	}

	function preloadNextClip() {
		if (!sim.active || sim.backgroundMode !== "clips" || !simVideoNext) {
			return;
		}

		const clip = getRandomClip();

		if (!clip) {
			return;
		}

		simNextClip = clip;
		simVideoNext.preload = "metadata";
		simVideoNext.src = clip;
		simVideoNext.load();
	}

	function switchToNextClip() {
		if (
			!sim.active ||
			sim.backgroundMode !== "clips" ||
			!simVideo ||
			!simVideoNext
		) {
			return;
		}

		if (!simNextClip) {
			playRandomClip();
			return;
		}
		const oldVideo = simVideo;
		const newVideo = simVideoNext;

		simActiveVideo = simActiveVideo === 0 ? 1 : 0;

		simVideo = newVideo;
		simVideoNext = oldVideo;

		sim.clip = simNextClip;
		simNextClip = null;

		oldVideo.pause();
		oldVideo.removeAttribute("src");
		oldVideo.load();

		simVideo.preload = "auto";
		simVideo.style.display = "block";
		simVideoNext.style.display = "none";

		simNote.style.display = "none";

		simVideo.currentTime = 0;
		simVideo.play().catch(() => {});

		preloadNextClip();
	}

	function playRandomClip() {
		if (
			!sim.active ||
			sim.backgroundMode !== "clips" ||
			!simVideo ||
			!simVideoNext
		) {
			return;
		}

		const clip = getRandomClip();

		if (!clip) {
			simNote.style.display = "";
			return;
		}

		sim.clip = clip;

		simVideo.preload = "auto";
		simVideo.src = clip;
		simVideo.load();

		simVideoNext.removeAttribute("src");
		simVideoNext.load();

		simVideo.style.display = "block";
		simVideoNext.style.display = "none";

		simNote.style.display = "none";

		simVideo.play().catch(() => {});

		preloadNextClip();
	}

	function stopSimulationVideos() {
		sim.clip = null;
		simNextClip = null;

		for (const video of [simVideo, simVideoNext]) {
			if (!video) {
				continue;
			}

			video.pause();
			video.loop = false;
			video.removeAttribute("src");
			video.load();
			video.style.display = "none";
		}
	}

	function playLocalSimulationVideo() {
		if (!sim.active || !sim.localClipUrl || !simVideo) {
			return;
		}

		sim.backgroundMode = "local";
		simBackgroundSelect.value = "local";
		simBackgroundColor.style.display = "none";
		simNextButton.disabled = true;
		previewFrame.style.backgroundColor = "#000";
		stopSimulationVideos();

		simVideo.loop = true;
		simVideo.style.display = "block";
		simVideo.src = sim.localClipUrl;
		simVideo.load();
		simVideo.play().catch(() => {});
	}

	function setSimulationBackground(mode) {
		if (!sim.active) {
			return;
		}

		if (mode === "clips") {
			sim.backgroundMode = "clips";
			simBackgroundColor.style.display = "none";
			previewFrame.style.backgroundColor = "";
			stopSimulationVideos();
			playRandomClip();
		} else if (mode === "local") {
			if (sim.localClipUrl) {
				playLocalSimulationVideo();
			} else {
				simBackgroundSelect.value = sim.backgroundMode;
				simBackgroundFile.value = "";
				simBackgroundFile.click();
			}
		} else if (mode === "color") {
			sim.backgroundMode = "color";
			simBackgroundColor.style.display = "";
			previewFrame.style.backgroundColor = sim.backgroundColor;
			stopSimulationVideos();
		}

		simNextButton.disabled = sim.backgroundMode !== "clips";
	}

	function enterSimulation() {
		if (sim.active) {
			return;
		}

		sim.active = true;
		stageHead.classList.add("is-sim");
		sim.backgroundMode = "clips";
		simBackgroundSelect.value = "clips";
		simBackgroundColor.style.display = "none";
		simBackgroundWrap.style.display = "inline-flex";
		simNextButton.disabled = false;
		previewFrame.style.backgroundColor = "";

		previewFrame.classList.add("is-sim");
		stageTitle.textContent = "Simulation";
		simulateButton.textContent = "Return to Preview";
		simulateButton.classList.add("is-active");

		for (const el of simOnlyEls) {
			el.style.display = "";
		}

		simVideo = document.createElement("video");
		simVideoNext = document.createElement("video");

		for (const video of [simVideo, simVideoNext]) {
			video.className = "mc-sim-video";
			video.muted = false;
			video.autoplay = false;
			video.playsInline = true;
			video.preload = "auto";
			video.style.display = "none";
		}

		simVideo.style.display = "block";

		const onVideoEnded = (event) => {
			if (sim.backgroundMode === "clips" && event.target === simVideo) {
				switchToNextClip();
			}
		};

		const onVideoError = (event) => {
			if (!sim.active || sim.backgroundMode !== "clips") {
				return;
			}

			if (event.target === simVideo) {
				if (!sim.clip) {
					return;
				}

				console.warn(`Simulation clip failed to load: ${sim.clip}`);
				sim.failed.add(sim.clip);
				sim.clip = null;
				playRandomClip();
			} else if (event.target === simVideoNext) {
				if (!simNextClip) {
					return;
				}

				console.warn(`Simulation clip failed to preload: ${simNextClip}`);
				sim.failed.add(simNextClip);
				simNextClip = null;
				preloadNextClip();
			}
		};

		for (const video of [simVideo, simVideoNext]) {
			video.addEventListener("ended", onVideoEnded);
			video.addEventListener("error", onVideoError);
		}

		simNote = document.createElement("div");
		simNote.className = "mc-sim-note";

		simBox = document.createElement("div");
		simBox.className = "mc-sim-box";

		simInner = document.createElement("div");
		simInner.className = "mc-sim-inner";

		simHandle = document.createElement("div");
		simHandle.className = "mc-sim-handle";

		simEdgeL = document.createElement("div");
		simEdgeL.className = "mc-sim-edge mc-sim-edge-l";

		simEdgeR = document.createElement("div");
		simEdgeR.className = "mc-sim-edge mc-sim-edge-r";

		simEdgeT = document.createElement("div");
		simEdgeT.className = "mc-sim-edge mc-sim-edge-t";

		simEdgeB = document.createElement("div");
		simEdgeB.className = "mc-sim-edge mc-sim-edge-b";

		simBox.appendChild(simInner);
		simBox.appendChild(simEdgeT);
		simBox.appendChild(simEdgeB);
		simBox.appendChild(simEdgeL);
		simBox.appendChild(simEdgeR);
		simBox.appendChild(simHandle);

		simInner.appendChild(previewChat);
		previewChat.style.padding = previewChat.dataset.originalPadding || "";

		previewFrame.appendChild(simVideo);
		previewFrame.appendChild(simVideoNext);
		previewFrame.appendChild(simNote);
		previewFrame.appendChild(simBox);

		fitSimFrame();

		if (sim.x === null) {
			resetSimBox();
		} else {
			applySimBox();
		}

		let drag = null;

		simBox.addEventListener("pointerdown", (event) => {
			if (event.button !== 0) {
				return;
			}

			const p = framePoint(event);

			let mode = "move";

			if (event.target === simHandle) {
				mode = "scale";
			} else if (event.target === simEdgeL) {
				mode = "width-l";
			} else if (event.target === simEdgeR) {
				mode = "width-r";
			} else if (event.target === simEdgeT) {
				mode = "height-t";
			} else if (event.target === simEdgeB) {
				mode = "height-b";
			}

			drag = {
				mode,
				dx: p.x - sim.x,
				dy: p.y - sim.y,
				right: sim.x + sim.w * sim.scale,
				bottom: sim.y + sim.h * sim.scale,
			};

			simBox.classList.add("is-dragging");
			simBox.setPointerCapture(event.pointerId);
			event.preventDefault();
		});

		simBox.addEventListener("pointermove", (event) => {
			if (!drag) {
				return;
			}

			const p = framePoint(event);

			if (drag.mode === "move") {
				sim.x = p.x - drag.dx;
				sim.y = p.y - drag.dy;
			} else if (drag.mode === "width-r") {
				sim.w = clampSimWidth((p.x - sim.x) / sim.scale);
			} else if (drag.mode === "width-l") {
				sim.w = clampSimWidth((drag.right - p.x) / sim.scale);
				sim.x = drag.right - sim.w * sim.scale;
			} else if (drag.mode === "height-b") {
				sim.h = clampSimHeight((p.y - sim.y) / sim.scale);
			} else if (drag.mode === "height-t") {
				sim.h = clampSimHeight((drag.bottom - p.y) / sim.scale);
				sim.y = drag.bottom - sim.h * sim.scale;
			} else {
				sim.scale = clampSimScale(
					Math.max((p.x - sim.x) / sim.w, (p.y - sim.y) / sim.h),
				);
			}

			applySimBox();
		});

		const endDrag = () => {
			drag = null;
			simBox.classList.remove("is-dragging");
		};

		simBox.addEventListener("pointerup", endDrag);
		simBox.addEventListener("pointercancel", endDrag);
		simBox.addEventListener("click", (event) => {
			if (event.target === simBox) {
				/*zoomViewAt(1.5, framePoint(event));*/
			}
		});

		simBox.addEventListener(
			"wheel",
			(event) => {
				if (event.ctrlKey || event.metaKey) {
					return;
				}

				event.preventDefault();

				const p = framePoint(event);
				const next = clampSimScale(
					sim.scale * (event.deltaY < 0 ? 1.06 : 1 / 1.06),
				);
				const lx = (p.x - sim.x) / sim.scale;
				const ly = (p.y - sim.y) / sim.scale;

				sim.scale = next;
				sim.x = p.x - lx * next;
				sim.y = p.y - ly * next;

				applySimBox();
			},
			{ passive: false },
		);

		simObserver = new ResizeObserver(() => {
			fitSimFrame();
			applySimBox();
			applyView();
		});
		simObserver.observe(stageCanvas);

		playRandomClip();
	}

	function exitSimulation() {
		if (!sim.active) {
			return;
		}

		sim.active = false;
		sim.clip = null;
		sim.backgroundMode = "clips";
		simBackgroundSelect.value = "clips";
		simBackgroundColor.style.display = "none";
		simBackgroundWrap.style.display = "none";
		simBackgroundFile.value = "";
		previewFrame.style.backgroundColor = "";

		if (simObserver) {
			simObserver.disconnect();
			simObserver = null;
		}

		for (const video of [simVideo, simVideoNext]) {
			if (video) {
				video.pause();
				video.removeAttribute("src");
				video.load();
				video.remove();
			}
		}

		simVideo = null;
		simVideoNext = null;
		simNextClip = null;
		simActiveVideo = 0;
		if (sim.localClipUrl) {
			URL.revokeObjectURL(sim.localClipUrl);
			sim.localClipUrl = null;
		}

		previewChat.style.padding = "22px";
		previewFrame.appendChild(previewChat);

		simBox.remove();
		simNote.remove();

		simBox =
			simInner =
			simHandle =
			simEdgeL =
			simEdgeR =
			simEdgeT =
			simEdgeB =
			simNote =
				null;

		previewFrame.classList.remove("is-sim");
		stageHead.classList.remove("is-sim");
		previewFrame.style.width = "";
		previewFrame.style.height = "";
		resetView();

		stageTitle.textContent = "Preview Chat";
		simulateButton.textContent = "Simulate";
		simulateButton.classList.remove("is-active");

		for (const el of simOnlyEls) {
			el.style.display = "none";
		}
	}

	simulateButton.addEventListener("click", () => {
		if (sim.active) {
			exitSimulation();
		} else {
			enterSimulation();
		}
	});

	simNextButton.addEventListener("click", () => {
		sim.failed.clear();
		playRandomClip();
	});

	simResetButton.addEventListener("click", () => {
		resetSimBox();
	});

	screen._exitSimulation = exitSimulation;

	const panelRegistry = [];
	let lastNavGroup = null;
	const TAB_STORAGE_KEY = "mchat-setup-tab";

	function createPanel(id, navTitle, navDesc, icon, group) {
		const panel = document.createElement("section");
		panel.className = "mc-panel";
		panel.dataset.panel = id;
		panel.setAttribute("role", "tabpanel");

		if (group && group !== lastNavGroup) {
			const groupLabel = document.createElement("div");
			groupLabel.className = "mc-nav-group";
			groupLabel.textContent = group;
			nav.appendChild(groupLabel);
			lastNavGroup = group;
		}

		const navButton = document.createElement("button");
		navButton.type = "button";
		navButton.className = "mc-nav-button";
		navButton.dataset.panel = id;
		navButton.title = navDesc;
		navButton.setAttribute("role", "tab");

		const navIcon = document.createElement("span");
		navIcon.className = "mc-nav-icon";
		navIcon.setAttribute("aria-hidden", "true");
		navIcon.textContent = icon;

		const navCopy = document.createElement("span");
		navCopy.className = "mc-nav-copy";

		const title = document.createElement("span");
		title.className = "mc-nav-title";
		title.textContent = navTitle;

		navCopy.appendChild(title);
		navButton.appendChild(navIcon);
		navButton.appendChild(navCopy);
		nav.appendChild(navButton);
		panelStack.appendChild(panel);
		panelRegistry.push({ id, title: navTitle, panel, navButton });

		navButton.addEventListener("click", () => {
			for (const button of nav.querySelectorAll(".mc-nav-button")) {
				const active = button === navButton;
				button.classList.toggle("is-active", active);
				button.setAttribute("aria-selected", active ? "true" : "false");
				button.tabIndex = active ? 0 : -1;
			}

			for (const otherPanel of panelStack.querySelectorAll(".mc-panel")) {
				otherPanel.classList.toggle("is-active", otherPanel === panel);
			}

			controlTitle.textContent = navTitle;
			controlSubtitle.textContent = navDesc;
			panelStack.scrollTop = 0;
			navButton.scrollIntoView({ block: "nearest", inline: "nearest" });

			try {
				sessionStorage.setItem(TAB_STORAGE_KEY, id);
			} catch { }
		});

		return panel;
	}

	function createRouter() {
		let target = null;

		return {
			to(panel) {
				target = panel;
			},
			appendChild(node) {
				return target.appendChild(node);
			},
			append(...nodes) {
				target.append(...nodes);
			},
		};
	}

	function addField(parent, labelText, control) {
		const field = document.createElement("div");
		field.className = "mc-field";

		const label = document.createElement("label");
		label.className = "mc-label";
		label.textContent = labelText;

		field.appendChild(label);
		field.appendChild(control);
		parent.appendChild(field);

		return field;
	}

	function createPreviewWarning(text) {
		const warning = document.createElement("span");
		warning.className = "mc-preview-warning";
		warning.textContent = "*";

		const message =
			typeof text === "string" ? text : "Doesn't affect the Live Chat preview";

		warning.addEventListener("mouseenter", () => {
			warning.textContent = message;
		});

		warning.addEventListener("mouseleave", () => {
			warning.textContent = "*";
		});

		return warning;
	}

	function addToggle(parent, labelText, noteText, key, checked, previewWarning = false) {
		const row = document.createElement("label");
		row.className = "mc-toggle-row";

		const copy = document.createElement("div");
		copy.className = "mc-toggle-copy";

		const name = document.createElement("div");
		name.className = "mc-toggle-name";

		const label = document.createElement("span");
		label.textContent = labelText;
		name.appendChild(label);

		if (previewWarning) {
			name.appendChild(createPreviewWarning(previewWarning));
		}

		const note = document.createElement("div");
		note.className = "mc-toggle-note";
		note.textContent = noteText;

		copy.appendChild(name);
		copy.appendChild(note);

		const input = document.createElement("input");
		input.type = "checkbox";
		input.className = "mc-check";
		input.checked = checked;

		const switchEl = document.createElement("span");
		switchEl.className = "mc-switch";

		if (checked) {
			row.classList.add("is-on");
		}

		input.addEventListener("change", () => {
			row.classList.toggle("is-on", input.checked);
		});

		row.appendChild(copy);
		row.appendChild(input);
		row.appendChild(switchEl);
		parent.appendChild(row);

		return input;
	}
	function addPlatformToggles(parent, items, state, onToggle) {
		const grid = document.createElement("div");
		grid.className = "mc-platform-grid";

		for (const item of items) {
			const button = document.createElement("button");
			button.type = "button";
			button.className = `mc-platform-button${state[item.key] ? " is-active" : ""}`;
			button.dataset.platform = item.key;
			button.style.setProperty("--pc", item.color);

			const logo = document.createElement("img");
			logo.className = "mc-platform-logo";
			logo.src = item.logo;
			logo.alt = item.label;
			logo.draggable = false;
			logo.addEventListener("error", () => {
				logo.style.display = "none";
			});

			const label = document.createElement("span");
			label.className = "mc-platform-label";
			label.textContent = item.label;

			button.appendChild(logo);
			button.appendChild(label);
			grid.appendChild(button);

			button.addEventListener("click", () => {
				state[item.key] = !state[item.key];
				button.classList.toggle("is-active", state[item.key]);

				if (onToggle) {
					onToggle(item.key, state[item.key]);
				}

				rerenderPreviewChat();
			});
		}

		parent.appendChild(grid);

		return grid;
	}

	const connectionPanel = createPanel(
		"connection",
		"Channels",
		"Choose which Twitch, Kick and YouTube chats this overlay reads from.",
		"",
	);

	const channelInput = document.createElement("input");
	channelInput.type = "text";
	channelInput.className = "mc-channel-input";
	channelInput.placeholder = "Channel Name";
	channelInput.value = selectedChannel || "";
	channelInput.autocomplete = "off";
	channelInput.spellcheck = false;

	const channelLabelRow = document.createElement("div");
	channelLabelRow.className = "mc-channel-label-row";

	const channelLabel = document.createElement("label");
	channelLabel.className = "mc-channel-label";
	channelLabel.textContent = "Twitch Channel";

	const channelToggle = document.createElement("button");
	channelToggle.type = "button";
	channelToggle.className = "mc-channel-toggle";
	channelToggle.textContent = "+";
	channelToggle.setAttribute("aria-label", "Manage channels");

	channelLabelRow.appendChild(channelLabel);
	channelLabelRow.appendChild(channelToggle);

	const channelInputWrap = document.createElement("div");
	channelInputWrap.className = "mc-channel-input-wrap";
	channelInputWrap.appendChild(channelInput);

	const channelManager = document.createElement("div");
	channelManager.className = "mc-channel-manager";

	const twitchRow = document.createElement("div");
	twitchRow.className = "mc-channel-row";

	const twitchLogo = document.createElement("img");
	twitchLogo.className = "mc-channel-logo";
	twitchLogo.src = "logos/twitch.png";
	twitchLogo.alt = "";
	twitchLogo.draggable = false;

	twitchRow.appendChild(twitchLogo);

	const kickRow = document.createElement("div");
	kickRow.className = "mc-channel-row";

	const kickLogo = document.createElement("img");
	kickLogo.className = "mc-channel-logo";
	kickLogo.src = "logos/kick.svg";
	kickLogo.alt = "";
	kickLogo.draggable = false;

	const kickInput = document.createElement("input");
	kickInput.type = "text";
	kickInput.className = "mc-channel-input";
	kickInput.placeholder = "Kick Channel";
	kickInput.autocomplete = "off";
	kickInput.spellcheck = false;

	kickRow.appendChild(kickLogo);
	kickRow.appendChild(kickInput);

	const youtubeRow = document.createElement("div");
	youtubeRow.className = "mc-channel-row";

	const youtubeLogo = document.createElement("img");
	youtubeLogo.className = "mc-channel-logo";
	youtubeLogo.src = "logos/youtube.webp";
	youtubeLogo.alt = "";
	youtubeLogo.draggable = false;

	const youtubeInput = document.createElement("input");
	youtubeInput.type = "text";
	youtubeInput.className = "mc-channel-input";
	youtubeInput.placeholder = "Youtube Handle";
	youtubeInput.autocomplete = "off";
	youtubeInput.spellcheck = false;

	youtubeRow.appendChild(youtubeLogo);
	youtubeRow.appendChild(youtubeInput);

	kickInput.value = selectedKick || "";
	youtubeInput.value = selectedYouTube || "";

	channelInline = document.createElement("div");
	channelInline.appendChild(channelInputWrap);

	connectionPanel.appendChild(channelLabelRow);
	connectionPanel.appendChild(channelInline);
	connectionPanel.appendChild(channelManager);

	let channelsOpen = false;

	channelToggle.addEventListener("click", () => {
		channelsOpen = !channelsOpen;

		if (channelsOpen) {
			channelLabel.textContent = "Manage Channels";
			channelToggle.textContent = "-";
			channelToggle.setAttribute("aria-label", "Close channel manager");

			channelManager.appendChild(twitchRow);
			twitchRow.appendChild(channelInput);
			channelManager.appendChild(kickRow);
			channelManager.appendChild(youtubeRow);

			channelInputWrap.classList.add("is-hidden");

			window.setTimeout(() => {
				channelManager.classList.add("is-open");
			}, 20);

			return;
		}

		channelLabel.textContent = "Twitch Channel";
		channelToggle.textContent = "+";
		channelToggle.setAttribute("aria-label", "Manage channels");

		channelManager.classList.remove("is-open");

		window.setTimeout(() => {
			channelInputWrap.appendChild(channelInput);
			channelInputWrap.classList.remove("is-hidden");
			channelManager.innerHTML = "";
		}, 220);
	});

	if (selectedKick || selectedYouTube) {
		channelToggle.click();
	}

	const connectionDivider = document.createElement("div");
	connectionDivider.className = "mc-divider";
	connectionPanel.appendChild(connectionDivider);

	const connectionSub = document.createElement("h2");
	connectionSub.className = "mc-subhead";
	connectionSub.textContent = "Multichat";
	connectionPanel.appendChild(connectionSub);

	const connectionText = document.createElement("div");
	connectionText.className = "mc-muted";
	connectionText.textContent =
		"Reading from more than one platform? Choose whether each message shows where it came from.";
	connectionText.style.lineHeight = "1.55";
	connectionPanel.appendChild(connectionText);

	const layoutPanel = createPanel(
		"layout",
		"Messages",
		"How messages are arranged and how long they stay: background, wrapping, alignment, cards, repeats and fading.",
		"",
		"Customize",
	);
	const textPanel = createPanel(
		"text",
		"Text",
		"Font, size, color, shadow and outline for usernames and messages.",
		"",
		"Customize",
	);
	const emotesPanel = createPanel(
		"emotes",
		"Emotes & Badges",
		"Which badges and emotes show, and how big they are.",
		"",
		"Customize",
	);
	const eventsPanel = createPanel(
		"events",
		"Highlights",
		"Make first messages, redeems, subs, raids and pins stand out.",
		"",
		"Customize",
	);
	const filtersPanel = createPanel(
		"filters",
		"Filters",
		"Hide bots, commands, links, specific words or specific users.",
		"",
		"Customize",
	);
	const helpPanel = createPanel(
		"help",
		"Help",
		"Learn what MChat can do and how to use the overlay.",
		"",
		"More",
	);

	const colorsStage = document.createElement("div");
	const effectsStage = document.createElement("div");
	const behaviorPanel = layoutPanel;
	const subhead = (parent, text) => {
		const heading = document.createElement("h2");
		heading.className = "mc-subhead";
		heading.textContent = text;
		parent.appendChild(heading);
	};
	subhead(colorsStage, "Colors");

	const appearancePanel = createRouter();
	const typographyPanel = createRouter();
	const timingPanel = behaviorPanel;

	appearancePanel.to(layoutPanel);
	subhead(layoutPanel, "Background");

	const backgroundCheckbox = addToggle(
		appearancePanel,
		"Background",
		"Adjustable backdrop behind every message.",
		"background",
		backgroundEnabled,
	);

	const backgroundColorRow = document.createElement("div");
	backgroundColorRow.className = "mc-color-row";
	backgroundColorRow.style.borderRadius = "0";
	backgroundColorRow.style.marginBottom = "0";

	const backgroundColorText = document.createElement("span");
	backgroundColorText.className = "mc-muted";
	backgroundColorText.textContent = backgroundColor;

	const backgroundColorInput = document.createElement("input");
	backgroundColorInput.type = "color";
	backgroundColorInput.className = "mc-color";
	backgroundColorInput.value = backgroundColor;
	backgroundColorInput.setAttribute("aria-label", "Background color");

	backgroundColorRow.appendChild(backgroundColorText);
	backgroundColorRow.appendChild(backgroundColorInput);
	appearancePanel.appendChild(backgroundColorRow);

	const backgroundOpacityRow = document.createElement("div");
	backgroundOpacityRow.className = "mc-color-row";
	backgroundOpacityRow.style.marginTop = "0";
	backgroundOpacityRow.style.borderTop = "1px solid #050505";

	const backgroundOpacityInput = document.createElement("input");
	backgroundOpacityInput.type = "range";
	backgroundOpacityInput.className = "mc-range";
	backgroundOpacityInput.min = "0";
	backgroundOpacityInput.max = "100";
	backgroundOpacityInput.step = "1";
	backgroundOpacityInput.value = String(Math.round(backgroundOpacity * 100));
	backgroundOpacityInput.setAttribute("aria-label", "Background opacity");

	const backgroundOpacityText = document.createElement("span");
	backgroundOpacityText.className = "mc-percent";
	backgroundOpacityText.textContent = `${Math.round(backgroundOpacity * 100)}%`;

	backgroundOpacityRow.appendChild(backgroundOpacityInput);
	backgroundOpacityRow.appendChild(backgroundOpacityText);
	appearancePanel.appendChild(backgroundOpacityRow);

	appearancePanel.to(colorsStage);
	const textColorRow = document.createElement("div");
	textColorRow.className = "mc-toggle-row mc-static-row";

	const textColorCopy = document.createElement("div");
	textColorCopy.className = "mc-toggle-copy";

	const textColorTitle = document.createElement("div");
	textColorTitle.className = "mc-toggle-title";
	textColorTitle.textContent = "Text color";

	const textColorText = document.createElement("div");
	textColorText.className = "mc-toggle-note";
	textColorText.textContent = textColor;

	textColorCopy.appendChild(textColorTitle);
	textColorCopy.appendChild(textColorText);

	const textColorInput = document.createElement("input");
	textColorInput.type = "color";
	textColorInput.className = "mc-color";
	textColorInput.value = textColor;
	textColorInput.setAttribute("aria-label", "Text color");

	textColorRow.appendChild(textColorCopy);
	textColorRow.appendChild(textColorInput);
	appearancePanel.appendChild(textColorRow);

	appearancePanel.to(layoutPanel);
	subhead(layoutPanel, "Layout");
	const wrapCheckbox = addToggle(
		appearancePanel,
		"Wrap messages",
		"Make messages wrap under the username.",
		"wrap",
		wrapEnabled,
	);
	const wrapAfterColonCheckbox = addToggle(
		appearancePanel,
		"Wrap after colon",
		"Keep the first line after the username and align wrapped lines with the message text.",
		"wrapAfterColon",
		wrapAfterColonEnabled,
	);
	appearancePanel.to(emotesPanel);
	subhead(emotesPanel, "Badges & profile pictures");
	const badgesCheckbox = addToggle(
		appearancePanel,
		"Badges",
		"Show Twitch, 7TV, FFZ and other supported badges.",
		"badges",
		badgesEnabled,
	);

	const platformGrid = addPlatformToggles(
		appearancePanel,
		PLATFORM_BADGE_SOURCES,
		badgeSources,
		(key, value) => {
			if (key === "twitch") {
				badgeTwitch = value;
			} else if (key === "ffz") {
				badgeFfz = value;
			} else if (key === "seventv") {
				badgeSeventv = value;
			} else if (key === "chatterino") {
				badgeChatterino = value;
			} else if (key === "homies") {
				badgeHomies = value;
			} else if (key === "bttv") {
				badgeBttv = value;
			} else if (key === "dankchat") {
				badgeDankchat = value;
			} else if (key === "moltorino") {
				badgeMoltorino = value;
			}
		},
	);

	function syncPlatformState() {
		const disabled = !badgesCheckbox.checked;
		platformGrid.classList.toggle("is-disabled", disabled);
		for (const button of platformGrid.querySelectorAll(".mc-platform-button")) {
			button.disabled = disabled;
		}
	}

	syncPlatformState();

	const pfpsCheckbox = addToggle(
		appearancePanel,
		"PFPs",
		"Show Twitch PFPs in chat messages.",
		"pfps",
		pfpsEnabled,
	);

	const gifsCheckbox = addToggle(
		appearancePanel,
		"GIFs",
		"Show Twitch GIFs in chat messages.",
		"gifs",
		gifsEnabled,
	);
	appearancePanel.to(filtersPanel);
	subhead(filtersPanel, "Hide automatically");
	const botsCheckbox = addToggle(
		appearancePanel,
		"Bots",
		"Show bot messages and commands in chat.",
		"bots",
		botsEnabled,
	);
	const hideLinksCheckbox = addToggle(
		appearancePanel,
		"Hide links",
		"Replace links in messages with a \u{1F517} emoji.",
		"hideLinks",
		hideLinksEnabled,
	);
	appearancePanel.to(connectionPanel);
	const platformIndicatorCheckbox = addToggle(
		appearancePanel,
		"Show Platform Indicator",
		"Show which platform each message came from when multichat is active.",
		"platformIndicator",
		platformIndicatorEnabled,
		"Preview isn't a multichat, so no indicator shows",
	);
	appearancePanel.to(colorsStage);
	const colonMatchUsernameCheckbox = addToggle(
		appearancePanel,
		"Colon Matches Username Color",
		"Color the colon after the username with the username color/7TV Paint. When off, the colon uses the message text color instead.",
		"colonMatchUsername",
		colonMatchUsernameEnabled,
	);
	const highlightsCheckbox = addToggle(
		appearancePanel,
		"Username paints",
		"Color usernames with their 7TV Paint/Color.",
		"highlights",
		highlightsEnabled,
		true
	);
	appearancePanel.to(emotesPanel);
	subhead(emotesPanel, "Emotes");
	const unlistedCheckbox = addToggle(
		appearancePanel,
		"Unlisted 7TV emotes",
		"Render unlisted 7TV emotes.",
		"unlisted",
		showUnlisted7TV
	);

	const cheersCheckbox = addToggle(
		appearancePanel,
		"Bit / cheer emotes",
		"Show cheermotes (Cheer100 etc.) as images with the bit amount.",
		"cheers",
		cheersEnabled,
	);
	appearancePanel.to(behaviorPanel);
	const collapseCheckbox = addToggle(
		appearancePanel,
		"Collapse repeated messages",
		"Merge back-to-back identical messages into one with a counter (x4).",
		"collapse",
		collapseEnabled,
		"Preview has no repeated messages to merge",
	);
	const newestTopCheckbox = addToggle(
		appearancePanel,
		"Newest on top",
		"Show new messages at the top instead of the bottom.",
		"newestTop",
		newestTopEnabled,
	);

	const alignSelect = document.createElement("select");
	alignSelect.className = "mc-select";

	for (const [value, label] of [
		["left", "Left"],
		["center", "Center"],
		["right", "Right"],
	]) {
		const option = document.createElement("option");
		option.value = value;
		option.textContent = label;
		option.selected = value === alignMode;
		alignSelect.appendChild(option);
	}

	appearancePanel.to(layoutPanel);
	addField(appearancePanel, "Message alignment", alignSelect);

	const messageStyleGroup = document.createElement("div");
	messageStyleGroup.className = "mc-group";
	const messageStyleHead = document.createElement("div");
	messageStyleHead.className = "mc-group-head";
	const messageStyleTitle = document.createElement("div");
	messageStyleTitle.className = "mc-group-title";
	messageStyleTitle.textContent = "Message layout";
	const messageStyleNote = document.createElement("div");
	messageStyleNote.className = "mc-group-note";
	messageStyleNote.textContent =
		"Set card styling and spacing around messages and announcements.";
	messageStyleHead.append(messageStyleTitle, messageStyleNote);
	messageStyleGroup.appendChild(messageStyleHead);
	const messageStyleGrid = document.createElement("div");
	messageStyleGrid.className = "mc-message-layout-grid";
	messageStyleGroup.appendChild(messageStyleGrid);
	appearancePanel.appendChild(messageStyleGroup);

	const messageCardsCheckbox = addToggle(
		messageStyleGrid,
		"Message cards",
		"Give each regular message its own adjustable background card.",
		"messageCards",
		messageCardsEnabled,
	);

	const messageCardColorInput = document.createElement("input");
	messageCardColorInput.type = "color";
	messageCardColorInput.className = "mc-color";
	messageCardColorInput.value = messageCardColor;
	messageCardColorInput.setAttribute("aria-label", "Message card color");
	const messageCardColorField = addField(
		messageStyleGrid,
		"Card color",
		messageCardColorInput,
	);

	function createMessageCardRange(labelText, min, max, value, suffix) {
		const field = document.createElement("div");
		field.className = "mc-field";
		const label = document.createElement("label");
		label.className = "mc-label";
		label.textContent = labelText;
		const line = document.createElement("div");
		line.className = "mc-range-line";
		const input = document.createElement("input");
		input.type = "range";
		input.className = "mc-range";
		input.min = String(min);
		input.max = String(max);
		input.step = "1";
		input.value = String(value);
		const output = document.createElement("span");
		output.className = "mc-percent";
		output.textContent = `${value}${suffix}`;
		line.append(input, output);
		field.append(label, line);
		messageStyleGrid.appendChild(field);
		return { field, input, output };
	}

	const messageCardOpacityControl = createMessageCardRange(
		"Card opacity",
		0,
		100,
		Math.round(messageCardOpacity * 100),
		"%",
	);
	const messageCardRadiusControl = createMessageCardRange(
		"Card corners",
		0,
		32,
		messageCardRadius,
		" px",
	);
	const messageCardBorderWidthControl = createMessageCardRange(
		"Border width",
		0,
		8,
		messageCardBorderWidth,
		" px",
	);

	const messageCardBorderColorInput = document.createElement("input");
	messageCardBorderColorInput.type = "color";
	messageCardBorderColorInput.className = "mc-color";
	messageCardBorderColorInput.value = messageCardBorderColor;
	messageCardBorderColorInput.setAttribute("aria-label", "Card border color");
	const messageCardBorderColorField = addField(
		messageStyleGrid,
		"Border color",
		messageCardBorderColorInput,
	);

	const messageCardBorderStyleSelect = document.createElement("select");
	messageCardBorderStyleSelect.className = "mc-select";
	for (const [value, label] of [
		["solid", "Solid"],
		["dashed", "Dashed"],
		["dotted", "Dotted"],
	]) {
		const option = document.createElement("option");
		option.value = value;
		option.textContent = label;
		option.selected = value === messageCardBorderStyle;
		messageCardBorderStyleSelect.appendChild(option);
	}
	const messageCardBorderStyleField = addField(
		messageStyleGrid,
		"Border style",
		messageCardBorderStyleSelect,
	);

	const messageCardPaddingControl = createMessageCardRange(
		"Extra card padding",
		0,
		24,
		messageCardPadding,
		" px",
	);
	const messageSpacingControl = createMessageCardRange(
		"Message spacing",
		0,
		32,
		messageSpacing,
		" px",
	);

	const messageCardControls = [
		messageCardColorField,
		messageCardOpacityControl.field,
		messageCardRadiusControl.field,
		messageCardBorderWidthControl.field,
		messageCardBorderColorField,
		messageCardBorderStyleField,
		messageCardPaddingControl.field,
	];
	function syncMessageCardControls() {
		const cardsDisabled = !messageCardsCheckbox.checked;
		const borderDisabled =
			cardsDisabled || messageCardBorderWidthControl.input.value === "0";
		messageCardControls.forEach((control, index) => {
			control.classList.toggle(
				"is-disabled",
				index === 4 || index === 5 ? borderDisabled : cardsDisabled,
			);
		});
		messageCardColorInput.disabled = cardsDisabled;
		messageCardOpacityControl.input.disabled = cardsDisabled;
		messageCardRadiusControl.input.disabled = cardsDisabled;
		messageCardBorderWidthControl.input.disabled = cardsDisabled;
		messageCardBorderColorInput.disabled = borderDisabled;
		messageCardBorderStyleSelect.disabled = borderDisabled;
		messageCardPaddingControl.input.disabled = cardsDisabled;
	}
	syncMessageCardControls();

	messageCardsCheckbox.addEventListener("change", () => {
		messageCardsEnabled = messageCardsCheckbox.checked;
		applyMessageCardSettings();
		syncMessageCardControls();
	});

	messageCardColorInput.addEventListener("input", () => {
		messageCardColor = messageCardColorInput.value;
		applyMessageCardSettings();
	});

	messageCardOpacityControl.input.addEventListener("input", () => {
		messageCardOpacity = Number(messageCardOpacityControl.input.value) / 100;
		messageCardOpacityControl.output.textContent = `${messageCardOpacityControl.input.value}%`;
		applyMessageCardSettings();
	});

	messageCardRadiusControl.input.addEventListener("input", () => {
		messageCardRadius = Number(messageCardRadiusControl.input.value);
		messageCardRadiusControl.output.textContent = `${messageCardRadius} px`;
		applyMessageCardSettings();
	});

	messageCardBorderWidthControl.input.addEventListener("input", () => {
		messageCardBorderWidth = Number(messageCardBorderWidthControl.input.value);
		messageCardBorderWidthControl.output.textContent = `${messageCardBorderWidth} px`;
		applyMessageCardSettings();
		syncMessageCardControls();
	});

	messageCardBorderColorInput.addEventListener("input", () => {
		messageCardBorderColor = messageCardBorderColorInput.value;
		applyMessageCardSettings();
	});

	messageCardBorderStyleSelect.addEventListener("change", () => {
		messageCardBorderStyle = messageCardBorderStyleSelect.value;
		applyMessageCardSettings();
	});

	messageCardPaddingControl.input.addEventListener("input", () => {
		messageCardPadding = Number(messageCardPaddingControl.input.value);
		messageCardPaddingControl.output.textContent = `${messageCardPadding} px`;
		applyMessageCardSettings();
	});

	messageSpacingControl.input.addEventListener("input", () => {
		messageSpacing = Number(messageSpacingControl.input.value);
		messageSpacingControl.output.textContent = `${messageSpacing} px`;
		applyMessageCardSettings();
	});

	const hlGroup = document.createElement("div");
	hlGroup.className = "mc-group";

	const hlHead = document.createElement("div");
	hlHead.className = "mc-group-head";
	hlHead.innerHTML = `
		<div class="mc-group-title">Message highlights</div>
		<div class="mc-group-note">Pick which special messages stand out in chat.</div>
	`;
	hlGroup.appendChild(hlHead);
	appearancePanel.to(eventsPanel);
	appearancePanel.appendChild(hlGroup);

	function addHighlightToggle(label, note, key, checked, color, previewWarning = false) {
		const checkbox = addToggle(hlGroup, label, note, key, checked, previewWarning);
		const row = checkbox.parentElement;
		row.style.setProperty("--hc", color);

		return checkbox;
	}

	const hlFirstCheckbox = addHighlightToggle(
		"First messages",
		"A chatter's first message in the channel.",
		"hlFirst",
		hlFirstEnabled,
		"#9900ff",
	);
	const hlRedeemsCheckbox = addHighlightToggle(
		"Redeems",
		"Channel point redeems and Highlight My Message.",
		"hlRedeems",
		hlRedeemsEnabled,
		"#3e49dd",
	);
	const hlGiftsCheckbox = addHighlightToggle(
		"Gift subs",
		"Gifted sub and mass gift cards.",
		"hlGifts",
		hlGiftsEnabled,
		"#f472b6",
		"Preview has no gift sub messages",
	);
	const hlSubsCheckbox = addHighlightToggle(
		"Subs & resubs",
		"New subs and resubs with month count and streak.",
		"hlSubs",
		hlSubsEnabled,
		"#9146ff",
		"Preview has no sub messages",
	);
	const hlRaidsCheckbox = addHighlightToggle(
		"Raids",
		"Incoming raids with the raider's viewer count.",
		"hlRaids",
		hlRaidsEnabled,
		"#ff7a3d",
		"Preview has no raid messages",
	);
	const hlStreaksCheckbox = addHighlightToggle(
		"Watch streaks",
		"Watch streak milestones shared in chat.",
		"hlStreaks",
		hlStreaksEnabled,
		"#2fd1c5",
		"Preview has no watch streak messages",
	);
	const pinsCheckbox = addHighlightToggle(
		"Pinned messages",
		"Show the channel's pinned message at the top of the overlay.",
		"pins",
		pinsEnabled,
		"#a970ff",
		"Preview has no pinned messages",
	);

	appearancePanel.to(effectsStage);
	const shadowDivider = document.createElement("div");
	shadowDivider.className = "mc-divider";
	appearancePanel.appendChild(shadowDivider);

	const shadowSub = document.createElement("h2");
	shadowSub.className = "mc-subhead";
	shadowSub.textContent = "Text shadow";
	appearancePanel.appendChild(shadowSub);

	const shadowCheckbox = addToggle(
		appearancePanel,
		"Drop shadow",
		"Show a shadow behind usernames, text, emotes and badges.",
		"shadow",
		shadowEnabled,
	);

	const shadowTwoCol = document.createElement("div");
	shadowTwoCol.className = "mc-two-col";

	const shadowIntensityField = document.createElement("div");
	shadowIntensityField.className = "mc-field";

	const shadowIntensityLabel = document.createElement("label");
	shadowIntensityLabel.className = "mc-label";
	shadowIntensityLabel.textContent = "Intensity";

	const shadowIntensityInput = document.createElement("input");
	shadowIntensityInput.type = "number";
	shadowIntensityInput.className = "mc-input";
	shadowIntensityInput.min = "0";
	shadowIntensityInput.max = "1";
	shadowIntensityInput.step = "0.05";
	shadowIntensityInput.value = String(shadowIntensity);

	shadowIntensityField.appendChild(shadowIntensityLabel);
	shadowIntensityField.appendChild(shadowIntensityInput);

	const shadowSizeField = document.createElement("div");
	shadowSizeField.className = "mc-field";

	const shadowSizeLabel = document.createElement("label");
	shadowSizeLabel.className = "mc-label";
	shadowSizeLabel.textContent = "Size";

	const shadowSizeLine = document.createElement("div");
	shadowSizeLine.className = "mc-range-line";

	const shadowSizeInput = document.createElement("input");
	shadowSizeInput.type = "number";
	shadowSizeInput.className = "mc-input";
	shadowSizeInput.min = "0";
	shadowSizeInput.max = "40";
	shadowSizeInput.step = "1";
	shadowSizeInput.value = String(shadowSize);

	const shadowSizeUnit = document.createElement("span");
	shadowSizeUnit.className = "mc-unit";
	shadowSizeUnit.textContent = "px";

	shadowSizeLine.appendChild(shadowSizeInput);
	shadowSizeLine.appendChild(shadowSizeUnit);
	shadowSizeField.appendChild(shadowSizeLabel);
	shadowSizeField.appendChild(shadowSizeLine);

	shadowTwoCol.appendChild(shadowIntensityField);
	shadowTwoCol.appendChild(shadowSizeField);
	appearancePanel.appendChild(shadowTwoCol);

	const shadowOffsetField = document.createElement("div");
	shadowOffsetField.className = "mc-field";

	const shadowOffsetLabel = document.createElement("label");
	shadowOffsetLabel.className = "mc-label";
	shadowOffsetLabel.textContent = "Offset";

	const shadowOffsetLine = document.createElement("div");
	shadowOffsetLine.className = "mc-range-line";

	const shadowOffsetInput = document.createElement("input");
	shadowOffsetInput.type = "number";
	shadowOffsetInput.className = "mc-input";
	shadowOffsetInput.min = "0";
	shadowOffsetInput.max = "20";
	shadowOffsetInput.step = "1";
	shadowOffsetInput.value = String(shadowOffset);

	const shadowOffsetUnit = document.createElement("span");
	shadowOffsetUnit.className = "mc-unit";
	shadowOffsetUnit.textContent = "px";

	shadowOffsetLine.appendChild(shadowOffsetInput);
	shadowOffsetLine.appendChild(shadowOffsetUnit);
	shadowOffsetField.appendChild(shadowOffsetLabel);
	shadowOffsetField.appendChild(shadowOffsetLine);
	appearancePanel.appendChild(shadowOffsetField);

	typographyPanel.to(textPanel);
	subhead(textPanel, "Font & size");

	const fontSelect = document.createElement("select");
	fontSelect.className = "mc-select";

	for (const font of CHAT_FONTS) {
		const option = document.createElement("option");
		option.value = font.value;
		option.textContent = font.label;
		if (font.value === chatFont) {
			option.selected = true;
		}
		fontSelect.appendChild(option);
	}

	addField(typographyPanel, "Chat font", fontSelect);

	const entryAnimationSelect = document.createElement("select");
	entryAnimationSelect.className = "mc-select";
	for (const [value, label] of [
		["classic", "Classic"],
		["from-right", "From right"],
		["from-left", "From left"],
		["none", "None"],
	]) {
		const option = document.createElement("option");
		option.value = value;
		option.textContent = label;
		option.selected = value === entryAnimation;
		entryAnimationSelect.appendChild(option);
	}
	typographyPanel.to(layoutPanel);
	subhead(layoutPanel, "Animation");
	addField(typographyPanel, "Message entry animation", entryAnimationSelect);
	entryAnimationSelect.addEventListener("change", () => {
		entryAnimation = entryAnimationSelect.value;
		applyEntryAnimation();
	});

	const customFontInput = document.createElement("input");
	customFontInput.type = "text";
	customFontInput.className = "mc-input";
	customFontInput.placeholder = "e.g. Press Start 2P";
	customFontInput.value = customFontName;
	customFontInput.autocomplete = "off";
	customFontInput.spellcheck = false;

	typographyPanel.to(textPanel);
	const customFontField = addField(
		typographyPanel,
		"Google Font name",
		customFontInput,
	);

	const roleTypographyTitle = document.createElement("h2");
	roleTypographyTitle.className = "mc-subhead";
	roleTypographyTitle.textContent = "Username and message typography";
	const separateTypographyCheckbox = addToggle(
		typographyPanel,
		"Separate username/message typography",
		"Choose independent fonts and sizes for usernames and messages.",
		"separateTypography",
		roleTypographyEnabled,
	);

	const roleTypographyControls = document.createElement("div");
	roleTypographyControls.className = "mc-role-typography-controls";
	roleTypographyControls.style.display = roleTypographyEnabled ? "" : "none";
	roleTypographyControls.appendChild(roleTypographyTitle);

	const roleFontGrid = document.createElement("div");
	roleFontGrid.className = "mc-two-col";

	const roleFontOptions = [
		["chat", "Match chat font"],
		["opensans", "Open Sans"],
		["arial", "Arial"],
		["comicsans", "Comic Sans MS"],
		["roboto", "Roboto"],
		["montserrat", "Montserrat"],
		["minecraft", "Minecraft"],
		["custom", "Custom Google Font"],
	];

	function createRoleFontField(labelText, selectedMode, customName, ariaLabel) {
		const field = document.createElement("div");
		field.className = "mc-field";
		const label = document.createElement("label");
		label.className = "mc-label";
		label.textContent = labelText;
		const select = document.createElement("select");
		select.className = "mc-select";
		for (const [value, optionLabel] of roleFontOptions) {
			const option = document.createElement("option");
			option.value = value;
			option.textContent = optionLabel;
			option.selected = value === selectedMode;
			select.appendChild(option);
		}
		const customInput = document.createElement("input");
		customInput.type = "text";
		customInput.className = "mc-input";
		customInput.placeholder = "Google Font name";
		customInput.value = customName;
		customInput.autocomplete = "off";
		customInput.spellcheck = false;
		customInput.setAttribute("aria-label", ariaLabel);
		customInput.style.display = selectedMode === "custom" ? "" : "none";
		field.append(label, select, customInput);
		roleFontGrid.appendChild(field);
		return { field, select, customInput };
	}

	const usernameFontControl = createRoleFontField(
		"Username font",
		usernameFontMode,
		usernameFontName,
		"Custom username font",
	);
	const messageFontControl = createRoleFontField(
		"Message font",
		messageFontMode,
		messageFontName,
		"Custom message font",
	);
	roleTypographyControls.appendChild(roleFontGrid);

	const roleSizeGrid = document.createElement("div");
	roleSizeGrid.className = "mc-two-col";
	const usernameSizeInput = document.createElement("input");
	usernameSizeInput.type = "number";
	usernameSizeInput.className = "mc-input";
	usernameSizeInput.min = "8";
	usernameSizeInput.max = "100";
	usernameSizeInput.step = "1";
	usernameSizeInput.value = String(usernameFontSize);
	addField(roleSizeGrid, "Username size (px)", usernameSizeInput);
	const messageSizeInput = document.createElement("input");
	messageSizeInput.type = "number";
	messageSizeInput.className = "mc-input";
	messageSizeInput.min = "8";
	messageSizeInput.max = "100";
	messageSizeInput.step = "1";
	messageSizeInput.value = String(messageFontSize);
	addField(roleSizeGrid, "Message size (px)", messageSizeInput);
	roleTypographyControls.appendChild(roleSizeGrid);
	typographyPanel.appendChild(roleTypographyControls);

	function syncCustomFontField() {
		customFontField.style.display = fontSelect.value === "custom" ? "" : "none";
	}

	syncCustomFontField();

	function syncRoleFontFields() {
		usernameFontControl.customInput.style.display =
			usernameFontControl.select.value === "custom" ? "" : "none";
		messageFontControl.customInput.style.display =
			messageFontControl.select.value === "custom" ? "" : "none";
	}

	function updateRoleFont(role) {
		if (role === "username") {
			usernameFontMode = cleanFontMode(usernameFontControl.select.value);
			usernameFontName = sanitizeFontName(usernameFontControl.customInput.value);
		} else {
			messageFontMode = cleanFontMode(messageFontControl.select.value);
			messageFontName = sanitizeFontName(messageFontControl.customInput.value);
		}
		applyRoleTypography();
	}

	usernameFontControl.select.addEventListener("change", () => {
		syncRoleFontFields();
		updateRoleFont("username");
	});
	messageFontControl.select.addEventListener("change", () => {
		syncRoleFontFields();
		updateRoleFont("message");
	});

	let roleFontTimer = null;
	for (const [role, control] of [
		["username", usernameFontControl],
		["message", messageFontControl],
	]) {
		control.customInput.addEventListener("input", () => {
			clearTimeout(roleFontTimer);
			roleFontTimer = setTimeout(() => updateRoleFont(role), 400);
		});
	}

	usernameSizeInput.addEventListener("input", () => {
		const value = Number(usernameSizeInput.value);
		if (!Number.isFinite(value)) return;
		usernameFontSize = Math.max(8, Math.min(value, 100));
		usernameSizeInput.value = String(usernameFontSize);
		applyRoleTypography();
	});

	messageSizeInput.addEventListener("input", () => {
		const value = Number(messageSizeInput.value);
		if (!Number.isFinite(value)) return;
		messageFontSize = Math.max(8, Math.min(value, 100));
		messageSizeInput.value = String(messageFontSize);
		applyRoleTypography();
	});

	separateTypographyCheckbox.addEventListener("change", () => {
		roleTypographyEnabled = separateTypographyCheckbox.checked;
		roleTypographyControls.style.display = roleTypographyEnabled ? "" : "none";
		applyRoleTypography();
	});

	const typographyNote = document.createElement("div");
	typographyNote.className = "mc-muted";
	typographyNote.textContent =
		"Settings are included directly in the generated overlay URL.";
	typographyPanel.appendChild(typographyNote);

	const textScaleInput = document.createElement("input");
	textScaleInput.type = "number";
	textScaleInput.className = "mc-input";
	textScaleInput.min = "0.25";
	textScaleInput.max = "3";
	textScaleInput.step = "0.05";
	textScaleInput.value = String(scale);

	addField(typographyPanel, "Text scale", textScaleInput);

	const emoteScaleInput = document.createElement("input");
	emoteScaleInput.type = "number";
	emoteScaleInput.className = "mc-input";
	emoteScaleInput.min = "0.25";
	emoteScaleInput.max = "3";
	emoteScaleInput.step = "0.05";
	emoteScaleInput.value = String(emoteScale);

	typographyPanel.to(emotesPanel);
	subhead(emotesPanel, "Sizes & alignment");
	addField(typographyPanel, "Emote scale", emoteScaleInput);

	const bigEmotesCheckbox = addToggle(
		typographyPanel,
		"Big emote-only messages",
		"Enlarge emotes in messages that contain nothing but emotes.",
		"bigEmotes",
		bigEmotesEnabled,
	);

	const bigEmoteScaleInput = document.createElement("input");
	bigEmoteScaleInput.type = "number";
	bigEmoteScaleInput.className = "mc-input";
	bigEmoteScaleInput.min = "1";
	bigEmoteScaleInput.max = "3";
	bigEmoteScaleInput.step = "0.05";
	bigEmoteScaleInput.value = String(bigEmoteScale);

	addField(typographyPanel, "Big emote scale", bigEmoteScaleInput);

	const badgeScaleField = document.createElement("div");
	badgeScaleField.className = "mc-field";
	const badgeScaleLabel = document.createElement("label");
	badgeScaleLabel.className = "mc-label";
	badgeScaleLabel.textContent = "Badge size";
	const badgeScaleLine = document.createElement("div");
	badgeScaleLine.className = "mc-range-line";
	const badgeScaleInput = document.createElement("input");
	badgeScaleInput.type = "range";
	badgeScaleInput.className = "mc-range";
	badgeScaleInput.min = "25";
	badgeScaleInput.max = "200";
	badgeScaleInput.step = "5";
	badgeScaleInput.value = String(Math.round(badgeScale * 100));
	badgeScaleInput.setAttribute("aria-label", "Badge size");
	const badgeScaleOutput = document.createElement("span");
	badgeScaleOutput.className = "mc-percent";
	badgeScaleOutput.textContent = `${Math.round(badgeScale * 100)}%`;
	badgeScaleLine.append(badgeScaleInput, badgeScaleOutput);
	badgeScaleField.append(badgeScaleLabel, badgeScaleLine);
	typographyPanel.appendChild(badgeScaleField);

	badgeScaleInput.addEventListener("input", () => {
		badgeScale = Number(badgeScaleInput.value) / 100;
		badgeScaleOutput.textContent = `${badgeScaleInput.value}%`;
		document.documentElement.style.setProperty("--badge-scale", String(badgeScale));
	});

	const badgeSpacingField = document.createElement("div");
	badgeSpacingField.className = "mc-field";
	const badgeSpacingLabel = document.createElement("label");
	badgeSpacingLabel.className = "mc-label";
	badgeSpacingLabel.textContent = "Badge spacing";
	const badgeSpacingLine = document.createElement("div");
	badgeSpacingLine.className = "mc-range-line";
	const badgeSpacingInput = document.createElement("input");
	badgeSpacingInput.type = "range";
	badgeSpacingInput.className = "mc-range";
	badgeSpacingInput.min = "0";
	badgeSpacingInput.max = "30";
	badgeSpacingInput.step = "1";
	badgeSpacingInput.value = String(Math.round(badgeSpacing));
	badgeSpacingInput.setAttribute("aria-label", "Badge spacing");
	const badgeSpacingOutput = document.createElement("span");
	badgeSpacingOutput.className = "mc-percent";
	badgeSpacingOutput.textContent = `${Math.round(badgeSpacing)}px`;
	badgeSpacingLine.append(badgeSpacingInput, badgeSpacingOutput);
	badgeSpacingField.append(badgeSpacingLabel, badgeSpacingLine);
	typographyPanel.appendChild(badgeSpacingField);

	badgeSpacingInput.addEventListener("input", () => {
		badgeSpacing = Number(badgeSpacingInput.value);
		badgeSpacingOutput.textContent = `${badgeSpacingInput.value}px`;
		document.documentElement.style.setProperty("--badge-spacing", `${badgeSpacing}px`);
	});

	const gifScaleInput = document.createElement("input");
	gifScaleInput.type = "number";
	gifScaleInput.className = "mc-input";
	gifScaleInput.min = "0.25";
	gifScaleInput.max = "3";
	gifScaleInput.step = "0.05";
	gifScaleInput.value = String(gifScale);

	addField(typographyPanel, "GIF scale", gifScaleInput);

	typographyPanel.to(textPanel);
	const uppercaseCheckbox = addToggle(
		typographyPanel,
		"All uppercase",
		"Convert usernames, messages and replies to uppercase.",
		"uppercase",
		uppercaseEnabled,
	);

	const boldCheckbox = addToggle(
		typographyPanel,
		"Bold text",
		"Use the heaviest font weight for usernames and messages.",
		"bold",
		boldEnabled,
	);

	typographyPanel.to(emotesPanel);
	const centerBadgesCheckbox = addToggle(
		typographyPanel,
		"Center badges",
		"Slightly lower position of badges on the text instead of the default centered look.",
		"centerBadges",
		centerBadgesEnabled,
	);

	const centerEmotesCheckbox = addToggle(
		typographyPanel,
		"Center emotes",
		"Slightly lower position of emotes on the text instead of the default centered look.",
		"centerEmotes",
		centerEmotesEnabled,
	);

	typographyPanel.to(effectsStage);
	const strokeDivider = document.createElement("div");
	strokeDivider.className = "mc-divider";
	typographyPanel.appendChild(strokeDivider);

	const strokeSub = document.createElement("h2");
	strokeSub.className = "mc-subhead";
	strokeSub.textContent = "Text stroke";
	typographyPanel.appendChild(strokeSub);

	const strokeTwoCol = document.createElement("div");
	strokeTwoCol.className = "mc-two-col";

	const strokeWidthField = document.createElement("div");
	strokeWidthField.className = "mc-field";

	const strokeWidthLabel = document.createElement("label");
	strokeWidthLabel.className = "mc-label";
	strokeWidthLabel.textContent = "Thickness";

	const strokeWidthLine = document.createElement("div");
	strokeWidthLine.className = "mc-range-line";

	const strokeWidthInput = document.createElement("input");
	strokeWidthInput.type = "number";
	strokeWidthInput.className = "mc-input";
	strokeWidthInput.min = "0";
	strokeWidthInput.max = "20";
	strokeWidthInput.step = "0.5";
	strokeWidthInput.value = String(strokeWidth);

	const strokeWidthUnit = document.createElement("span");
	strokeWidthUnit.className = "mc-unit";
	strokeWidthUnit.textContent = "px";

	strokeWidthLine.appendChild(strokeWidthInput);
	strokeWidthLine.appendChild(strokeWidthUnit);
	strokeWidthField.appendChild(strokeWidthLabel);
	strokeWidthField.appendChild(strokeWidthLine);

	const strokeColorField = document.createElement("div");
	strokeColorField.className = "mc-field";

	const strokeColorLabel = document.createElement("label");
	strokeColorLabel.className = "mc-label";
	strokeColorLabel.textContent = "Color";

	const strokeColorInput = document.createElement("input");
	strokeColorInput.type = "color";
	strokeColorInput.className = "mc-color";
	strokeColorInput.value = strokeColor;
	strokeColorInput.setAttribute("aria-label", "Stroke color");

	strokeColorField.appendChild(strokeColorLabel);
	strokeColorField.appendChild(strokeColorInput);

	strokeTwoCol.appendChild(strokeWidthField);
	strokeTwoCol.appendChild(strokeColorField);
	typographyPanel.appendChild(strokeTwoCol);


	subhead(filtersPanel, "Custom filters");
	const msgFilterInput = document.createElement("input");
	msgFilterInput.type = "text";
	msgFilterInput.className = "mc-input";
	msgFilterInput.placeholder = "word, another word, spoiler";
	msgFilterInput.value = messageFilters.join(", ");
	msgFilterInput.autocomplete = "off";
	msgFilterInput.spellcheck = false;
	addField(filtersPanel, "Message filter (comma separated)", msgFilterInput);

	const botFilterInput = document.createElement("input");
	botFilterInput.type = "text";
	botFilterInput.className = "mc-input";
	botFilterInput.placeholder = "nightbot, streamelements, moobot";
	botFilterInput.value = botFilterUsers.join(", ");
	botFilterInput.autocomplete = "off";
	botFilterInput.spellcheck = false;
	addField(filtersPanel, "Bot / user filter (comma separated)", botFilterInput);

	const filtersNote = document.createElement("div");
	filtersNote.className = "mc-muted";
	filtersNote.textContent =
		"Message filter hides any message containing one of the words (not case sensitive). Bot filter hides everything sent by those usernames. Both are empty by default.";
	filtersPanel.appendChild(filtersNote);


	const helpFeatures = [
		"MChat is a Twitch chat overlay that works with OBS, Streamlabs, XSplit and other streaming software, integrating with emotes and badges from multiple platforms, such as 7TV, FFZ and BTTV. Chat look can be customized to your liking by adjusting the overlay settings such as the text scale, emote scale and any other preference you could ever want, and counting.",
		"7TV Paints, FFZ, BTTV and Twitch badges are supported.",
		"MChat is the only overlay that supports all effects, including FFZ and BTTV effect (ffzCursed, h!, etc)",
		"We have support for badges from every single platform available, and if there's a platform we're missing let us know!",
		"We are the first overlay with support of previewing the overlay with REAL clips, so you dont have to guess how it will look, you will know right in this setup.",
		"In Simulate mode you can drag the overlay, resize its width and height from the sides, top and bottom, scale it, and drag it into OBS with the same size and scale using the Drag me into OBS button.",
		"We support Kick, Twitch and Youtube all together.",
		"If any new feature is added, the overlay will be automatically refreshed to have the newest features at all times, with no need to do it manually.",
		"GIFs are supported, but can be disabled for performance.",
		"Bots and commands can be hidden from the overlay.",
		"Unlisted 7TV emotes can be enabled or disabled.",
		"You can choose from a variety of fonts for the chat.",
		"You can enable highlighting of usernames with the 7TV Paint/Color.",
		"You can scale the text and emotes independently.",
		"You can set a fade time for messages or disable fading.",
		"You can choose a background color and opacity for the whole chat, or disable the background.",
		"Cheermotes, message and user filters, newest-on-top, alignment and repeated-message collapsing are all available.",
		"Once adjusted to your liking, you may copy the link.",
	];

	const helpList = document.createElement("ul");
	helpList.className = "mc-help-list";

	for (const feature of helpFeatures) {
		const item = document.createElement("li");
		item.className = "mc-help-item";
		item.textContent = feature;
		helpList.appendChild(item);
	}

	helpPanel.appendChild(helpList);

	const helpNote = document.createElement("div");
	helpNote.className = "mc-help-note";
	helpNote.textContent = "More features being added daily.";
	helpPanel.appendChild(helpNote);

	subhead(timingPanel, "Timing");
	const timingTwoCol = document.createElement("div");
	timingTwoCol.className = "mc-two-col";

	const fadeField = document.createElement("div");
	fadeField.className = "mc-field";

	const fadeLabel = document.createElement("label");
	fadeLabel.className = "mc-label";
	fadeLabel.textContent = "Fade time";

	const fadeLine = document.createElement("div");
	fadeLine.className = "mc-range-line";

	const fadeInput = document.createElement("input");
	fadeInput.type = "number";
	fadeInput.className = "mc-input";
	fadeInput.min = "1";
	fadeInput.max = "300";
	fadeInput.step = "1";
	fadeInput.value = fade === false ? "" : String(fade);
	fadeInput.placeholder = "15";

	const fadeUnit = document.createElement("span");
	fadeUnit.className = "mc-unit";
	fadeUnit.textContent = "sec";

	fadeLine.appendChild(fadeInput);
	fadeLine.appendChild(fadeUnit);
	fadeField.appendChild(fadeLabel);
	fadeField.appendChild(fadeLine);

	timingTwoCol.appendChild(fadeField);
	timingPanel.appendChild(timingTwoCol);

	const noFade = addToggle(
		timingPanel,
		"Disable fading",
		"Keep messages always visible.",
		"disable-fading",
		fade === false,
	);

	const actions = document.createElement("div");
	actions.className = "mc-actions";

	const copyButton = document.createElement("button");
	copyButton.type = "button";
	copyButton.className = "mc-button mc-button-full";

	copyButton.textContent = "Copy overlay link";

	actions.appendChild(copyButton);

	const error = document.createElement("div");
	error.className = "mc-error";

	sideActions.appendChild(actions);
	sideActions.appendChild(error);

	copyButton.addEventListener("click", async () => {
		const url = getOverlayUrl();

		if (!url) {
			return;
		}

		let ok = false;

		try {
			await navigator.clipboard.writeText(url);
			ok = true;
		} catch {
			const ta = document.createElement("textarea");
			ta.value = url;
			ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
			document.body.appendChild(ta);
			ta.select();

			try {
				ok = document.execCommand("copy");
			} catch {}

			ta.remove();
		}

		if (!ok) {
			error.textContent = "Couldn't copy automatically. Copy it from here: " + url;
			error.style.display = "block";
			return;
		}

		copyButton.textContent = "Copied!";
		clearTimeout(copyButton._t);
		copyButton._t = setTimeout(() => {
			copyButton.textContent = "Copy overlay link";
		}, 1500);
	});

	function activatePanel(id) {
		const button = nav.querySelector(`.mc-nav-button[data-panel="${id}"]`);
		if (button) {
			button.click();
		}
	}

	function restoreInitialPanel() {
		let saved = null;

		try {
			saved = sessionStorage.getItem(TAB_STORAGE_KEY);
		} catch { }

		const known = panelRegistry.some((entry) => entry.id === saved);
		activatePanel(known ? saved : "connection");
	}

	restoreInitialPanel();

	function syncFadeState() {
		fadeInput.disabled = noFade.checked;
		fadeInput.style.opacity = noFade.checked ? ".45" : "1";
		fadeInput.title = noFade.checked
			? "Disable fading is enabled"
			: "Fade time in seconds";
	}

	function syncBackgroundState() {
		const disabled = !backgroundCheckbox.checked;

		backgroundColorRow.classList.toggle("is-disabled", disabled);
		backgroundOpacityRow.classList.toggle("is-disabled", disabled);
		backgroundColorInput.disabled = disabled;
		backgroundOpacityInput.disabled = disabled;
	}

	function applyBackgroundPreview() {
		backgroundEnabled = backgroundCheckbox.checked;
		backgroundColor = backgroundColorInput.value;
		backgroundOpacity = Number(backgroundOpacityInput.value) / 100;

		backgroundColorText.textContent = backgroundColor;
		backgroundOpacityText.textContent = `${Math.round(backgroundOpacity * 100)}%`;

		syncBackgroundState();
		applyChatBackground();

		previewChat.classList.toggle("has-background", backgroundEnabled);
	}

	function applyTextColorPreview() {
		textColor = textColorInput.value;
		textColorText.textContent = textColor;
		applyTextColor(textColor);
	}

	backgroundCheckbox.addEventListener("change", applyBackgroundPreview);
	backgroundColorInput.addEventListener("input", applyBackgroundPreview);
	backgroundColorInput.addEventListener("change", applyBackgroundPreview);
	backgroundOpacityInput.addEventListener("input", applyBackgroundPreview);
	backgroundOpacityInput.addEventListener("change", applyBackgroundPreview);
	textColorInput.addEventListener("input", applyTextColorPreview);
	textColorInput.addEventListener("change", applyTextColorPreview);

	syncBackgroundState();
	applyChatBackground();

	badgesCheckbox.addEventListener("change", () => {
		badgesEnabled = badgesCheckbox.checked;
		syncPlatformState();
		rerenderPreviewChat();
	});

	wrapCheckbox.addEventListener("change", () => {
		wrapEnabled = wrapCheckbox.checked;
		if (wrapEnabled && wrapAfterColonCheckbox.checked) {
			wrapAfterColonCheckbox.checked = false;
			wrapAfterColonEnabled = false;
		}
		applyLayoutSettings();
		rerenderPreviewChat();
	});

	wrapAfterColonCheckbox.addEventListener("change", () => {
		wrapAfterColonEnabled = wrapAfterColonCheckbox.checked;
		if (wrapAfterColonEnabled && wrapCheckbox.checked) {
			wrapCheckbox.checked = false;
			wrapEnabled = false;
		}
		applyLayoutSettings();
		rerenderPreviewChat();
	});

	pfpsCheckbox.addEventListener("change", () => {
		pfpsEnabled = pfpsCheckbox.checked;
		rerenderPreviewChat();
	});
	gifsCheckbox.addEventListener("change", () => {
		gifsEnabled = gifsCheckbox.checked;
		rerenderPreviewChat();
	});
	botsCheckbox.addEventListener("change", () => {
		botsEnabled = botsCheckbox.checked;
		rerenderPreviewChat();
	});
	hideLinksCheckbox.addEventListener("change", () => {
		hideLinksEnabled = hideLinksCheckbox.checked;
		rerenderPreviewChat();
	});
	platformIndicatorCheckbox.addEventListener("change", () => {
		platformIndicatorEnabled = platformIndicatorCheckbox.checked;
		rerenderPreviewChat();
	});
	colonMatchUsernameCheckbox.addEventListener("change", () => {
		colonMatchUsernameEnabled = colonMatchUsernameCheckbox.checked;
		rerenderPreviewChat();
	});
	highlightsCheckbox.addEventListener("change", () => {
		highlightsEnabled = highlightsCheckbox.checked;
		rerenderPreviewChat();
	});

	unlistedCheckbox.addEventListener("change", () => {
		showUnlisted7TV = unlistedCheckbox.checked;
		rerenderPreviewChat();
	});

	hlFirstCheckbox.addEventListener("change", () => {
		hlFirstEnabled = hlFirstCheckbox.checked;
		rerenderPreviewChat();
	});

	hlRedeemsCheckbox.addEventListener("change", () => {
		hlRedeemsEnabled = hlRedeemsCheckbox.checked;
		rerenderPreviewChat();
	});

	hlGiftsCheckbox.addEventListener("change", () => {
		hlGiftsEnabled = hlGiftsCheckbox.checked;
		rerenderPreviewChat();
	});

	hlSubsCheckbox.addEventListener("change", () => {
		hlSubsEnabled = hlSubsCheckbox.checked;
		rerenderPreviewChat();
	});

	hlRaidsCheckbox.addEventListener("change", () => {
		hlRaidsEnabled = hlRaidsCheckbox.checked;
		rerenderPreviewChat();
	});

	hlStreaksCheckbox.addEventListener("change", () => {
		hlStreaksEnabled = hlStreaksCheckbox.checked;
		rerenderPreviewChat();
	});

	pinsCheckbox.addEventListener("change", () => {
		pinsEnabled = pinsCheckbox.checked;
	});

	cheersCheckbox.addEventListener("change", () => {
		cheersEnabled = cheersCheckbox.checked;
		rerenderPreviewChat();
	});

	collapseCheckbox.addEventListener("change", () => {
		collapseEnabled = collapseCheckbox.checked;
		rerenderPreviewChat();
	});

	newestTopCheckbox.addEventListener("change", () => {
		newestTopEnabled = newestTopCheckbox.checked;
		applyLayoutSettings();
		rerenderPreviewChat();
	});

	alignSelect.addEventListener("change", () => {
		alignMode = cleanAlign(alignSelect.value);
		applyLayoutSettings();
	});

	let filterApplyTimer = null;

	function applyFilterChange() {
		clearTimeout(filterApplyTimer);

		filterApplyTimer = setTimeout(() => {
			messageFilters = parseQueryList(msgFilterInput.value);
			botFilterUsers = parseQueryList(botFilterInput.value, { stripAt: true });
			rerenderPreviewChat();
		}, 400);
	}

	msgFilterInput.addEventListener("input", applyFilterChange);
	botFilterInput.addEventListener("input", applyFilterChange);

	function syncShadowState() {
		shadowIntensityInput.disabled = !shadowCheckbox.checked;
		shadowSizeInput.disabled = !shadowCheckbox.checked;
		shadowOffsetInput.disabled = !shadowCheckbox.checked;

		const opacity = shadowCheckbox.checked ? "1" : ".45";
		shadowIntensityInput.style.opacity = opacity;
		shadowSizeInput.style.opacity = opacity;
		shadowOffsetInput.style.opacity = opacity;
	}

	shadowCheckbox.addEventListener("change", () => {
		shadowEnabled = shadowCheckbox.checked;
		document.body.classList.toggle("shadow-disabled", !shadowEnabled);
		syncShadowState();
	});

	shadowIntensityInput.addEventListener("input", () => {
		const value = Number(shadowIntensityInput.value);
		if (!Number.isFinite(value)) {
			return;
		}
		shadowIntensity = Math.max(0, Math.min(value, 1));
		document.documentElement.style.setProperty(
			"--shadow-color",
			`rgba(0, 0, 0, ${shadowIntensity})`,
		);
	});

	shadowSizeInput.addEventListener("input", () => {
		const value = Number(shadowSizeInput.value);
		if (!Number.isFinite(value)) {
			return;
		}
		shadowSize = Math.max(0, Math.min(value, 40));
		document.documentElement.style.setProperty(
			"--shadow-blur",
			`${shadowSize}px`,
		);
	});

	shadowOffsetInput.addEventListener("input", () => {
		const value = Number(shadowOffsetInput.value);
		if (!Number.isFinite(value)) {
			return;
		}
		shadowOffset = Math.max(0, Math.min(value, 20));
		document.documentElement.style.setProperty(
			"--shadow-offset-x",
			`${shadowOffset}px`,
		);
		document.documentElement.style.setProperty(
			"--shadow-offset-y",
			`${shadowOffset}px`,
		);
	});

	fontSelect.addEventListener("change", () => {
		chatFont = fontSelect.value;
		syncCustomFontField();
		applyChatFont();
		applyRoleTypography();
	});

	let customFontTimer = null;

	customFontInput.addEventListener("input", () => {
		clearTimeout(customFontTimer);

		customFontTimer = setTimeout(() => {
			customFontName = sanitizeFontName(customFontInput.value);
			applyChatFont();
			applyRoleTypography();
		}, 500);
	});

	uppercaseCheckbox.addEventListener("change", () => {
		uppercaseEnabled = uppercaseCheckbox.checked;
		applyTextStyleSettings();
	});

	boldCheckbox.addEventListener("change", () => {
		boldEnabled = boldCheckbox.checked;
		applyTextStyleSettings();
	});

	centerBadgesCheckbox.addEventListener("change", () => {
		centerBadgesEnabled = centerBadgesCheckbox.checked;
		applyTextStyleSettings();
	});

	centerEmotesCheckbox.addEventListener("change", () => {
		centerEmotesEnabled = centerEmotesCheckbox.checked;
		applyTextStyleSettings();
	});

	gifScaleInput.addEventListener("input", () => {
		const value = Number(gifScaleInput.value);
		if (!Number.isFinite(value)) {
			return;
		}
		gifScale = Math.max(0.25, Math.min(value, 3));
		applyTextStyleSettings();
	});

	strokeWidthInput.addEventListener("input", () => {
		const value = Number(strokeWidthInput.value);
		if (!Number.isFinite(value)) {
			return;
		}
		strokeWidth = Math.max(0, Math.min(value, 20));
		applyTextStyleSettings();
	});

	strokeColorInput.addEventListener("input", () => {
		strokeColor = strokeColorInput.value;
		applyTextStyleSettings();
	});

	let fadeApplyTimer = null;

	function applyFadeChange() {
		clearTimeout(fadeApplyTimer);

		fadeApplyTimer = setTimeout(() => {
			fade = noFade.checked
				? false
				: Math.max(1, Number(fadeInput.value) || 15);

			reschedulePreviewFades();
		}, 400);
	}

	fadeInput.addEventListener("input", () => {
		if (!noFade.checked) {
			applyFadeChange();
		}
	});

	noFade.addEventListener("change", () => {
		syncFadeState();
		applyFadeChange();
	});
	textScaleInput.addEventListener("input", () => {
		const newScale = Number(textScaleInput.value);
		if (!Number.isFinite(newScale)) {
			return;
		}
		scale = Math.max(0.25, Math.min(newScale, 3));
		document.documentElement.style.setProperty("--chat-scale", scale);
	});

	bigEmotesCheckbox.addEventListener("change", () => {
		bigEmotesEnabled = bigEmotesCheckbox.checked;
		rerenderPreviewChat();
	});

	bigEmoteScaleInput.addEventListener("input", () => {
		const next = Number(bigEmoteScaleInput.value);

		if (!Number.isFinite(next)) {
			return;
		}

		bigEmoteScale = Math.max(1, Math.min(next, 3));
		applyBigEmoteSettings();
	});

	emoteScaleInput.addEventListener("input", () => {
		const newEmoteScale = Number(emoteScaleInput.value);

		if (!Number.isFinite(newEmoteScale)) {
			return;
		}

		emoteScale = Math.max(0.25, Math.min(newEmoteScale, 3));

		document.documentElement.style.setProperty("--emote-scale", emoteScale);
	});

	for (const input of [channelInput, kickInput, youtubeInput]) {
		input.addEventListener("input", () => {
			error.style.display = "none";
		});

		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				copyButton.click();
			}
		});
	}

	channelInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			copyButton.click();
		}
	});

	function getOverlayUrl() {
		const rawChannel = channelInput.value.trim();
		const channel = normalizeTwitchChannel(rawChannel);
		const kickChannel = cleanKickInput(kickInput.value);
		const youtubeChannel = cleanYouTubeInput(youtubeInput.value);

		if (rawChannel && !channel) {
			error.textContent =
				"Twitch channel names can only contain letters, numbers, and underscores (up to 25 characters).";

			error.style.display = "block";
			activatePanel("connection");
			channelInput.focus();

			return null;
		}

		if (!channel && !kickChannel && !youtubeChannel) {
			error.textContent =
				"Enter a Twitch, Kick or YouTube channel before generating the overlay link.";

			error.style.display = "block";

			activatePanel("connection");
			channelInput.focus();

			return null;
		}

		error.style.display = "none";

		const overlaySettings = {
			background: backgroundCheckbox.checked,

			backgroundColor: backgroundColorInput.value,

			textColor: textColorInput.value,

			messageCards: messageCardsCheckbox.checked,

			messageCardColor: messageCardColorInput.value,

			messageCardOpacity: Number(messageCardOpacityControl.input.value) / 100,

			messageCardRadius: Number(messageCardRadiusControl.input.value),

			messageCardBorderWidth: Number(messageCardBorderWidthControl.input.value),

			messageCardBorderColor: messageCardBorderColorInput.value,

			messageCardBorderStyle: messageCardBorderStyleSelect.value,

			messageCardPadding: Number(messageCardPaddingControl.input.value),

			messageSpacing: Number(messageSpacingControl.input.value),

			fade: noFade.checked ? false : Math.max(1, Number(fadeInput.value) || 15),

			badges: badgesCheckbox.checked,

			badgeTwitch: badgeSources.twitch,

			badgeFfz: badgeSources.ffz,

			badgeSeventv: badgeSources.seventv,

			badgeChatterino: badgeSources.chatterino,

			badgeHomies: badgeSources.homies,

			badgeBttv: badgeSources.bttv,

			badgeDankchat: badgeSources.dankchat,

			badgeMoltorino: badgeSources.moltorino,

			pfps: pfpsCheckbox.checked,

			gifs: gifsCheckbox.checked,

			bots: botsCheckbox.checked,

			hideLinks: hideLinksCheckbox.checked,

			platformIndicator: platformIndicatorCheckbox.checked,
			colonMatchUsername: colonMatchUsernameCheckbox.checked,

			highlights: highlightsCheckbox.checked,

			hlFirst: hlFirstCheckbox.checked,

			hlRedeems: hlRedeemsCheckbox.checked,

			hlGifts: hlGiftsCheckbox.checked,

			hlSubs: hlSubsCheckbox.checked,

			hlRaids: hlRaidsCheckbox.checked,

			hlStreaks: hlStreaksCheckbox.checked,

			pins: pinsCheckbox.checked,

			cheers: cheersCheckbox.checked,

			collapse: collapseCheckbox.checked,

			newestTop: newestTopCheckbox.checked,

			align: alignSelect.value,

			msgFilter: msgFilterInput.value,

			botFilter: botFilterInput.value,

			scale: Math.max(0.25, Math.min(Number(textScaleInput.value) || 1, 3)),

			emoteScale: Math.max(
				0.25,
				Math.min(Number(emoteScaleInput.value) || 1, 3),
			),

			bigEmotes: bigEmotesCheckbox.checked,

			bigEmoteScale: Math.max(
				1,
				Math.min(Number(bigEmoteScaleInput.value) || 1.2, 3),
			),

			badgeScale: Number(badgeScaleInput.value) / 100,

			badgeSpacing: Number(badgeSpacingInput.value),

			wrap: wrapCheckbox.checked,

			wrapAfterColon: wrapAfterColonCheckbox.checked,

			unlisted: unlistedCheckbox.checked,

			font: fontSelect.value,

			entryAnimation: entryAnimationSelect.value,

			customFont: sanitizeFontName(customFontInput.value),

			usernameFont: usernameFontControl.select.value,

			separateTypography: separateTypographyCheckbox.checked,

			usernameFontName: sanitizeFontName(usernameFontControl.customInput.value),

			messageFont: messageFontControl.select.value,

			messageFontName: sanitizeFontName(messageFontControl.customInput.value),

			usernameSize: Number(usernameSizeInput.value),

			messageSize: Number(messageSizeInput.value),

			uppercase: uppercaseCheckbox.checked,

			bold: boldCheckbox.checked,

			centerBadges: centerBadgesCheckbox.checked,

			centerEmotes: centerEmotesCheckbox.checked,

			gifScale: Math.max(0.25, Math.min(Number(gifScaleInput.value) || 1, 3)),

			strokeWidth: Math.max(
				0,
				Math.min(Number(strokeWidthInput.value) || 0, 20),
			),

			strokeColor: strokeColorInput.value,

			shadow: shadowCheckbox.checked,

			shadowIntensity: Math.max(
				0,
				Math.min(Number(shadowIntensityInput.value) ?? 0.9, 1),
			),

			shadowSize: Math.max(0, Math.min(Number(shadowSizeInput.value) || 6, 40)),

			shadowOffset: Math.max(
				0,
				Math.min(Number(shadowOffsetInput.value) || 3, 20),
			),
		};

		const url = new URL(window.location.href);

		url.search = "";

		appendFlatOverlaySettings(url, channel, overlaySettings, {
			kick: kickChannel,
			youtube: youtubeChannel,
		});
		url.searchParams.set(
			"backgroundOpacity",
			String(
				Math.max(0, Math.min(Number(backgroundOpacityInput.value) / 100, 1)),
			),
		);

		return url.toString();
	}

	
	const importStyle = document.createElement("style");
	importStyle.dataset.marzSetup = "true";
	importStyle.textContent = `
		#overlay-setup-screen .mc-import {
			flex-shrink: 0;
			width: 100%;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-top: 24px;
			padding: 16px 0 0;
			border-top: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-import.mc-import-stacked {
			margin-top: 10px;
			padding-top: 0;
			border-top: none;
		}

		#overlay-setup-screen .mc-import-label {
			color: var(--mc-faint);
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 0.08em;
		}

		#overlay-setup-screen .mc-import-row {
			display: flex;
			width: 100%;
			gap: 8px;
		}

		#overlay-setup-screen .mc-import-row .mc-input {
			flex: 1;
			min-width: 0;
			width: 100%;
		}

		#overlay-setup-screen .mc-import-row .mc-button {
			flex-shrink: 0;
			width: auto;
			padding-left: 20px;
			padding-right: 20px;
		}

		#overlay-setup-screen .mc-import-status {
			min-height: 16px;
			font-size: 12px;
			font-weight: 600;
			line-height: 1.3;
		}

		#overlay-setup-screen .mc-import-status.is-ok {
			color: #22c55e;
		}

		#overlay-setup-screen .mc-import-status.is-bad {
			color: #f87171;
		}

	`;
	document.head.appendChild(importStyle);

	const startOverBox = document.createElement("div");
	startOverBox.className = "mc-import";

	const startOverLabel = document.createElement("div");
	startOverLabel.className = "mc-import-label";
	startOverLabel.textContent = "Start where you left off";

	const startOverRow = document.createElement("div");
	startOverRow.className = "mc-import-row";

	const startOverInput = document.createElement("input");
	startOverInput.type = "text";
	startOverInput.className = "mc-input";
	startOverInput.placeholder = "Paste an existing MChat overlay link";
	startOverInput.autocomplete = "off";
	startOverInput.spellcheck = false;

	const startOverButton = document.createElement("button");
	startOverButton.type = "button";
	startOverButton.className = "mc-button";
	startOverButton.textContent = "Import";

	const startOverStatus = document.createElement("div");
	startOverStatus.className = "mc-import-status";
	startOverStatus.setAttribute("role", "status");

	startOverRow.append(startOverInput, startOverButton);
	startOverBox.append(startOverLabel, startOverRow, startOverStatus);
	connectionPanel.appendChild(startOverBox);

	function showStartOverStatus(text, ok) {
		startOverStatus.textContent = text;
		startOverStatus.classList.toggle("is-ok", ok);
		startOverStatus.classList.toggle("is-bad", !ok);
	}

	function runStartOverImport() {
		const raw = startOverInput.value.trim();

		if (!raw) {
			showStartOverStatus("Paste an MChat overlay link first.", false);
			return;
		}

		let result;

		try {
			result = convertMChatOverlayLink(raw);
		} catch (error) {
			showStartOverStatus(error.message || "Couldn't read that link.", false);
			return;
		}

		try {
			applyImportedSettings(result);
		} catch (error) {
			console.error("Settings import failed:", error);
			showStartOverStatus("Something went wrong while importing.", false);
			return;
		}

		startOverInput.value = "";
		showStartOverStatus("Settings restored from your MChat link!", true);
	}

	startOverButton.addEventListener("click", runStartOverImport);

	startOverInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			runStartOverImport();
		}
	});

	startOverInput.addEventListener("input", () => {
		startOverStatus.textContent = "";
		startOverStatus.classList.remove("is-ok", "is-bad");
	});

	const importBox = document.createElement("div");
	importBox.className = "mc-import mc-import-stacked";

	const importLabel = document.createElement("div");
	importLabel.className = "mc-import-label";
	importLabel.textContent = "Import settings";

	const importRow = document.createElement("div");
	importRow.className = "mc-import-row";

	const importInput = document.createElement("input");
	importInput.type = "text";
	importInput.className = "mc-input";
	importInput.placeholder = "ChatIS or UChat link";
	importInput.autocomplete = "off";
	importInput.spellcheck = false;

	const importButton = document.createElement("button");
	importButton.type = "button";
	importButton.className = "mc-button";
	importButton.textContent = "Import";

	const importStatus = document.createElement("div");
	importStatus.className = "mc-import-status";
	importStatus.setAttribute("role", "status");

	importRow.append(importInput, importButton);
	importBox.append(importLabel, importRow, importStatus);
	connectionPanel.appendChild(importBox);

	(function finalizeTabs() {
		textPanel.append(...colorsStage.childNodes, ...effectsStage.childNodes);

		panelRegistry.forEach((entry, index) => {
			const pager = document.createElement("div");
			pager.className = "mc-panel-pager";

			const prev = panelRegistry[index - 1];
			const next = panelRegistry[index + 1];

			if (prev) {
				const button = document.createElement("button");
				button.type = "button";
				button.className = "mc-pager-button";
				button.textContent = `\u2190 ${prev.title}`;
				button.addEventListener("click", () => activatePanel(prev.id));
				pager.appendChild(button);
			}

			if (next) {
				const button = document.createElement("button");
				button.type = "button";
				button.className = "mc-pager-button is-next";
				button.textContent = `${next.title} \u2192`;
				button.addEventListener("click", () => activatePanel(next.id));
				pager.appendChild(button);
			}

			entry.panel.appendChild(pager);
		});

		nav.addEventListener("keydown", (event) => {
			const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];

			if (!keys.includes(event.key)) {
				return;
			}

			const current = panelRegistry.findIndex((entry) =>
				entry.navButton.classList.contains("is-active"),
			);
			let target = current;

			if (event.key === "Home") {
				target = 0;
			} else if (event.key === "End") {
				target = panelRegistry.length - 1;
			} else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
				target = (current + 1) % panelRegistry.length;
			} else {
				target = (current - 1 + panelRegistry.length) % panelRegistry.length;
			}

			event.preventDefault();
			panelRegistry[target].navButton.click();
			panelRegistry[target].navButton.focus();
		});
	})();

	function showImportStatus(text, ok) {
		importStatus.textContent = text;
		importStatus.classList.toggle("is-ok", ok);
		importStatus.classList.toggle("is-bad", !ok);
	}

	function importSet(control, value) {
		if (!control) {
			return;
		}

		if (control.type === "checkbox") {
			control.checked = Boolean(value);
		} else {
			control.value = String(value);
		}

		control.dispatchEvent(new Event("input", { bubbles: true }));
		control.dispatchEvent(new Event("change", { bubbles: true }));
	}

	function applyImportedSettings(result) {
		const s = result.settings;

		if (result.channel) {
			importSet(channelInput, result.channel);
		}

		if (result.kick) {
			importSet(kickInput, cleanKickInput(result.kick));
		}

		if (result.youtube) {
			importSet(youtubeInput, cleanYouTubeInput(result.youtube));
		}

		if (!result.channel && result.twitchId) {
			fetch(
				`https://api.ivr.fi/v2/twitch/user?id=${encodeURIComponent(result.twitchId)}`,
			)
				.then((response) => (response.ok ? response.json() : null))
				.then((data) => {
					const user = Array.isArray(data) ? data[0] : data;

					if (user?.login) {
						importSet(channelInput, String(user.login).toLowerCase());
					}
				})
				.catch(() => {});
		}

		importSet(separateTypographyCheckbox, s.separateTypography);
		importSet(fontSelect, s.font);
		importSet(customFontInput, s.customFont || "");
		importSet(textColorInput, s.textColor);
		importSet(boldCheckbox, s.bold);
		importSet(uppercaseCheckbox, s.uppercase);

		if (s.wrapAfterColon !== undefined) {
			importSet(wrapAfterColonCheckbox, s.wrapAfterColon);
		}

		importSet(textScaleInput, s.scale);
		importSet(emoteScaleInput, s.emoteScale);

		if (s.bigEmotes !== undefined) {
			importSet(bigEmotesCheckbox, s.bigEmotes);
		}

		if (s.bigEmoteScale !== undefined) {
			importSet(bigEmoteScaleInput, s.bigEmoteScale);
		}

		badgeScaleInput.step = "1";
		importSet(badgeScaleInput, Math.round(s.badgeScale * 100));

		if (s.pfps !== undefined) {
			importSet(pfpsCheckbox, s.pfps);
		}

		if (s.gifs !== undefined) {
			importSet(gifsCheckbox, s.gifs);
		}

		if (s.gifScale !== undefined) {
			importSet(gifScaleInput, s.gifScale);
		}

		importSet(strokeWidthInput, s.strokeWidth);
		importSet(strokeColorInput, s.strokeColor);

		importSet(shadowCheckbox, s.shadow);
		importSet(shadowIntensityInput, s.shadowIntensity);
		importSet(shadowSizeInput, s.shadowSize);
		importSet(shadowOffsetInput, s.shadowOffset);

		importSet(entryAnimationSelect, s.entryAnimation);

		if (s.fade === false) {
			importSet(noFade, true);
		} else {
			importSet(noFade, false);
			importSet(fadeInput, s.fade);
		}

		importSet(botsCheckbox, s.bots);

		if (s.hideLinks !== undefined) {
			importSet(hideLinksCheckbox, s.hideLinks);
		}

		if (s.botFilter !== undefined) {
			importSet(botFilterInput, s.botFilter);
		}

		if (s.msgFilter !== undefined) {
			importSet(msgFilterInput, s.msgFilter);
		}

		if (s.highlights !== undefined) {
			importSet(highlightsCheckbox, s.highlights);
		}

		if (s.hlFirst !== undefined) {
			importSet(hlFirstCheckbox, s.hlFirst);
		}

		if (s.hlRedeems !== undefined) {
			importSet(hlRedeemsCheckbox, s.hlRedeems);
		}

		importSet(badgesCheckbox, s.badges);
		if (s.colonMatchUsername !== undefined) {
			importSet(colonMatchUsernameCheckbox, s.colonMatchUsername);
		}

		if (s.background !== undefined) {
			importSet(backgroundCheckbox, s.background);
		}

		if (s.backgroundColor !== undefined) {
			importSet(backgroundColorInput, s.backgroundColor);
		}

		if (s.backgroundOpacity !== undefined) {
			importSet(backgroundOpacityInput, Math.round(s.backgroundOpacity * 100));
		}

		if (s.messageCards !== undefined) {
			importSet(messageCardsCheckbox, s.messageCards);
		}

		if (s.messageCardColor !== undefined) {
			importSet(messageCardColorInput, s.messageCardColor);
		}

		if (s.messageCardOpacity !== undefined) {
			importSet(messageCardOpacityControl.input, Math.round(s.messageCardOpacity * 100));
		}

		if (s.messageCardRadius !== undefined) {
			importSet(messageCardRadiusControl.input, s.messageCardRadius);
		}

		if (s.messageCardBorderWidth !== undefined) {
			importSet(messageCardBorderWidthControl.input, s.messageCardBorderWidth);
		}

		if (s.messageCardBorderColor !== undefined) {
			importSet(messageCardBorderColorInput, s.messageCardBorderColor);
		}

		if (s.messageCardBorderStyle !== undefined) {
			importSet(messageCardBorderStyleSelect, s.messageCardBorderStyle);
		}

		if (s.messageCardPadding !== undefined) {
			importSet(messageCardPaddingControl.input, s.messageCardPadding);
		}

		if (s.messageSpacing !== undefined) {
			importSet(messageSpacingControl.input, s.messageSpacing);
		}

		if (s.badgeScale !== undefined) {
			badgeScaleInput.step = "1";
			importSet(badgeScaleInput, Math.round(s.badgeScale * 100));
		}

		if (s.badgeSpacing !== undefined) {
			importSet(badgeSpacingInput, s.badgeSpacing);
		}

		if (s.platformIndicator !== undefined) {
			importSet(platformIndicatorCheckbox, s.platformIndicator);
		}

		if (s.hlGifts !== undefined) {
			importSet(hlGiftsCheckbox, s.hlGifts);
		}

		if (s.hlSubs !== undefined) {
			importSet(hlSubsCheckbox, s.hlSubs);
		}

		if (s.hlRaids !== undefined) {
			importSet(hlRaidsCheckbox, s.hlRaids);
		}

		if (s.hlStreaks !== undefined) {
			importSet(hlStreaksCheckbox, s.hlStreaks);
		}

		if (s.pins !== undefined) {
			importSet(pinsCheckbox, s.pins);
		}

		if (s.cheers !== undefined) {
			importSet(cheersCheckbox, s.cheers);
		}

		if (s.collapse !== undefined) {
			importSet(collapseCheckbox, s.collapse);
		}

		if (s.newestTop !== undefined) {
			importSet(newestTopCheckbox, s.newestTop);
		}

		if (s.align !== undefined) {
			importSet(alignSelect, s.align);
		}

		if (s.wrap !== undefined) {
			importSet(wrapCheckbox, s.wrap);
		}

		if (s.unlisted !== undefined) {
			importSet(unlistedCheckbox, s.unlisted);
		}

		if (s.centerBadges !== undefined) {
			importSet(centerBadgesCheckbox, s.centerBadges);
		}

		if (s.centerEmotes !== undefined) {
			importSet(centerEmotesCheckbox, s.centerEmotes);
		}

		if (s.usernameFont !== undefined) {
			importSet(usernameFontControl.select, s.usernameFont);
			usernameFontControl.customInput.style.display =
				s.usernameFont === "custom" ? "" : "none";
		}

		if (s.usernameFontName !== undefined) {
			importSet(usernameFontControl.customInput, s.usernameFontName || "");
		}

		if (s.messageFont !== undefined) {
			importSet(messageFontControl.select, s.messageFont);
			messageFontControl.customInput.style.display =
				s.messageFont === "custom" ? "" : "none";
		}

		if (s.messageFontName !== undefined) {
			importSet(messageFontControl.customInput, s.messageFontName || "");
		}

		if (s.usernameSize !== undefined) {
			importSet(usernameSizeInput, s.usernameSize);
		}

		if (s.messageSize !== undefined) {
			importSet(messageSizeInput, s.messageSize);
		}

		const sourceKeys = {
			twitch: "badgeTwitch",
			ffz: "badgeFfz",
			seventv: "badgeSeventv",
			chatterino: "badgeChatterino",
			homies: "badgeHomies",
			bttv: "badgeBttv",
			dankchat: "badgeDankchat",
			moltorino: "badgeMoltorino",
		};

		for (const [platform, key] of Object.entries(sourceKeys)) {
			if (s[key] === undefined || Boolean(badgeSources[platform]) === s[key]) {
				continue;
			}

			const button = platformGrid.querySelector(
				`.mc-platform-button[data-platform="${platform}"]`,
			);

			if (button) {
				button.disabled = false;
				button.click();
			}
		}

		syncPlatformState();
		rerenderPreviewChat();

		console.info(`[import] ${result.source} link imported. Not supported:`, result.skipped);
	}

	function runImport() {
		const raw = importInput.value.trim();

		if (!raw) {
			showImportStatus("Paste a ChatIS or UChat link first.", false);
			return;
		}

		let result;

		try {
			result = convertForeignOverlayLink(raw);
		} catch (error) {
			showImportStatus(error.message || "Couldn't read that link.", false);
			return;
		}

		try {
			applyImportedSettings(result);
		} catch (error) {
			console.error("Settings import failed:", error);
			showImportStatus("Something went wrong while importing.", false);
			return;
		}

		importInput.value = "";
		showImportStatus("Settings successfully imported!", true);
	}

	importButton.addEventListener("click", runImport);

	importInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			runImport();
		}
	});

	importInput.addEventListener("input", () => {
		importStatus.textContent = "";
		importStatus.classList.remove("is-ok", "is-bad");
	});

	syncFadeState();
	prewarmFirstClip();
	startPreviewMessages();
}

function showChannelError(message) {
	const screen = document.getElementById("overlay-setup-screen");

	if (!screen) {
		return;
	}

	const error = screen.querySelector("[data-channel-error]");

	if (error) {
		error.textContent = message;

		error.style.display = "block";
	}
}

function hideOverlaySetupScreen() {
	const screen = document.getElementById("overlay-setup-screen");

	if (!screen) {
		return;
	}

	stopPreviewMessages();

	if (typeof screen._exitSimulation === "function") {
		screen._exitSimulation();
	}

	const chat = document.getElementById("chat");

	if (chat && screen.contains(chat)) {
		chat.style.position = chat.dataset.originalPosition || "";
		chat.style.inset = chat.dataset.originalInset || "";
		chat.style.top = chat.dataset.originalTop || "";
		chat.style.left = chat.dataset.originalLeft || "";
		chat.style.right = chat.dataset.originalRight || "";
		chat.style.bottom = chat.dataset.originalBottom || "";
		chat.style.width = chat.dataset.originalWidth || "";
		chat.style.height = chat.dataset.originalHeight || "";
		chat.style.zIndex = chat.dataset.originalZIndex || "";

		chat.style.flex = "";
		chat.style.minHeight = "";
		chat.style.overflowY = "";

		delete chat.dataset.originalPosition;
		delete chat.dataset.originalInset;
		delete chat.dataset.originalTop;
		delete chat.dataset.originalLeft;
		delete chat.dataset.originalRight;
		delete chat.dataset.originalBottom;
		delete chat.dataset.originalWidth;
		delete chat.dataset.originalHeight;
		delete chat.dataset.originalZIndex;

		chat.style.display = "";
		chat.style.flexDirection = "";
		chat.style.justifyContent = "";

		document.body.appendChild(chat);
	}

	screen.remove();
	applyChatBackground();
}

(function applyFitParams() {
	const raw = new URLSearchParams(window.location.search).get("mcfit");

	if (!raw) {
		return;
	}

	const [w, h] = raw.split(",").map(Number);

	if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
		return;
	}

	function apply() {
		if (document.getElementById("overlay-setup-screen")) {
			return;
		}

		const body = document.body;

		if (!body || !window.innerWidth || !window.innerHeight) {
			return;
		}

		const k = window.innerWidth / w;
		const fitH = window.innerHeight / k;

		const set = (key, value) => body.style.setProperty(key, value, "important");

		document.documentElement.style.setProperty("overflow", "hidden", "important");
		document.documentElement.style.setProperty("background", "transparent", "important");

		set("position", "absolute");
		set("left", "0px");
		set("top", "0px");
		set("margin", "0px");
		set("width", `${w}px`);
		set("height", `${fitH}px`);
		set("overflow", "hidden");
		set("transform-origin", "0 0");
		set("transform", `scale(${k})`);
	}

	document.addEventListener("DOMContentLoaded", apply);
	window.addEventListener("resize", apply);
	window.setInterval(apply, 500);
})();