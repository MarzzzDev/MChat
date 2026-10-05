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

  result.fade = settings.fade === false ? false : Number(settings.fade ?? 15);

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

  result.wrap = settings.wrap === true;

  result.unlisted = settings.unlisted !== false;

  result.font =
    typeof settings.font === "string" && settings.font.trim()
      ? settings.font
      : "'Open Sans', sans-serif";

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

  return result;
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

function appendFlatOverlaySettings(url, channel, settings) {
  const normalised = normaliseOverlaySettings(settings);

  const query = [
    ["channel", String(channel).trim().toLowerCase().replace(/^#/, "")],
  ];

  if (normalised.scale !== 0.5) {
    query.push(["scale", String(normalised.scale)]);
  }

  if (normalised.emoteScale !== 1) {
    query.push(["emoteScale", String(normalised.emoteScale)]);
  }

  const fontKey = fontValueToQueryKey(normalised.font);

  if (fontKey !== "opensans") {
    query.push(["font", fontKey]);
  }

  if (fontKey === "custom" && normalised.customFont) {
    query.push(["customFont", encodeURIComponent(normalised.customFont)]);
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

  if (normalised.fade !== 15) {
    query.push([
      "fade",
      normalised.fade === false ? "off" : String(normalised.fade),
    ]);
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

const selectedChannel = (params.get("channel") || "")
  .trim()
  .toLowerCase()
  .replace(/^#/, "");

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

document.body.classList.toggle(
  "pixel-font",
  chatFont === "'Minecraft', sans-serif",
);

let wrapEnabled = parseQueryBoolean("wrap", false);

let showUnlisted7TV = parseQueryBoolean("unlisted", true);
