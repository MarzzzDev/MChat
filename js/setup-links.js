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
		tiktok: "",
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
		tiktok: cleanTikTokInput(p.get("tiktok") || ""),
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

	if (!["classic", "from-left", "from-right", "smooth-scroll", "none"].includes(entryAnimation)) {
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
		linkColor: importColor(p.get("linkColor"), "#4da3ff"),
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
		timestamps: importBool(p.get("timestamps"), false),
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
		emoteSpacing: importClamp(importNumber(p.get("emoteSpacing"), 3), 0, 20),
		bigEmotes: importBool(p.get("bigEmotes"), true),
		bigEmoteScale: importClamp(importNumber(p.get("bigEmoteScale"), 1.2), 1, 3),
		badgeScale: (() => {
			const value = importNumber(p.get("badgeScale"), 1);
			return importClamp(value > 2 ? value / 100 : value, 0.25, 2);
		})(),
		badgeSpacing: importClamp(importNumber(p.get("badgeSpacing"), 3), 0, 30),
		badgeNameSpacing: importClamp(importNumber(p.get("badgeNameSpacing"), 3), 0, 30),
		authorMessageSpacing: importClamp(importNumber(p.get("authorMessageSpacing"), 3), 0, 30),
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
		centerBadges: importBool(p.get("centerBadges"), true),

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
		tiktok: cleanTikTokInput(p.get("tiktok") || ""),
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

	if (!result.channel && !result.kick && !result.youtube && !result.tiktok) {
		throw new Error("That link doesn't have a supported channel in it.");
	}

	return result;
}
