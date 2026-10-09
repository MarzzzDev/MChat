function parseQueryBoolean(name, fallback) {
	const value = params.get(name);

	if (value === null || value === "") {
		return fallback;
	}

	const normalized = String(value).trim().toLowerCase();

	if (
		normalized === "1" ||
		normalized === "true" ||
		normalized === "yes" ||
		normalized === "on"
	) {
		return true;
	}

	if (
		normalized === "0" ||
		normalized === "false" ||
		normalized === "no" ||
		normalized === "off"
	) {
		return false;
	}

	return fallback;
}

function decodeLegacySerializedSettings(encoded) {
	if (!encoded) {
		return {};
	}

	try {
		const normalized = String(encoded).replace(/-/g, "+").replace(/_/g, "/");

		const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

		const json = decodeURIComponent(atob(padded));

		return JSON.parse(json) || {};
	} catch (error) {
		console.warn(
			"Legacy serialized overlay settings could not be decoded:",
			error,
		);

		return null;
	}
}

function normaliseOverlaySettings(settings = {}) {
	const result = {};

	result.background = settings.background === true;

	result.backgroundColor =
		typeof settings.backgroundColor === "string" &&
			/^#[0-9a-fA-F]{6}$/.test(settings.backgroundColor)
			? settings.backgroundColor
			: "#000000";

	result.textColor =
		typeof settings.textColor === "string" &&
			/^#[0-9a-fA-F]{6}$/.test(settings.textColor)
			? settings.textColor
			: "#ffffff";

	result.messageCards = settings.messageCards === true;

	result.messageCardColor =
		typeof settings.messageCardColor === "string" &&
			/^#[0-9a-fA-F]{6}$/.test(settings.messageCardColor)
			? settings.messageCardColor
			: "#141414";

	result.messageCardOpacity = Number(settings.messageCardOpacity ?? 0.72);
	if (!Number.isFinite(result.messageCardOpacity)) {
		result.messageCardOpacity = 0.72;
	}
	result.messageCardOpacity = Math.max(0, Math.min(result.messageCardOpacity, 1));

	result.messageCardRadius = Number(settings.messageCardRadius ?? 10);
	if (!Number.isFinite(result.messageCardRadius)) {
		result.messageCardRadius = 10;
	}
	result.messageCardRadius = Math.max(0, Math.min(result.messageCardRadius, 32));

	result.messageCardBorderWidth = Number(settings.messageCardBorderWidth ?? 0);
	if (!Number.isFinite(result.messageCardBorderWidth)) {
		result.messageCardBorderWidth = 0;
	}
	result.messageCardBorderWidth = Math.max(0, Math.min(result.messageCardBorderWidth, 8));

	result.messageCardBorderColor =
		typeof settings.messageCardBorderColor === "string" &&
			/^#[0-9a-fA-F]{6}$/.test(settings.messageCardBorderColor)
			? settings.messageCardBorderColor
			: "#3a3a3a";

	result.messageCardBorderStyle = ["solid", "dashed", "dotted"].includes(
		settings.messageCardBorderStyle,
	)
		? settings.messageCardBorderStyle
		: "solid";

	result.messageCardPadding = Number(settings.messageCardPadding ?? 0);
	if (!Number.isFinite(result.messageCardPadding)) {
		result.messageCardPadding = 0;
	}
	result.messageCardPadding = Math.max(0, Math.min(result.messageCardPadding, 24));

	result.messageSpacing = Number(settings.messageSpacing ?? 3);
	if (!Number.isFinite(result.messageSpacing)) {
		result.messageSpacing = 3;
	}
	result.messageSpacing = Math.max(0, Math.min(result.messageSpacing, 32));

	result.fade = settings.fade === false ? false : Number(settings.fade ?? 15);

	result.entryAnimation = ["classic", "from-left", "from-right", "none"].includes(
		settings.entryAnimation,
	)
		? settings.entryAnimation
		: "classic";

	if (
		result.fade !== false &&
		(!Number.isFinite(result.fade) || result.fade < 1)
	) {
		result.fade = 15;
	}

	result.badges = settings.badges !== false;

	result.badgeTwitch = settings.badgeTwitch !== false;

	result.badgeFfz = settings.badgeFfz !== false;

	result.badgeSeventv = settings.badgeSeventv !== false;

	result.badgeChatterino = settings.badgeChatterino !== false;

	result.badgeHomies = settings.badgeHomies !== false;

	result.badgeBttv = settings.badgeBttv !== false;

	result.badgeDankchat = settings.badgeDankchat !== false;

	result.badgeMoltorino = settings.badgeMoltorino !== false;

	result.gifs = settings.gifs !== false;

	result.highlights = settings.highlights === true;

	result.bots = settings.bots !== false;

	result.hlFirst = settings.hlFirst !== false;

	result.hlRedeems = settings.hlRedeems !== false;

	result.hlGifts = settings.hlGifts !== false;

	result.platformIndicator = settings.platformIndicator !== false;

	result.scale = Number(settings.scale ?? 0.5);

	if (!Number.isFinite(result.scale)) {
		result.scale = 0.5;
	}

	result.scale = Math.max(0.25, Math.min(result.scale, 3));

	result.emoteScale = Number(settings.emoteScale ?? 1);

	if (!Number.isFinite(result.emoteScale)) {
		result.emoteScale = 1;
	}

	result.emoteScale = Math.max(0.25, Math.min(result.emoteScale, 3));

	result.badgeScale = Number(settings.badgeScale ?? 1);
	if (!Number.isFinite(result.badgeScale)) result.badgeScale = 1;
	result.badgeScale = Math.max(0.25, Math.min(result.badgeScale, 2));

	result.badgeSpacing = Number(settings.badgeSpacing ?? 3);
	if (!Number.isFinite(result.badgeSpacing)) result.badgeSpacing = 3;
	result.badgeSpacing = Math.max(0, Math.min(result.badgeSpacing, 30));

	result.wrap = settings.wrap === true;

	result.wrapAfterColon = settings.wrapAfterColon === true;

	result.unlisted = settings.unlisted !== false;

	result.font =
		typeof settings.font === "string" && settings.font.trim()
			? settings.font
			: "'Open Sans', sans-serif";

	result.usernameFont = cleanFontMode(settings.usernameFont);
	result.messageFont = cleanFontMode(settings.messageFont);
	result.usernameFontName = sanitizeFontName(settings.usernameFontName);
	result.messageFontName = sanitizeFontName(settings.messageFontName);

	result.usernameSize = Number(settings.usernameSize ?? 50);
	if (!Number.isFinite(result.usernameSize)) result.usernameSize = 50;
	result.usernameSize = Math.max(8, Math.min(result.usernameSize, 100));

	result.messageSize = Number(settings.messageSize ?? 50);
	if (!Number.isFinite(result.messageSize)) result.messageSize = 50;
	result.messageSize = Math.max(8, Math.min(result.messageSize, 100));
	result.separateTypography =
		settings.separateTypography === true ||
		(settings.separateTypography == null &&
			(result.usernameFont !== "chat" ||
				result.messageFont !== "chat" ||
				result.usernameSize !== 50 ||
				result.messageSize !== 50));

	result.shadow = settings.shadow !== false;

	result.shadowIntensity = Number(settings.shadowIntensity ?? 0.9);

	if (!Number.isFinite(result.shadowIntensity)) {
		result.shadowIntensity = 0.9;
	}

	result.shadowIntensity = Math.max(0, Math.min(result.shadowIntensity, 1));

	result.shadowSize = Number(settings.shadowSize ?? 6);

	if (!Number.isFinite(result.shadowSize)) {
		result.shadowSize = 6;
	}

	result.shadowSize = Math.max(0, Math.min(result.shadowSize, 40));

	result.shadowOffset = Number(settings.shadowOffset ?? 3);

	if (!Number.isFinite(result.shadowOffset)) {
		result.shadowOffset = 3;
	}

	result.shadowOffset = Math.max(0, Math.min(result.shadowOffset, 20));

	result.bold = settings.bold !== false;

	result.uppercase = settings.uppercase === true;

	result.customFont = sanitizeFontName(settings.customFont);

	result.gifScale = Number(settings.gifScale ?? 1);

	if (!Number.isFinite(result.gifScale)) {
		result.gifScale = 1;
	}

	result.gifScale = Math.max(0.25, Math.min(result.gifScale, 3));

	result.strokeWidth = Number(settings.strokeWidth ?? 0);

	if (!Number.isFinite(result.strokeWidth)) {
		result.strokeWidth = 0;
	}

	result.strokeWidth = Math.max(0, Math.min(result.strokeWidth, 20));

	result.strokeColor =
		typeof settings.strokeColor === "string" &&
			/^#[0-9a-fA-F]{6}$/.test(settings.strokeColor)
			? settings.strokeColor
			: "#000000";

	result.cheers = settings.cheers !== false;

	result.collapse = settings.collapse === true;

	result.newestTop = settings.newestTop === true;

	result.align = cleanAlign(settings.align);

	result.msgFilter = parseQueryList(settings.msgFilter).join(",");

	result.botFilter = parseQueryList(settings.botFilter, { stripAt: true }).join(
		",",
	);

	return result;
}

function parseQueryList(raw, { stripAt = false } = {}) {
	return String(raw || "")
		.split(",")
		.map((item) => item.trim().toLowerCase())
		.map((item) => (stripAt ? item.replace(/^@/, "") : item))
		.filter(Boolean);
}

function cleanAlign(value) {
	const align = String(value || "")
		.trim()
		.toLowerCase();

	return ["left", "center", "right"].includes(align) ? align : "left";
}

function fontValueToQueryKey(value) {
	const map = {
		"'Open Sans', sans-serif": "opensans",
		"Arial, sans-serif": "arial",
		"'Comic Sans MS', sans-serif": "comicsans",
		"'Roboto', sans-serif": "roboto",
		"'Montserrat', sans-serif": "montserrat",
		"'Minecraft', sans-serif": "minecraft",
		custom: "custom",
	};

	return map[value] || "opensans";
}

function cleanFontMode(value) {
	const mode = String(value || "chat").trim().toLowerCase();
	return [
		"chat",
		"opensans",
		"arial",
		"comicsans",
		"roboto",
		"montserrat",
		"minecraft",
		"custom",
	].includes(mode)
		? mode
		: "chat";
}

function fontQueryKeyToValue(value) {
	const map = {
		opensans: "'Open Sans', sans-serif",
		open_sans: "'Open Sans', sans-serif",
		"open-sans": "'Open Sans', sans-serif",

		arial: "Arial, sans-serif",

		comicsans: "'Comic Sans MS', sans-serif",
		comic_sans: "'Comic Sans MS', sans-serif",
		"comic-sans": "'Comic Sans MS', sans-serif",

		roboto: "'Roboto', sans-serif",

		montserrat: "'Montserrat', sans-serif",

		minecraft: "'Minecraft', sans-serif",
		custom: "custom",
	};

	return (
		map[
		String(value || "")
			.trim()
			.toLowerCase()
		] || "'Open Sans', sans-serif"
	);
}

function cleanQueryColor(value) {
	const color = String(value || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : "000000";
}

function cleanQueryTextColor(value) {
	const color = String(value || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : "ffffff";
}

function cleanKickInput(value) {
	let text = String(value || "").trim();

	text = text.replace(/^https?:\/\/(?:www\.)?kick\.com\//i, "");
	text = text.replace(/^@/, "");

	return text.split(/[/?#\s]/)[0].toLowerCase();
}

function cleanYouTubeInput(value) {
	return String(value || "").trim();
}

function appendFlatOverlaySettings(url, channel, settings, extra = {}) {
	const normalised = normaliseOverlaySettings(settings);

	const query = [];

	const twitchChannel = String(channel || "")
		.trim()
		.toLowerCase()
		.replace(/^#/, "");

	if (twitchChannel) {
		query.push(["channel", twitchChannel]);
	}

	if (extra.kick) {
		query.push(["kick", encodeURIComponent(cleanKickInput(extra.kick))]);
	}

	if (extra.youtube) {
		query.push(["youtube", encodeURIComponent(cleanYouTubeInput(extra.youtube))]);
	}

	if (normalised.scale !== 0.5) {
		query.push(["scale", String(normalised.scale)]);
	}

	if (normalised.emoteScale !== 1) {
		query.push(["emoteScale", String(normalised.emoteScale)]);
	}

	if (normalised.badgeScale !== 1) {
		query.push(["badgeScale", String(normalised.badgeScale)]);
	}

	if (normalised.badgeSpacing !== 3) {
		query.push(["badgeSpacing", String(normalised.badgeSpacing)]);
	}

	const fontKey = fontValueToQueryKey(normalised.font);

	if (fontKey !== "opensans") {
		query.push(["font", fontKey]);
	}

	if (fontKey === "custom" && normalised.customFont) {
		query.push(["customFont", encodeURIComponent(normalised.customFont)]);
	}

	if (normalised.separateTypography) {
		query.push(["separateTypography", "1"]);

		for (const [role, mode, customName] of [
			["username", normalised.usernameFont, normalised.usernameFontName],
			["message", normalised.messageFont, normalised.messageFontName],
		]) {
			if (mode !== "chat") {
				query.push([`${role}Font`, mode]);
			}
			if (mode === "custom" && customName) {
				query.push([`${role}FontName`, encodeURIComponent(customName)]);
			}
		}

		if (normalised.usernameSize !== 50) {
			query.push(["usernameSize", String(normalised.usernameSize)]);
		}

		if (normalised.messageSize !== 50) {
			query.push(["messageSize", String(normalised.messageSize)]);
		}
	}

	if (normalised.bold !== true) {
		query.push(["bold", "0"]);
	}

	if (normalised.uppercase === true) {
		query.push(["uppercase", "1"]);
	}

	if (normalised.gifScale !== 1) {
		query.push(["gifScale", String(normalised.gifScale)]);
	}

	if (normalised.strokeWidth !== 0) {
		query.push(["strokeWidth", String(normalised.strokeWidth)]);
	}

	const cleanedStrokeColor = String(normalised.strokeColor)
		.replace(/^#/, "")
		.toLowerCase();

	if (cleanedStrokeColor !== "000000") {
		query.push(["strokeColor", cleanedStrokeColor]);
	}

	if (normalised.background !== false) {
		query.push(["background", normalised.background ? "1" : "0"]);
	}

	const cleanedBgColor = cleanQueryColor(normalised.backgroundColor);

	if (cleanedBgColor !== "000000") {
		query.push(["backgroundColor", cleanedBgColor]);
	}

	const cleanedTextColor = cleanQueryTextColor(normalised.textColor);

	if (cleanedTextColor !== "ffffff") {
		query.push(["textColor", cleanedTextColor]);
	}

	if (normalised.messageCards) {
		query.push(["messageCards", "1"]);
	}

	const cleanMessageCardColor = normalised.messageCardColor
		.replace(/^#/, "")
		.toLowerCase();
	if (cleanMessageCardColor !== "141414") {
		query.push(["messageCardColor", cleanMessageCardColor]);
	}

	if (normalised.messageCardOpacity !== 0.72) {
		query.push(["messageCardOpacity", String(normalised.messageCardOpacity)]);
	}

	if (normalised.messageCardRadius !== 10) {
		query.push(["messageCardRadius", String(normalised.messageCardRadius)]);
	}

	if (normalised.messageCardBorderWidth !== 0) {
		query.push(["messageCardBorderWidth", String(normalised.messageCardBorderWidth)]);
	}

	const cleanMessageCardBorderColor = normalised.messageCardBorderColor
		.replace(/^#/, "")
		.toLowerCase();
	if (cleanMessageCardBorderColor !== "3a3a3a") {
		query.push(["messageCardBorderColor", cleanMessageCardBorderColor]);
	}

	if (normalised.messageCardBorderStyle !== "solid") {
		query.push(["messageCardBorderStyle", normalised.messageCardBorderStyle]);
	}

	if (normalised.messageCardPadding !== 0) {
		query.push(["messageCardPadding", String(normalised.messageCardPadding)]);
	}

	if (normalised.messageSpacing !== 3) {
		query.push(["messageSpacing", String(normalised.messageSpacing)]);
	}

	if (normalised.fade !== 15) {
		query.push([
			"fade",
			normalised.fade === false ? "off" : String(normalised.fade),
		]);
	}

	if (normalised.entryAnimation !== "classic") {
		query.push(["entryAnimation", normalised.entryAnimation]);
	}

	if (normalised.badges !== true) {
		query.push(["badges", normalised.badges ? "1" : "0"]);
	}

	if (normalised.badgeTwitch !== true) {
		query.push(["badgeTwitch", normalised.badgeTwitch ? "1" : "0"]);
	}

	if (normalised.badgeFfz !== true) {
		query.push(["badgeFfz", normalised.badgeFfz ? "1" : "0"]);
	}

	if (normalised.badgeSeventv !== true) {
		query.push(["badgeSeventv", normalised.badgeSeventv ? "1" : "0"]);
	}

	if (normalised.badgeChatterino !== true) {
		query.push(["badgeChatterino", normalised.badgeChatterino ? "1" : "0"]);
	}

	if (normalised.badgeHomies !== true) {
		query.push(["badgeHomies", normalised.badgeHomies ? "1" : "0"]);
	}

	if (normalised.badgeBttv !== true) {
		query.push(["badgeBttv", normalised.badgeBttv ? "1" : "0"]);
	}

	if (normalised.badgeDankchat !== true) {
		query.push(["badgeDankchat", normalised.badgeDankchat ? "1" : "0"]);
	}

	if (normalised.badgeMoltorino !== true) {
		query.push(["badgeMoltorino", normalised.badgeMoltorino ? "1" : "0"]);
	}

	if (normalised.gifs !== true) {
		query.push(["gifs", normalised.gifs ? "1" : "0"]);
	}
	if (normalised.highlights === true) {
		query.push(["highlights", "1"]);
	}
	if (normalised.wrap !== false) {
		query.push(["wrap", normalised.wrap ? "1" : "0"]);
	}

	if (normalised.wrapAfterColon) {
		query.push(["wrapAfterColon", "1"]);
	}

	if (normalised.unlisted !== true) {
		query.push(["unlisted", normalised.unlisted ? "1" : "0"]);
	}

	if (normalised.bots !== true) {
		query.push(["bots", normalised.bots ? "1" : "0"]);
	}

	if (normalised.hlFirst !== true) {
		query.push(["hlFirst", normalised.hlFirst ? "1" : "0"]);
	}

	if (normalised.hlRedeems !== true) {
		query.push(["hlRedeems", normalised.hlRedeems ? "1" : "0"]);
	}

	if (normalised.hlGifts !== true) {
		query.push(["hlGifts", normalised.hlGifts ? "1" : "0"]);
	}

	if (normalised.platformIndicator !== true) {
		query.push(["platformIndicator", normalised.platformIndicator ? "1" : "0"]);
	}

	if (normalised.shadow !== true) {
		query.push(["shadow", normalised.shadow ? "1" : "0"]);
	}

	if (normalised.shadowIntensity !== 0.9) {
		query.push(["shadowIntensity", String(normalised.shadowIntensity)]);
	}

	if (normalised.shadowSize !== 6) {
		query.push(["shadowSize", String(normalised.shadowSize)]);
	}

	if (normalised.shadowOffset !== 3) {
		query.push(["shadowOffset", String(normalised.shadowOffset)]);
	}

	if (normalised.cheers !== true) {
		query.push(["cheers", normalised.cheers ? "1" : "0"]);
	}

	if (normalised.collapse === true) {
		query.push(["collapse", "1"]);
	}

	if (normalised.newestTop === true) {
		query.push(["newestTop", "1"]);
	}

	if (normalised.align !== "left") {
		query.push(["align", normalised.align]);
	}

	if (normalised.msgFilter) {
		query.push(["msgFilter", encodeURIComponent(normalised.msgFilter)]);
	}

	if (normalised.botFilter) {
		query.push(["botFilter", encodeURIComponent(normalised.botFilter)]);
	}

	url.search = "?" + query.map(([key, value]) => `${key}=${value}`).join("&");

	return url;
}
function migrateLegacySerializedLink() {
	const encoded = params.get("settings");

	if (!encoded) {
		return false;
	}

	const legacySettings = decodeLegacySerializedSettings(encoded);

	if (!legacySettings) {
		return false;
	}

	const channel = (params.get("channel") || "")
		.trim()
		.toLowerCase()
		.replace(/^#/, "");

	if (!channel) {
		return false;
	}

	const url = new URL(window.location.href);

	url.search = "";

	appendFlatOverlaySettings(url, channel, legacySettings);

	console.warn(
		"This overlay link used the old serialized settings format. Redirecting it to the new readable query-parameter format.",
	);

	window.location.replace(url.toString());

	return true;
}

const legacySerializedRedirecting = migrateLegacySerializedLink();

function normalizeTwitchChannel(value) {
	const channel = String(value || "")
		.trim()
		.toLowerCase()
		.replace(/^#/, "");

	return /^[a-z0-9_]{1,25}$/.test(channel) ? channel : "";
}

const selectedChannel = normalizeTwitchChannel(params.get("channel"));

const selectedKick = cleanKickInput(params.get("kick"));

const selectedYouTube = cleanYouTubeInput(params.get("youtube"));

let backgroundEnabled = parseQueryBoolean("background", false);

let botsEnabled = parseQueryBoolean("bots", true);

let backgroundColor = (() => {
	const value = String(params.get("backgroundColor") || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(value) ? `#${value}` : "#000000";
})();

let textColor = (() => {
	const value = String(params.get("textColor") || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(value) ? `#${value}` : "#ffffff";
})();

let messageCardsEnabled = parseQueryBoolean("messageCards", false);

let messageCardColor = (() => {
	const value = String(params.get("messageCardColor") || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(value) ? `#${value}` : "#141414";
})();

let messageCardOpacity = Number(params.get("messageCardOpacity") ?? 0.72);
if (!Number.isFinite(messageCardOpacity)) messageCardOpacity = 0.72;
messageCardOpacity = Math.max(0, Math.min(messageCardOpacity, 1));

let messageCardRadius = Number(params.get("messageCardRadius") ?? 10);
if (!Number.isFinite(messageCardRadius)) messageCardRadius = 10;
messageCardRadius = Math.max(0, Math.min(messageCardRadius, 32));

let messageCardBorderWidth = Number(params.get("messageCardBorderWidth") ?? 0);
if (!Number.isFinite(messageCardBorderWidth)) messageCardBorderWidth = 0;
messageCardBorderWidth = Math.max(0, Math.min(messageCardBorderWidth, 8));

let messageCardBorderColor = (() => {
	const value = String(params.get("messageCardBorderColor") || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(value) ? `#${value}` : "#3a3a3a";
})();

let messageCardBorderStyle = params.get("messageCardBorderStyle");
if (!["solid", "dashed", "dotted"].includes(messageCardBorderStyle)) {
	messageCardBorderStyle = "solid";
}

let messageCardPadding = Number(params.get("messageCardPadding") ?? 0);
if (!Number.isFinite(messageCardPadding)) messageCardPadding = 0;
messageCardPadding = Math.max(0, Math.min(messageCardPadding, 24));

let messageSpacing = Number(params.get("messageSpacing") ?? 3);
if (!Number.isFinite(messageSpacing)) messageSpacing = 3;
messageSpacing = Math.max(0, Math.min(messageSpacing, 32));

function applyMessageCardSettings() {
	const root = document.documentElement.style;
	root.setProperty("--message-card-bg", hexToRgbaString(messageCardColor, messageCardOpacity));
	root.setProperty("--message-card-radius", `${messageCardRadius}px`);
	root.setProperty("--message-card-border-width", `${messageCardBorderWidth}px`);
	root.setProperty("--message-card-border-color", messageCardBorderColor);
	root.setProperty("--message-card-border-style", messageCardBorderStyle);
	root.setProperty("--message-card-padding", `${messageCardPadding}px`);
	root.setProperty("--message-spacing", `${messageSpacing}px`);
	document.body.classList.toggle("message-cards", messageCardsEnabled);
}

applyMessageCardSettings();

let fade;
const fadeParam = params.get("fade");

if (fadeParam === null || fadeParam === "") {
	fade = 15;
} else if (/^(?:off|false|0)$/i.test(fadeParam.trim())) {
	fade = false;
} else {
	fade = Number(fadeParam);

	if (!Number.isFinite(fade) || fade < 1) {
		fade = 15;
	}
}

let entryAnimation = params.get("entryAnimation");
if (!["classic", "from-left", "from-right", "none"].includes(entryAnimation)) {
	entryAnimation = "classic";
}

function applyEntryAnimation() {
	document.body.dataset.entryAnimation = entryAnimation;
}

applyEntryAnimation();

let badgesEnabled = parseQueryBoolean("badges", true);

let badgeTwitch = parseQueryBoolean("badgeTwitch", true);

let badgeFfz = parseQueryBoolean("badgeFfz", true);

let badgeSeventv = parseQueryBoolean("badgeSeventv", true);

let badgeChatterino = parseQueryBoolean("badgeChatterino", true);

let badgeHomies = parseQueryBoolean("badgeHomies", true);

let badgeBttv = parseQueryBoolean("badgeBttv", true);

let badgeDankchat = parseQueryBoolean("badgeDankchat", true);

let badgeMoltorino = parseQueryBoolean("badgeMoltorino", true);

let gifsEnabled = parseQueryBoolean("gifs", true);

let highlightsEnabled = parseQueryBoolean("highlights", false);

let hlFirstEnabled = parseQueryBoolean("hlFirst", true);

let hlRedeemsEnabled = parseQueryBoolean("hlRedeems", true);

let hlGiftsEnabled = parseQueryBoolean("hlGifts", true);

let platformIndicatorEnabled = parseQueryBoolean("platformIndicator", true);

let scale = Number(params.get("scale") ?? 0.5);

if (!Number.isFinite(scale)) {
	scale = 0.5;
}

scale = Math.max(0.25, Math.min(scale, 3));

let emoteScale = Number(params.get("emoteScale") ?? 1);

if (!Number.isFinite(emoteScale)) {
	emoteScale = 1;
}

emoteScale = Math.max(0.25, Math.min(emoteScale, 3));

let badgeScale = Number(params.get("badgeScale") ?? 1);
if (!Number.isFinite(badgeScale)) badgeScale = 1;
badgeScale = Math.max(0.25, Math.min(badgeScale, 2));
document.documentElement.style.setProperty("--badge-scale", String(badgeScale));

let badgeSpacing = Number(params.get("badgeSpacing") ?? 3);
if (!Number.isFinite(badgeSpacing)) badgeSpacing = 3;
badgeSpacing = Math.max(0, Math.min(badgeSpacing, 30));
document.documentElement.style.setProperty("--badge-spacing", `${badgeSpacing}px`);

let shadowEnabled = parseQueryBoolean("shadow", true);

let shadowIntensity = Number(params.get("shadowIntensity") ?? 0.9);

if (!Number.isFinite(shadowIntensity)) {
	shadowIntensity = 0.9;
}

shadowIntensity = Math.max(0, Math.min(shadowIntensity, 1));

let shadowSize = Number(params.get("shadowSize") ?? 6);

if (!Number.isFinite(shadowSize)) {
	shadowSize = 6;
}

shadowSize = Math.max(0, Math.min(shadowSize, 40));

let shadowOffset = Number(params.get("shadowOffset") ?? 3);

if (!Number.isFinite(shadowOffset)) {
	shadowOffset = 3;
}

shadowOffset = Math.max(0, Math.min(shadowOffset, 20));

function applyShadowSettings() {
	document.documentElement.style.setProperty(
		"--shadow-blur",
		`${shadowSize}px`,
	);

	document.documentElement.style.setProperty(
		"--shadow-offset-x",
		`${shadowOffset}px`,
	);

	document.documentElement.style.setProperty(
		"--shadow-offset-y",
		`${shadowOffset}px`,
	);

	document.documentElement.style.setProperty(
		"--shadow-color",
		`rgba(0, 0, 0, ${shadowIntensity})`,
	);

	document.body.classList.toggle("shadow-disabled", !shadowEnabled);
}

applyShadowSettings();

document.documentElement.style.setProperty("--chat-scale", scale);

document.documentElement.style.setProperty("--emote-scale", emoteScale);

function hexToRgbaString(hex, alpha) {
	let h = hex.replace("#", "");

	if (h.length === 3) {
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	}

	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyBackgroundColor(hex) {
	document.documentElement.style.setProperty(
		"--bg-color-1",
		hexToRgbaString(hex, 0.9),
	);

	document.documentElement.style.setProperty(
		"--bg-color-2",
		hexToRgbaString(hex, 0.75),
	);
}

applyBackgroundColor(backgroundColor);

function applyTextColor(hex) {
	document.documentElement.style.setProperty(
		"--text-color",
		hexToRgbaString(hex, 1),
	);
}

applyTextColor(textColor);

const CHAT_FONTS = [
	{ label: "Open Sans", value: "'Open Sans', sans-serif" },
	{ label: "Arial", value: "Arial, sans-serif" },
	{ label: "Comic Sans MS", value: "'Comic Sans MS', sans-serif" },
	{ label: "Roboto", value: "'Roboto', sans-serif" },
	{ label: "Montserrat", value: "'Montserrat', sans-serif" },
	{ label: "Minecraft", value: "'Minecraft', sans-serif" },
	{ label: "Custom (Google Font)", value: "custom" },
];

const GOOGLE_FONT_FAMILIES = {
	"'Open Sans', sans-serif": "Open+Sans:wght@400;600;700;800;900",
	"'Roboto', sans-serif": "Roboto:wght@400;700;900",
	"'Montserrat', sans-serif": "Montserrat:wght@400;700;900",
	"'Bangers', cursive": "Bangers",
};

const loadedGoogleFonts = new Set();

function loadGoogleFontIfNeeded(fontValue) {
	const family = GOOGLE_FONT_FAMILIES[fontValue];

	if (!family || loadedGoogleFonts.has(family)) {
		return;
	}

	loadedGoogleFonts.add(family);

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
	document.head.appendChild(link);
}

const CUSTOM_FONT_FACES = {
	"'Comic Sans MS', sans-serif": {
		family: "Comic Sans MS",
		url: "./fonts/COMIC.TTF",
	},
	"'Minecraft', sans-serif": {
		family: "Minecraft",
		url: "./fonts/Minecraft.ttf",
	},
};

const loadedCustomFonts = new Set();

function loadCustomFontIfNeeded(fontValue) {
	const fontFace = CUSTOM_FONT_FACES[fontValue];

	if (!fontFace || loadedCustomFonts.has(fontFace.family)) {
		return;
	}

	loadedCustomFonts.add(fontFace.family);

	const style = document.createElement("style");

	style.textContent = `
		@font-face {
			font-family: "${fontFace.family}";
			src: url("${fontFace.url}") format("truetype");
			font-display: swap;
		}
	`;

	document.head.appendChild(style);
}

let chatFont = fontQueryKeyToValue(params.get("font"));

function sanitizeFontName(name) {
	return String(name || "")
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

let customFontName = sanitizeFontName(params.get("customFont"));

function resolveChatFont() {
	if (chatFont === "custom") {
		return customFontName
			? `'${customFontName}', sans-serif`
			: "'Open Sans', sans-serif";
	}

	return chatFont;
}

function loadCustomGoogleFont(name) {
	const key = `custom:${name}`;

	if (!name || loadedGoogleFonts.has(key)) {
		return;
	}

	loadedGoogleFonts.add(key);

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, "+")}&display=swap`;
	document.head.appendChild(link);
}

function applyChatFont() {
	const resolved = resolveChatFont();

	document.documentElement.style.setProperty("--chat-font", resolved);

	if (chatFont === "custom") {
		loadCustomGoogleFont(customFontName);
	} else {
		loadGoogleFontIfNeeded(resolved);
		loadCustomFontIfNeeded(resolved);
	}

	document.body.classList.toggle(
		"pixel-font",
		resolved === "'Minecraft', sans-serif",
	);
}

applyChatFont();

let usernameFontMode = cleanFontMode(params.get("usernameFont"));
let messageFontMode = cleanFontMode(params.get("messageFont"));
let usernameFontName = sanitizeFontName(params.get("usernameFontName"));
let messageFontName = sanitizeFontName(params.get("messageFontName"));

let usernameFontSize = Number(params.get("usernameSize") ?? 50);
if (!Number.isFinite(usernameFontSize)) usernameFontSize = 50;
usernameFontSize = Math.max(8, Math.min(usernameFontSize, 100));

let messageFontSize = Number(params.get("messageSize") ?? 50);
if (!Number.isFinite(messageFontSize)) messageFontSize = 50;
messageFontSize = Math.max(8, Math.min(messageFontSize, 100));

let roleTypographyEnabled = parseQueryBoolean(
	"separateTypography",
	usernameFontMode !== "chat" ||
		messageFontMode !== "chat" ||
		usernameFontSize !== 50 ||
		messageFontSize !== 50,
);

function resolveRoleFont(mode, customName) {
	if (mode === "chat") return "var(--chat-font)";
	if (mode === "custom") {
		return customName ? `'${customName}', sans-serif` : "var(--chat-font)";
	}
	return fontQueryKeyToValue(mode);
}

function loadRoleFont(mode, customName) {
	if (mode === "chat") return;
	if (mode === "custom") {
		loadCustomGoogleFont(customName);
		return;
	}
	const value = fontQueryKeyToValue(mode);
	loadGoogleFontIfNeeded(value);
	loadCustomFontIfNeeded(value);
}

function applyRoleTypography() {
	const root = document.documentElement.style;
	const usernameFont = roleTypographyEnabled
		? resolveRoleFont(usernameFontMode, usernameFontName)
		: "var(--chat-font)";
	const messageFont = roleTypographyEnabled
		? resolveRoleFont(messageFontMode, messageFontName)
		: "var(--chat-font)";
	root.setProperty("--username-font", usernameFont);
	root.setProperty("--message-font", messageFont);
	root.setProperty(
		"--username-font-size",
		`${roleTypographyEnabled ? usernameFontSize : 50}px`,
	);
	root.setProperty(
		"--message-font-size",
		`${roleTypographyEnabled ? messageFontSize : 50}px`,
	);
	const activeMessageFont =
		!roleTypographyEnabled ||
		messageFontMode === "chat" ||
		(messageFontMode === "custom" && !messageFontName)
			? resolveChatFont()
			: messageFont;
	const activeUsernameFont =
		!roleTypographyEnabled ||
		usernameFontMode === "chat" ||
		(usernameFontMode === "custom" && !usernameFontName)
			? resolveChatFont()
			: usernameFont;
	document.body.classList.toggle(
		"pixel-font",
		activeMessageFont === "'Minecraft', sans-serif",
	);
	document.body.classList.toggle(
		"pixel-username-font",
		activeUsernameFont === "'Minecraft', sans-serif",
	);
	if (roleTypographyEnabled) {
		loadRoleFont(usernameFontMode, usernameFontName);
		loadRoleFont(messageFontMode, messageFontName);
	}
}

applyRoleTypography();

let boldEnabled = parseQueryBoolean("bold", true);

let uppercaseEnabled = parseQueryBoolean("uppercase", false);

let gifScale = Number(params.get("gifScale") ?? 1);

if (!Number.isFinite(gifScale)) {
	gifScale = 1;
}

gifScale = Math.max(0.25, Math.min(gifScale, 3));

let strokeWidth = Number(params.get("strokeWidth") ?? 0);

if (!Number.isFinite(strokeWidth)) {
	strokeWidth = 0;
}

strokeWidth = Math.max(0, Math.min(strokeWidth, 20));

let strokeColor = (() => {
	const value = String(params.get("strokeColor") || "")
		.trim()
		.replace(/^#/, "");

	return /^[0-9a-fA-F]{6}$/.test(value) ? `#${value}` : "#000000";
})();

function buildStrokeShadow(width, color) {
	if (!(width > 0)) {
		return "0 0 0 transparent";
	}

	const shadows = [];
	const outerSteps = Math.min(72, Math.max(16, Math.ceil(width * 6)));

	for (let i = 0; i < outerSteps; i++) {
		const angle = (i / outerSteps) * Math.PI * 2;
		const x = (Math.cos(angle) * width).toFixed(2);
		const y = (Math.sin(angle) * width).toFixed(2);
		shadows.push(`${x}px ${y}px 0 ${color}`);
	}

	if (width > 2) {
		const innerSteps = Math.min(36, Math.max(8, Math.ceil(width * 3)));
		const innerRadius = width / 2;

		for (let i = 0; i < innerSteps; i++) {
			const angle = (i / innerSteps) * Math.PI * 2;
			const x = (Math.cos(angle) * innerRadius).toFixed(2);
			const y = (Math.sin(angle) * innerRadius).toFixed(2);
			shadows.push(`${x}px ${y}px 0 ${color}`);
		}
	}

	return shadows.join(", ");
}

function applyTextStyleSettings() {
	const root = document.documentElement.style;

	root.setProperty("--chat-weight", boldEnabled ? "900" : "400");
	root.setProperty("--gif-scale", String(gifScale));
	root.setProperty(
		"--stroke-shadow",
		buildStrokeShadow(strokeWidth, strokeColor),
	);

	document.body.classList.toggle("uppercase", uppercaseEnabled);
}

applyTextStyleSettings();

loadGoogleFontIfNeeded(chatFont);
loadCustomFontIfNeeded(chatFont);

let wrapEnabled = parseQueryBoolean("wrap", false);

let wrapAfterColonEnabled = parseQueryBoolean("wrapAfterColon", false);

if (wrapAfterColonEnabled) {
	wrapEnabled = false;
}

let showUnlisted7TV = parseQueryBoolean("unlisted", true);

let cheersEnabled = parseQueryBoolean("cheers", true);

let collapseEnabled = parseQueryBoolean("collapse", false);

let newestTopEnabled = parseQueryBoolean("newestTop", false);

let alignMode = cleanAlign(params.get("align"));

let messageFilters = parseQueryList(params.get("msgFilter"));

let botFilterUsers = parseQueryList(params.get("botFilter"), { stripAt: true });

function ensureLayoutStyle() {
	if (document.getElementById("layout-style")) {
		return;
	}

	const style = document.createElement("style");

	style.id = "layout-style";

	style.textContent = `
		body.newest-top #chat {
			justify-content: flex-start !important;
		}

		body.align-center #chat > .message:not(.has-highlight):not(.hl-card) {
			align-self: center;
			text-align: center;
		}

		body.align-right #chat > .message:not(.has-highlight):not(.hl-card) {
			align-self: flex-end;
			text-align: right;
		}

		/* Wrapped lines must follow the alignment too, not just the first line. */
		body.align-center #chat > .message,
		body.align-center #chat > .message .text {
			text-align: center !important;
		}

		body.align-right #chat > .message,
		body.align-right #chat > .message .text {
			text-align: right !important;
		}

		body.align-center #chat > .message.wrap-message:not(.hl-card) {
			justify-content: center !important;
		}

		body.align-right #chat > .message.wrap-message:not(.hl-card) {
			justify-content: flex-end !important;
		}

		body.align-center #chat > .message.wrap-message .text,
		body.align-right #chat > .message.wrap-message .text {
			flex: 0 1 auto;
		}

		/* In wrap mode the text is a fit-content block that sits at the left
		   edge of the message box; auto margins move the box itself. */
		body.align-center #chat > .message.wrap-message > .text {
			margin-left: auto !important;
			margin-right: auto !important;
		}

		body.align-right #chat > .message.wrap-message > .text {
			margin-left: auto !important;
			margin-right: 0 !important;
		}

		/* The text span lays its emotes out as flex items, so text-align alone
		   does nothing there; justify each line explicitly. */
		body.align-center #chat > .message .text {
			justify-content: center !important;
		}

		body.align-right #chat > .message .text {
			justify-content: flex-end !important;
		}

		/* Block-level GIFs need auto margins to move inside the message box. */
		body.align-center #chat > .message .twitch-gif {
			margin-left: auto !important;
			margin-right: auto !important;
			object-position: center center !important;
		}

		body.align-right #chat > .message .twitch-gif {
			margin-left: auto !important;
			margin-right: 0 !important;
			object-position: right center !important;
		}

		/* Highlights stay full-width; only their contents get aligned. */
		body.align-center #chat > .message.has-highlight,
		body.align-center #chat > .message.hl-card {
			text-align: center;
			justify-content: center;
		}

		body.align-right #chat > .message.has-highlight,
		body.align-right #chat > .message.hl-card {
			text-align: right;
			justify-content: flex-end;
		}

		body.align-center #chat > .message.hl-card .hl-gift-part {
			justify-content: center;
		}

		body.align-right #chat > .message.hl-card .hl-gift-part {
			justify-content: flex-end;
		}

		body.align-center #chat > .message.hl-card .hl-gift-text {
			text-align: center;
		}

		body.align-right #chat > .message.hl-card .hl-gift-text {
			text-align: right;
		}

		.msg-count {
			display: inline-block;
			margin-left: 0.5em;
			font-size: 1.2em;
			font-weight: 900;
			color: var(--text-color, #fff);
			opacity: 0.75;
			vertical-align: middle;
		}

		@keyframes msgCountPop {
			0% { transform: scale(1.7); }
			100% { transform: scale(1); }
		}

		.msg-count-pop {
			animation: msgCountPop 0.25s ease-out;
		}

		.cheer {
			display: inline-flex;
			align-items: center;
			gap: 2px;
			vertical-align: middle;
		}

		.cheer-amount {
			font-weight: 900;
			margin-right: 6px;
		}
	`;

	(document.head || document.documentElement).appendChild(style);
}

function applyLayoutSettings() {
	ensureLayoutStyle();

	document.body.classList.toggle("newest-top", newestTopEnabled);
	document.body.classList.toggle("align-center", alignMode === "center");
	document.body.classList.toggle("align-right", alignMode === "right");
	document.body.classList.toggle("wrap-after-colon", wrapAfterColonEnabled);
}

applyLayoutSettings();