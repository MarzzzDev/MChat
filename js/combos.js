const COMBO_STORAGE_KEY = "mchat-combo-settings";

const COMBO_PREVIEW_EMOTE = {
	key: "twitch:25",
	name: "Kappa",
	url: "https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0",
};

const COMBO_FONT_OPTIONS = [
	["Open Sans", "Open Sans"],
	["Arial", "Arial"],
	["Comic Sans MS", "Comic Sans MS"],
	["Roboto", "Roboto"],
	["Montserrat", "Montserrat"],
	["Minecraft", "Minecraft"],
	["custom", "Custom (Google Font)"],
];

const COMBO_GOOGLE_FONTS = {
	"Open Sans": "Open+Sans:wght@400;600;700;800;900",
	Roboto: "Roboto:wght@400;700;900",
	Montserrat: "Montserrat:wght@400;700;900",
};

const COMBO_LOCAL_FONTS = {
	"Comic Sans MS": { local: "Comic Sans MS", url: "./fonts/COMIC.TTF" },
	Minecraft: { local: null, url: "./fonts/Minecraft.ttf" },
};

const COMBO_DEFAULTS = {
	channel: "",
	minCombo: 2,
	timeout: 6,
	breakOnOther: true,
	font: "Comic Sans MS",
	customFont: "",
	prefix: "x",
	showWord: true,
	word: "COMBO",
	textColor: "#ffffff",
	strokeColor: "#000000",
	strokeWidth: 4,
	shadow: true,
	emoteScale: 1,
	textScale: 1,
	grow: 1,
	position: "bottom-left",
	layout: "row",
	animation: "pop",
	cardColor: "#000000",
	cardOpacity: 0,
};

const COMBO_SOUND_UPLOAD_URL = "https://media.marz.lol/upload.php";
const COMBO_SOUND_MAX_BYTES = 5 * 1024 * 1024;
const COMBO_SOUND_DEFAULT_COUNT = 3;
const COMBO_SOUND_MAX_RULES = 1000;

const comboPercent = (value) => `${Math.round(Number(value) * 100)}%`;

const COMBO_TABS = [
	{
		id: "channel",
		title: "Channel",
		desc: "Whose chat to watch and when a combo starts and ends.",
		fields: [
			{ key: "channel", type: "channel" },
			{ section: "Timing" },
			{ key: "minCombo", label: "Show combo from", type: "range", min: 2, max: 20, step: 1, fmt: (v) => `x${v}` },
			{ key: "timeout", label: "Combo timeout", type: "range", min: 1, max: 30, step: 0.5, fmt: (v) => `${v}s` },
			{
				key: "breakOnOther",
				label: "Other messages break it",
				type: "bool",
				note: "Off means only the timeout ends a combo.",
			},
		],
	},
	{
		id: "text",
		title: "Text",
		desc: "Font, wording, colors and outline for the combo counter.",
		fields: [
			{ section: "Font" },
			{ key: "font", label: "Font", type: "font" },
			{ section: "Wording" },
			{ key: "prefix", label: "Count prefix", type: "text", max: 4 },
			{ key: "showWord", label: "Show combo word", type: "bool", note: "Small label under the count." },
			{ key: "word", label: "Combo word", type: "text", max: 24 },
			{ section: "Colors" },
			{ key: "textColor", label: "Text color", type: "color" },
			{ key: "strokeColor", label: "Outline color", type: "color" },
			{ key: "strokeWidth", label: "Outline width", type: "range", min: 0, max: 12, step: 0.5, fmt: (v) => `${v}px` },
			{ key: "shadow", label: "Drop shadow", type: "bool", note: "Soft shadow behind everything." },
		],
	},
	{
		id: "size",
		title: "Size",
		desc: "How big the emote and counter are, and how they grow.",
		fields: [
			{ key: "emoteScale", label: "Emote size", type: "range", min: 0.25, max: 4, step: 0.05, fmt: comboPercent },
			{ key: "textScale", label: "Text size", type: "range", min: 0.25, max: 4, step: 0.05, fmt: comboPercent },
			{ key: "grow", label: "Grow with combo", type: "range", min: 0, max: 3, step: 0.05, fmt: comboPercent },
		],
	},
	{
		id: "layout",
		title: "Layout",
		desc: "Where the combo sits, how it is arranged and animated.",
		fields: [
			{
				key: "position",
				label: "Position",
				type: "select",
				options: [
					["top-left", "Top left"],
					["top-center", "Top center"],
					["top-right", "Top right"],
					["center-left", "Middle left"],
					["center", "Center"],
					["center-right", "Middle right"],
					["bottom-left", "Bottom left"],
					["bottom-center", "Bottom center"],
					["bottom-right", "Bottom right"],
				],
			},
			{
				key: "layout",
				label: "Arrangement",
				type: "select",
				options: [
					["row", "Default (combo text under number)"],
					["inline", "Inline (combo text next to number)"],
				],
			},
			{
				key: "animation",
				label: "Count animation",
				type: "select",
				options: [
					["pop", "Pop"],
					["bounce", "Bounce"],
					["shake", "Shake"],
					["none", "None"],
				],
			},
			{ section: "Background card" },
			{ key: "cardColor", label: "Card color", type: "color" },
			{ key: "cardOpacity", label: "Card opacity", type: "range", min: 0, max: 1, step: 0.01, fmt: comboPercent },
		],
	},
	{
		id: "sounds",
		title: "Emote Combo Sounds",
		desc: "Play a sound when an exact emote name is repeated in chat.",
		fields: [
			{ type: "sounds" },
		],
	},
];

function sanitizeComboFont(name) {
	return String(name || "")
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function normalizeComboFont(settings) {
	const known = COMBO_FONT_OPTIONS.some(([value]) => value === settings.font);

	if (!known) {
		settings.customFont = sanitizeComboFont(settings.font) || settings.customFont;
		settings.font = settings.customFont ? "custom" : COMBO_DEFAULTS.font;
	}

	settings.customFont = sanitizeComboFont(settings.customFont);

	return settings;
}

function resolveComboFontName(settings) {
	if (settings.font === "custom") {
		return settings.customFont || COMBO_DEFAULTS.font;
	}

	return settings.font;
}

function newComboSoundId() {
	return Math.random().toString(36).slice(2, 10);
}

function normalizeComboSound(raw) {
	return {
		id: String(raw?.id || newComboSoundId()),
		name: String(raw?.name || "").trim().slice(0, 300),
		url: String(raw?.url || "").trim().slice(0, 2000),
		count: Math.max(
			1,
			Math.min(99, Math.floor(Number(raw?.count)) || COMBO_SOUND_DEFAULT_COUNT),
		),
	};
}

function normalizeComboSounds(list) {
	return (Array.isArray(list) ? list : [])
		.slice(0, COMBO_SOUND_MAX_RULES)
		.map(normalizeComboSound);
}

function encodeComboSounds(list) {
	return JSON.stringify(
		list
			.filter((rule) => rule.name && rule.url)
			.map((rule) => [rule.name, rule.url, rule.count]),
	);
}

function decodeComboSounds(raw) {
	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);

		return normalizeComboSounds(
			(Array.isArray(parsed) ? parsed : []).map((row) => ({
				name: row?.[0],
				url: row?.[1],
				count: row?.[2],
			})),
		);
	} catch {
		return [];
	}
}

function compileComboSound(rule) {
	if (!rule.name || !rule.url) {
		return null;
	}

	const name = rule.name;

	return (emoteName) => emoteName === name;
}

async function uploadComboSound(file) {
	if (!COMBO_SOUND_UPLOAD_URL || COMBO_SOUND_UPLOAD_URL.includes("yourdomain.com")) {
		throw new Error("Set COMBO_SOUND_UPLOAD_URL at the top of combos.js first.");
	}

	if (file.size > COMBO_SOUND_MAX_BYTES) {
		throw new Error("File is larger than 5 MB.");
	}

	const form = new FormData();

	form.append("file", file);

	const response = await fetch(COMBO_SOUND_UPLOAD_URL, {
		method: "POST",
		body: form,
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok || !data.url) {
		throw new Error(data.error || `Upload failed (${response.status}).`);
	}

	return String(data.url);
}

function playComboSound(rule) {
	try {
		const audio = new Audio(rule.url);

		audio.volume = 1;

		audio.play().catch((error) => console.warn("Combo sound blocked:", error));
	} catch (error) {
		console.warn("Combo sound error:", error);
	}
}

function createComboSoundEngine(getSettings) {
	let signature = "";
	let compiled = [];
	const streaks = new Map();
	const preloaded = new Set();

	function rules(settings, preload) {
		const sig = encodeComboSounds(settings.sounds || []);

		if (sig !== signature) {
			signature = sig;
			compiled = [];
			streaks.clear();

			for (const rule of settings.sounds || []) {
				const test = compileComboSound(rule);

				if (test) {
					compiled.push({ rule, test });
				}
			}
		}

		if (preload) {
			for (const { rule } of compiled) {
				if (!preloaded.has(rule.url)) {
					preloaded.add(rule.url);

					const audio = new Audio();

					audio.preload = "auto";
					audio.src = rule.url;
				}
			}
		}

		return compiled;
	}

	return {
		preload() {
			rules(getSettings(), true);
		},

		handle(emotes) {
			const settings = getSettings();

			if (!settings.sounds?.length) {
				return;
			}

			const names = (Array.isArray(emotes) ? emotes : [])
				.map((emote) => emote?.name)
				.filter(Boolean);

			if (!names.length) {
				for (const { rule } of rules(settings, true)) {
					if (settings.breakOnOther) {
						streaks.delete(rule.id);
					}
				}

				return;
			}

			const now = Date.now();

			for (const { rule, test } of rules(settings, true)) {
				const streak = streaks.get(rule.id);

				if (!names.some(test)) {
					if (streak && settings.breakOnOther) {
						streaks.delete(rule.id);
					}

					continue;
				}

				const alive =
					streak && now - streak.last <= settings.timeout * 1000;

				const current = alive ? streak : { count: 0, last: now };
				const before = current.count;

				current.count += 1;
				current.last = now;
				streaks.set(rule.id, current);

				if (current.count > before && current.count % rule.count === 0) {
					playComboSound(rule);
				}
			}
		},

		reset() {
			streaks.clear();
		},
	};
}

const COMBO_SOUND_CSS = `
.cb-snd-form { display:flex; flex-direction:column; gap:4px; margin-bottom:2px; }
.cb-snd-form .mc-field { margin:0; gap:2px; }
.cb-snd-form .mc-label { margin:0 0 2px; font-size:12px; }
.cb-snd-form .mc-input { padding-top:6px; padding-bottom:6px; min-height:0; }
.cb-snd-form .mc-button { padding-top:7px; padding-bottom:7px; margin-top:2px; }
.cb-snd-file { display:flex; align-items:center; gap:8px; }
.cb-snd-file .mc-button { padding:5px 12px; margin:0; }
.cb-snd-file-name { font-size:12px; opacity:.75; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cb-snd-status { font-size:12px; min-height:14px; margin:2px 0 0; }
.cb-snd-status.is-error { color:#ff6b6b; }
.cb-snd-list { display:flex; flex-direction:column; gap:4px; margin-top:4px; }
.cb-snd-row { display:flex; align-items:center; gap:8px; padding:5px 10px; border:1px solid rgba(255,255,255,.1); border-radius:8px; }
.cb-snd-row-name { font-weight:700; flex:0 1 auto; max-width:35%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cb-snd-row-count { opacity:.75; font-size:12px; }
.cb-snd-row-file { flex:1 1 auto; min-width:0; opacity:.55; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cb-snd-row button { cursor:pointer; }
`;

function ensureComboSoundStyle() {
	if (document.getElementById("combo-sound-style")) {
		return;
	}

	const style = document.createElement("style");

	style.id = "combo-sound-style";
	style.textContent = COMBO_SOUND_CSS;
	document.head.appendChild(style);
}

function comboCoerce(fallback, raw) {
	if (typeof fallback === "boolean") {
		return raw === "1" || raw === "true";
	}

	if (typeof fallback === "number") {
		const value = Number(raw);
		return Number.isFinite(value) ? value : fallback;
	}

	return String(raw);
}

function cleanComboChannel(value) {
	let text = String(value || "").trim().toLowerCase();
	const urlMatch = text.match(/twitch\.tv\/([a-z0-9_]+)/);

	if (urlMatch) {
		text = urlMatch[1];
	}

	return text.replace(/^@/, "").replace(/[^a-z0-9_]/g, "");
}

function readComboParams(searchParams) {
	const result = { ...COMBO_DEFAULTS };

	for (const key of Object.keys(COMBO_DEFAULTS)) {
		const raw = searchParams.get(`cb_${key}`);

		if (raw !== null) {
			result[key] = comboCoerce(COMBO_DEFAULTS[key], raw);
		}
	}

	result.channel = cleanComboChannel(result.channel);
	result.sounds = decodeComboSounds(searchParams.get("cb_sounds"));

	return normalizeComboFont(result);
}

function loadStoredComboSettings() {
	try {
		const saved = JSON.parse(localStorage.getItem(COMBO_STORAGE_KEY) || "{}");
		const result = { ...COMBO_DEFAULTS };

		for (const key of Object.keys(COMBO_DEFAULTS)) {
			if (key in saved && typeof saved[key] === typeof COMBO_DEFAULTS[key]) {
				result[key] = saved[key];
			}
		}

		result.sounds = normalizeComboSounds(saved.sounds);

		return normalizeComboFont(result);
	} catch {
		return { ...COMBO_DEFAULTS, sounds: [] };
	}
}

function saveStoredComboSettings(settings) {
	try {
		localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify(settings));
	} catch {}
}

function buildComboUrl(settings) {
	const url = new URL(window.location.href);

	url.search = "";
	url.hash = "";
	url.searchParams.set("combo", "1");

	for (const key of Object.keys(COMBO_DEFAULTS)) {
		const value = settings[key];

		if (key !== "channel" && value === COMBO_DEFAULTS[key]) {
			continue;
		}

		url.searchParams.set(
			`cb_${key}`,
			typeof value === "boolean" ? (value ? "1" : "0") : String(value),
		);
	}

	const sounds = encodeComboSounds(settings.sounds || []);

	if (sounds !== "[]") {
		url.searchParams.set("cb_sounds", sounds);
	}

	return url.toString();
}

const comboLoadedFonts = new Set();

function loadComboFont(name, custom = false) {
	const family = String(name || "").trim();

	if (!family || comboLoadedFonts.has(family)) {
		return;
	}

	const local = COMBO_LOCAL_FONTS[family];

	if (local) {
		comboLoadedFonts.add(family);

		const style = document.createElement("style");

		style.textContent = `@font-face{font-family:"${family}";src:${
			local.local ? `local("${local.local}"),` : ""
		}url("${local.url}") format("truetype");font-display:swap;}`;

		document.head.appendChild(style);

		return;
	}

	const query =
		COMBO_GOOGLE_FONTS[family] ||
		(custom
			? `${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;700;900`
			: null);

	if (!query) {
		return;
	}

	comboLoadedFonts.add(family);

	const link = document.createElement("link");

	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;

	document.head.appendChild(link);
}

function comboHexToRgb(hex) {
	let text = String(hex || "#000000").replace("#", "");

	if (text.length === 3) {
		text = text
			.split("")
			.map((char) => char + char)
			.join("");
	}

	if (!/^[0-9a-fA-F]{6}$/.test(text)) {
		text = "000000";
	}

	return [
		parseInt(text.slice(0, 2), 16),
		parseInt(text.slice(2, 4), 16),
		parseInt(text.slice(4, 6), 16),
	].join(",");
}

const COMBO_WIDGET_CSS = `
.cb-root {
	position: absolute;
	inset: 0;
	display: flex;
	padding: 24px;
	overflow: hidden;
	pointer-events: none;
	box-sizing: border-box;
	font-family: var(--cb-font);
}

.cb-root[data-pos="top-left"] { justify-content: flex-start; align-items: flex-start; }
.cb-root[data-pos="top-center"] { justify-content: center; align-items: flex-start; }
.cb-root[data-pos="top-right"] { justify-content: flex-end; align-items: flex-start; }
.cb-root[data-pos="center-left"] { justify-content: flex-start; align-items: center; }
.cb-root[data-pos="center"] { justify-content: center; align-items: center; }
.cb-root[data-pos="center-right"] { justify-content: flex-end; align-items: center; }
.cb-root[data-pos="bottom-left"] { justify-content: flex-start; align-items: flex-end; }
.cb-root[data-pos="bottom-center"] { justify-content: center; align-items: flex-end; }
.cb-root[data-pos="bottom-right"] { justify-content: flex-end; align-items: flex-end; }

.cb-card {
	display: none;
	align-items: center;
	gap: calc(var(--cb-gap) * 1px);
	padding: calc(var(--cb-card-padding) * 1px);
	border-radius: calc(var(--cb-card-radius) * 1px);
	background: rgba(var(--cb-card-rgb), var(--cb-card-opacity));
	filter: var(--cb-shadow);
	transform-origin: center center;
}

.cb-card.is-on {
	display: inline-flex;
}

.cb-card[data-layout="row"] { flex-direction: row; }
.cb-card[data-layout="row-reverse"] { flex-direction: row-reverse; }
.cb-card[data-layout="column"] { flex-direction: column; }
.cb-card[data-layout="column-reverse"] { flex-direction: column-reverse; }

.cb-emote {
	display: block;
	height: calc(72px * var(--cb-emote-scale) * var(--cb-grow));
	width: auto;
	max-width: none;
	object-fit: contain;
	flex: 0 0 auto;
}

.cb-text {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	line-height: 1;
	font-weight: var(--cb-weight);
	white-space: nowrap;
}

.cb-card[data-layout^="column"] .cb-text {
	align-items: center;
}

.cb-count {
	font-size: calc(60px * var(--cb-text-scale) * var(--cb-grow));
	color: var(--cb-text-color);
	-webkit-text-stroke: calc(var(--cb-stroke) * 2px) var(--cb-stroke-color);
	paint-order: stroke fill;
	line-height: 1.05;
}

.cb-word {
	display: none;
	font-size: calc(60px * var(--cb-text-scale) * var(--cb-word-scale));
	color: var(--cb-text-color);
	-webkit-text-stroke: calc(var(--cb-stroke) * 2px) var(--cb-stroke-color);
	paint-order: stroke fill;
	letter-spacing: 0.06em;
	line-height: 1.1;
}

.cb-card[data-word="after"] .cb-text,
.cb-card[data-word="after"][data-layout^="column"] .cb-text {
	flex-direction: row;
	align-items: center;
	gap: 0.28em;
	font-size: calc(72px * var(--cb-text-scale) * var(--cb-grow));
}

.cb-card[data-word="after"] .cb-count,
.cb-card[data-word="after"] .cb-word {
	font-size: inherit;
	line-height: 1;
	margin: 0;
	letter-spacing: 0;
}

.cb-card.has-word .cb-word {
	display: block;
}

.cb-card.a-in { animation: cbIn 0.3s ease-out; }
.cb-card.a-out { animation: cbOut 0.35s ease-in forwards; }
.cb-card.a-pop { animation: cbPop 0.28s ease-out; }
.cb-card.a-bounce { animation: cbBounce 0.34s ease-out; }
.cb-card.a-shake { animation: cbShake 0.3s linear; }

@keyframes cbIn {
	from { opacity: 0; transform: scale(0.6); }
	to { opacity: 1; transform: scale(1); }
}

@keyframes cbOut {
	from { opacity: 1; transform: scale(1); }
	to { opacity: 0; transform: scale(0.7); }
}

@keyframes cbPop {
	0% { transform: scale(1); }
	40% { transform: scale(1.22); }
	100% { transform: scale(1); }
}

@keyframes cbBounce {
	0% { transform: translateY(0); }
	35% { transform: translateY(-22px); }
	65% { transform: translateY(4px); }
	100% { transform: translateY(0); }
}

@keyframes cbShake {
	0%, 100% { transform: translateX(0) rotate(0deg); }
	20% { transform: translateX(-8px) rotate(-3deg); }
	40% { transform: translateX(8px) rotate(3deg); }
	60% { transform: translateX(-6px) rotate(-2deg); }
	80% { transform: translateX(6px) rotate(2deg); }
}
`;

function ensureComboWidgetStyle() {
	if (document.getElementById("combo-widget-style")) {
		return;
	}

	const style = document.createElement("style");

	style.id = "combo-widget-style";
	style.textContent = COMBO_WIDGET_CSS;

	document.head.appendChild(style);
}

function createComboWidget(host, getSettings) {
	ensureComboWidgetStyle();

	const root = document.createElement("div");
	root.className = "cb-root";

	const card = document.createElement("div");
	card.className = "cb-card";

	const emoteImg = document.createElement("img");
	emoteImg.className = "cb-emote";
	emoteImg.draggable = false;
	emoteImg.alt = "";

	const text = document.createElement("div");
	text.className = "cb-text";

	const count = document.createElement("div");
	count.className = "cb-count";

	const word = document.createElement("div");
	word.className = "cb-word";

	text.appendChild(count);
	text.appendChild(word);
	card.appendChild(emoteImg);
	card.appendChild(text);
	root.appendChild(card);
	host.appendChild(root);

	let current = null;
	let timer = null;
	let leaveTimer = null;
	let visible = false;

	function applyVars(grow) {
		const s = getSettings();
		const font = resolveComboFontName(s);

		loadComboFont(font, s.font === "custom");

		const comic = font === "Comic Sans MS";

		if (comic) {
			loadComboFont("Comic Neue", true);
		}

		const set = (key, value) => root.style.setProperty(key, String(value));

		set(
			"--cb-font",
			comic
				? "'Comic Sans MS', 'Comic Sans', 'Comic Neue', cursive"
				: `'${font}', 'Comic Sans MS', 'Open Sans', Arial, sans-serif`,
		);
		set("--cb-weight", 900);
		set("--cb-emote-scale", s.emoteScale);
		set("--cb-text-scale", s.textScale);
		set("--cb-word-scale", 0.4);
		set("--cb-gap", 18);
		set("--cb-grow", grow);
		set("--cb-text-color", s.textColor);
		set("--cb-stroke-color", s.strokeColor);
		set("--cb-stroke", s.strokeWidth);
		set("--cb-card-rgb", comboHexToRgb(s.cardColor));
		set("--cb-card-opacity", s.cardOpacity);
		set("--cb-card-radius", 18);
		set("--cb-card-padding", 14);
		set(
			"--cb-shadow",
			s.shadow ? "drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.85))" : "none",
		);

		root.dataset.pos = s.position;
		card.dataset.layout = "row";
		card.dataset.word = s.layout === "inline" ? "after" : "under";
		card.classList.toggle("has-word", Boolean(s.showWord && s.word));

		return s;
	}

	function growFor(s, value) {
		return 1 + Math.min(value, 100) / 100 * 0.6 * s.grow;
	}

	function play(name) {
		card.classList.remove("a-in", "a-out", "a-pop", "a-bounce", "a-shake");

		if (!name) {
			return;
		}

		void card.offsetWidth;

		card.classList.add(name);
	}

	function render(bump) {
		const s = getSettings();

		if (!current || current.count < s.minCombo) {
			applyVars(1);
			return;
		}

		applyVars(growFor(s, current.count));

		clearTimeout(leaveTimer);

		if (emoteImg.getAttribute("src") !== current.emote.url) {
			emoteImg.src = current.emote.url;
		}

		emoteImg.alt = current.emote.name || "";

		count.textContent = `${s.prefix}${current.count}`;
		word.textContent = s.word;

		const entering = !visible;

		visible = true;
		card.classList.add("is-on");

		if (entering) {
			play("a-in");
		} else if (bump && s.animation !== "none") {
			play(`a-${s.animation}`);
		}
	}

	function schedule() {
		clearTimeout(timer);

		timer = setTimeout(finish, getSettings().timeout * 1000);
	}

	function finish() {
		clearTimeout(timer);

		const wasVisible = visible;

		current = null;

		if (!wasVisible) {
			return;
		}

		visible = false;
		play("a-out");

		clearTimeout(leaveTimer);

		leaveTimer = setTimeout(() => {
			card.classList.remove("is-on", "a-out");
		}, 360);
	}

	function push(list) {
		const s = getSettings();
		const emotes = Array.isArray(list) ? list : [];
		const match = current && emotes.find((e) => e.key === current.key);

		if (match) {
			current.count += 1;
			current.emote = match;
			schedule();
			render(true);
			return;
		}

		if (current && current.count >= s.minCombo) {
			if (!s.breakOnOther) {
				return;
			}

			finish();
		}

		current = emotes.length
			? { key: emotes[0].key, emote: emotes[0], count: 1 }
			: null;

		if (current) {
			schedule();
		}

		render(false);
	}

	applyVars(1);

	return {
		push,
		reset: finish,
		update() {
			render(false);
		},
		destroy() {
			clearTimeout(timer);
			clearTimeout(leaveTimer);
			root.remove();
		},
	};
}

function extractComboEmotes(text, tags, username) {
	const plain = String(text || "")
		.replace(/^\x01?ACTION /, "")
		.replace(/\x01$/, "");

	const found = [];
	const seen = new Set();

	const add = (key, name, url) => {
		if (!url || seen.has(key)) {
			return;
		}

		seen.add(key);
		found.push({ key, name, url });
	};

	for (const range of parseTwitchEmoteRanges(tags || {})) {
		const known = twitchEmotes.get(String(range.id));

		add(
			`twitch:${range.id}`,
			known?.name || plain.substring(range.start, range.end + 1),
			known?.url ||
				`https://static-cdn.jtvnw.net/emoticons/v2/${range.id}/default/dark/3.0`,
		);
	}

	for (const word of plain.split(/\s+/)) {
		if (!word) {
			continue;
		}

		const emote = findThirdPartyEmote(word, username, "twitch");

		if (!emote || emote.zeroWidth || emote.modifier) {
			continue;
		}

		add(
			`${emote.provider}:${emote.name || word}`,
			emote.name || word,
			emote.url || emote.image,
		);
	}

	return found;
}

async function startComboOverlay() {
	const settings = readComboParams(params);

	document.documentElement.style.background = "transparent";
	document.body.style.background = "transparent";

	hideStaticLoadingText();

	const chat = document.getElementById("chat");

	if (chat) {
		chat.style.display = "none";
	}

	const host = document.createElement("div");

	host.style.cssText = "position:fixed;inset:0;";
	document.body.appendChild(host);

	const widget = createComboWidget(host, () => settings);
	const soundEngine = createComboSoundEngine(() => settings);

	soundEngine.preload();

	if (!settings.channel) {
		console.warn("Combo overlay: no channel set.");
		return;
	}

	CHANNEL = settings.channel;

	window.onMsg = (username, rawText, color, userId, tags) => {
		try {
			const emotes = extractComboEmotes(rawText, tags, username);

			widget.push(emotes);
			soundEngine.handle(emotes);
		} catch (error) {
			console.error("Combo message error:", error);
		}
	};

	trackTask("7TV global emotes", load7TVGlobalEmotes);
	trackTask("FFZ emotes", loadFFZEmotes);

	createTwitchIRCSocket().catch((error) =>
		console.error("Combo overlay IRC error:", error),
	);

	console.log("Combo overlay channel:", CHANNEL);
}

function comboEl(tag, className, text) {
	const node = document.createElement(tag);

	if (className) {
		node.className = className;
	}

	if (text != null) {
		node.textContent = text;
	}

	return node;
}

function showComboMenu() {
	const screen = document.getElementById("overlay-setup-screen");

	if (!screen || screen.dataset.comboOpen === "1") {
		return;
	}

	screen.dataset.comboOpen = "1";

	const savedNodes = Array.from(screen.childNodes);

	screen.replaceChildren();

	const settings = loadStoredComboSettings();
	const syncers = [];

	const topbar = comboEl("header", "mc-topbar");
	const brand = comboEl("div", "mc-brand");

	const brandMark = document.createElement("img");
	brandMark.className = "mc-brand-mark";
	brandMark.src = "waga.gif";
	brandMark.alt = "Waga";
	brandMark.draggable = false;

	const brandText = comboEl("div", "mc-brand-text");
	const brandName = comboEl("div", "mc-brand-name");

	brandName.appendChild(comboEl("span", "mc-brand-m", "M"));
	brandName.appendChild(document.createTextNode("Chat"));

	brandText.appendChild(brandName);
	brandText.appendChild(
		comboEl("div", "mc-brand-page", "Emote combos for your stream"),
	);

	brand.appendChild(brandMark);
	brand.appendChild(brandText);

	const backLink = comboEl("button", "mc-top-link", "← Back to setup");
	backLink.type = "button";
	backLink.style.cssText = "background:transparent;cursor:pointer;";

	topbar.appendChild(brand);
	topbar.appendChild(backLink);

	const sidebar = comboEl("aside", "mc-sidebar");
	sidebar.appendChild(comboEl("div", "mc-nav-label", "Emote Combos"));

	const nav = comboEl("nav", "mc-nav");
	sidebar.appendChild(nav);
	sidebar.appendChild(comboEl("div", "mc-side-spacer"));

	const sideActions = comboEl("div", "mc-side-actions");
	sidebar.appendChild(sideActions);

	sidebar.appendChild(
		comboEl(
			"div",
			"mc-side-hint",
			"Changes update the preview immediately. Copy the link and add it to OBS as a Browser Source.",
		),
	);

	const controls = comboEl("main", "mc-controls");
	const controlsHead = comboEl("div", "mc-controls-head");
	const controlTitle = comboEl("h1", "mc-control-title");
	const controlSubtitle = comboEl("p", "mc-control-subtitle");

	controlsHead.appendChild(controlTitle);
	controlsHead.appendChild(controlSubtitle);

	const panelStack = comboEl("div", "mc-panel-stack");

	controls.appendChild(controlsHead);
	controls.appendChild(panelStack);

	const stage = comboEl("section", "mc-stage");
	const stageHead = comboEl("div", "mc-stage-head");

	stageHead.appendChild(comboEl("div", "mc-stage-title", "Combo Preview"));

	const stageMeta = comboEl("div", "mc-stage-meta");

	const hitButton = comboEl("button", "mc-sim-btn", "+1 combo");
	const breakButton = comboEl("button", "mc-sim-btn", "Break");
	const autoButton = comboEl("button", "mc-sim-btn", "Auto play");

	for (const button of [hitButton, breakButton, autoButton]) {
		button.type = "button";
		stageMeta.appendChild(button);
	}

	stageHead.appendChild(stageMeta);

	const stageCanvas = comboEl("div", "mc-stage-canvas");
	const previewFrame = comboEl("div", "mc-preview-frame");

	stageCanvas.appendChild(previewFrame);
	stage.appendChild(stageHead);
	stage.appendChild(stageCanvas);

	const widget = createComboWidget(previewFrame, () => settings);

	function commit() {
		saveStoredComboSettings(settings);
		widget.update();
	}

	function addSection(panel, text) {
		panel.appendChild(comboEl("h2", "mc-subhead", text));
	}

	function addFieldWrap(panel, labelText, control) {
		const field = comboEl("div", "mc-field");

		field.appendChild(comboEl("label", "mc-label", labelText));
		field.appendChild(control);
		panel.appendChild(field);

		return field;
	}

	function addChannel(panel, field) {
		const labelRow = comboEl("div", "mc-channel-label-row");

		labelRow.appendChild(comboEl("label", "mc-channel-label", "Twitch Channel"));

		const wrap = comboEl("div", "mc-channel-input-wrap");
		const input = comboEl("input", "mc-channel-input");

		input.type = "text";
		input.placeholder = "Channel Name";
		input.autocomplete = "off";
		input.spellcheck = false;
		input.value = settings.channel;

		input.addEventListener("input", () => {
			settings.channel = cleanComboChannel(input.value);
			commit();
		});

		input.addEventListener("blur", () => {
			input.value = settings.channel;
		});

		wrap.appendChild(input);
		panel.appendChild(labelRow);
		panel.appendChild(wrap);

		const note = comboEl(
			"div",
			"mc-muted",
			"Type your Twitch username. You can also paste your twitch.tv link.",
		);

		note.style.cssText = "margin:8px 0 14px;line-height:1.55;";
		panel.appendChild(note);

		syncers.push(() => {
			input.value = settings.channel;
		});
	}

	function addRange(panel, field) {
		const wrap = comboEl("div", "mc-field");
		const line = comboEl("div", "mc-range-line");
		const input = comboEl("input", "mc-range");
		const output = comboEl("span", "mc-percent");

		input.type = "range";
		input.min = field.min;
		input.max = field.max;
		input.step = field.step;
		input.value = settings[field.key];
		input.setAttribute("aria-label", field.label);

		const show = () => {
			output.textContent = field.fmt
				? field.fmt(settings[field.key])
				: String(settings[field.key]);
		};

		input.addEventListener("input", () => {
			settings[field.key] = Number(input.value);
			show();
			commit();
		});

		show();

		line.append(input, output);
		wrap.append(comboEl("label", "mc-label", field.label), line);
		panel.appendChild(wrap);

		syncers.push(() => {
			input.value = settings[field.key];
			show();
		});
	}

	function addColor(panel, field) {
		const row = comboEl("div", "mc-toggle-row mc-static-row");
		const copy = comboEl("div", "mc-toggle-copy");
		const title = comboEl("div", "mc-toggle-title", field.label);
		const note = comboEl("div", "mc-toggle-note", settings[field.key]);
		const input = comboEl("input", "mc-color");

		input.type = "color";
		input.value = settings[field.key];
		input.setAttribute("aria-label", field.label);

		input.addEventListener("input", () => {
			settings[field.key] = input.value;
			note.textContent = input.value;
			commit();
		});

		copy.append(title, note);
		row.append(copy, input);
		panel.appendChild(row);

		syncers.push(() => {
			input.value = settings[field.key];
			note.textContent = settings[field.key];
		});
	}

	function addBool(panel, field) {
		const row = comboEl("label", "mc-toggle-row");
		const copy = comboEl("div", "mc-toggle-copy");
		const name = comboEl("div", "mc-toggle-name");

		name.appendChild(comboEl("span", "", field.label));
		copy.append(name, comboEl("div", "mc-toggle-note", field.note || ""));

		const input = comboEl("input", "mc-check");

		input.type = "checkbox";
		input.checked = Boolean(settings[field.key]);
		row.classList.toggle("is-on", input.checked);

		input.addEventListener("change", () => {
			settings[field.key] = input.checked;
			row.classList.toggle("is-on", input.checked);
			commit();
		});

		row.append(copy, input, comboEl("span", "mc-switch"));
		panel.appendChild(row);

		syncers.push(() => {
			input.checked = Boolean(settings[field.key]);
			row.classList.toggle("is-on", input.checked);
		});
	}

	function addSelect(panel, field) {
		const select = comboEl("select", "mc-select");

		for (const [value, label] of field.options) {
			const option = comboEl("option", "", label);

			option.value = value;
			select.appendChild(option);
		}

		select.value = settings[field.key];

		select.addEventListener("change", () => {
			settings[field.key] = select.value;
			commit();
		});

		addFieldWrap(panel, field.label, select);

		syncers.push(() => {
			select.value = settings[field.key];
		});
	}

	function addText(panel, field) {
		const input = comboEl("input", "mc-input");

		input.type = "text";
		input.maxLength = field.max || 40;
		input.value = settings[field.key];
		input.spellcheck = false;

		input.addEventListener("input", () => {
			settings[field.key] = input.value;
			commit();
		});

		addFieldWrap(panel, field.label, input);

		syncers.push(() => {
			input.value = settings[field.key];
		});
	}

	function addFont(panel, field) {
		const select = comboEl("select", "mc-select");

		for (const [value, label] of COMBO_FONT_OPTIONS) {
			const option = comboEl("option", "", label);

			option.value = value;
			select.appendChild(option);
		}

		select.value = settings.font;
		addFieldWrap(panel, "Font", select);

		const custom = comboEl("input", "mc-input");

		custom.type = "text";
		custom.placeholder = "e.g. Press Start 2P";
		custom.autocomplete = "off";
		custom.spellcheck = false;
		custom.value = settings.customFont;

		const customField = addFieldWrap(panel, "Google Font name", custom);

		const syncCustom = () => {
			customField.style.display = select.value === "custom" ? "" : "none";
		};

		select.addEventListener("change", () => {
			settings.font = select.value;
			syncCustom();
			commit();
		});

		custom.addEventListener("input", () => {
			settings.customFont = sanitizeComboFont(custom.value);
			commit();
		});

		syncCustom();

		syncers.push(() => {
			select.value = settings.font;
			custom.value = settings.customFont;
			syncCustom();
		});
	}

	function addSounds(panel) {
		ensureComboSoundStyle();

		addSection(panel, "Add a sound");

		const form = comboEl("div", "cb-snd-form");

		const nameInput = comboEl("input", "mc-input");
		nameInput.type = "text";
		nameInput.placeholder = "e.g. Kappa";
		nameInput.spellcheck = false;
		nameInput.autocomplete = "off";

		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "audio/*,.mp3,.ogg,.wav,.m4a,.webm";
		fileInput.style.display = "none";

		const fileRow = comboEl("div", "cb-snd-file");
		const fileButton = comboEl("button", "mc-button", "Upload file");
		const fileName = comboEl("span", "cb-snd-file-name", "No file chosen");

		fileButton.type = "button";
		fileRow.append(fileButton, fileName, fileInput);

		const countInput = comboEl("input", "mc-input");
		countInput.type = "number";
		countInput.min = 1;
		countInput.max = 99;
		countInput.value = COMBO_SOUND_DEFAULT_COUNT;

		const addButton = comboEl("button", "mc-button mc-button-full", "Add");
		addButton.type = "button";

		const status = comboEl("div", "cb-snd-status");

		const field = (label, control) => {
			const wrap = comboEl("div", "mc-field");

			wrap.append(comboEl("label", "mc-label", label), control);

			return wrap;
		};

		form.append(
			field("Emote Name", nameInput),
			field("Upload File", fileRow),
			field("Count", countInput),
			addButton,
		);

		const list = comboEl("div", "cb-snd-list");

		let uploadedUrl = "";
		let uploading = false;

		const setStatus = (text, isError) => {
			status.textContent = text;
			status.classList.toggle("is-error", Boolean(isError));
		};

		fileButton.addEventListener("click", () => fileInput.click());

		fileInput.addEventListener("change", async () => {
			const file = fileInput.files?.[0];

			if (!file) {
				return;
			}

			fileName.textContent = file.name;
			uploadedUrl = "";
			uploading = true;
			fileButton.disabled = true;
			setStatus("Uploading...");

			try {
				uploadedUrl = await uploadComboSound(file);
				setStatus("Uploaded.");
			} catch (error) {
				fileName.textContent = "No file chosen";
				setStatus(error.message || "Upload failed.", true);
			} finally {
				uploading = false;
				fileButton.disabled = false;
				fileInput.value = "";
			}
		});

		function buildRow(rule) {
			const row = comboEl("div", "cb-snd-row");

			const test = comboEl("button", "mc-sim-btn", "▶");
			const del = comboEl("button", "mc-sim-btn", "✕");

			test.type = "button";
			test.title = "Test sound";
			del.type = "button";
			del.title = "Remove";

			test.addEventListener("click", () => {
				playComboSound(rule);
			});

			del.addEventListener("click", () => {
				settings.sounds = settings.sounds.filter((entry) => entry !== rule);
				row.remove();
				commit();
			});

			const file = comboEl(
				"span",
				"cb-snd-row-file",
				decodeURIComponent(rule.url.split("/").pop() || rule.url),
			);

			file.title = rule.url;

			row.append(
				comboEl("span", "cb-snd-row-name", rule.name),
				comboEl("span", "cb-snd-row-count", `x${rule.count}`),
				file,
				test,
				del,
			);

			return row;
		}

		function renderList() {
			list.replaceChildren(...settings.sounds.map(buildRow));
		}

		addButton.addEventListener("click", () => {
			const name = nameInput.value.trim();

			if (!name) {
				setStatus("Enter an emote name.", true);
				return;
			}

			if (uploading) {
				setStatus("Wait for the upload to finish.", true);
				return;
			}

			if (!uploadedUrl) {
				setStatus("Upload a sound file first.", true);
				return;
			}

			if (settings.sounds.length >= COMBO_SOUND_MAX_RULES) {
				setStatus("Sound limit reached.", true);
				return;
			}

			const rule = normalizeComboSound({
				name,
				url: uploadedUrl,
				count: countInput.value,
			});

			settings.sounds.push(rule);
			list.appendChild(buildRow(rule));
			commit();

			nameInput.value = "";
			fileName.textContent = "No file chosen";
			uploadedUrl = "";
			setStatus("Added.");
			nameInput.focus();
		});

		panel.append(form, status);
		panel.appendChild(list);

		renderList();

		syncers.push(renderList);
	}

	const builders = {
		sounds: addSounds,
		channel: addChannel,
		range: addRange,
		color: addColor,
		bool: addBool,
		select: addSelect,
		text: addText,
		font: addFont,
	};

	function activate(id) {
		for (const button of nav.querySelectorAll(".mc-nav-button")) {
			const active = button.dataset.panel === id;

			button.classList.toggle("is-active", active);
			button.setAttribute("aria-selected", active ? "true" : "false");
			button.tabIndex = active ? 0 : -1;
		}

		for (const panel of panelStack.querySelectorAll(".mc-panel")) {
			panel.classList.toggle("is-active", panel.dataset.panel === id);
		}

		const tab = COMBO_TABS.find((entry) => entry.id === id);

		controlTitle.textContent = tab.title;
		controlSubtitle.textContent = tab.desc;
		panelStack.scrollTop = 0;
	}

	for (const tab of COMBO_TABS) {
		const panel = comboEl("section", "mc-panel");

		panel.dataset.panel = tab.id;
		panel.setAttribute("role", "tabpanel");

		const navButton = comboEl("button", "mc-nav-button");

		navButton.type = "button";
		navButton.dataset.panel = tab.id;
		navButton.title = tab.desc;
		navButton.setAttribute("role", "tab");

		const navIcon = comboEl("span", "mc-nav-icon");

		navIcon.setAttribute("aria-hidden", "true");

		const navCopy = comboEl("span", "mc-nav-copy");

		navCopy.appendChild(comboEl("span", "mc-nav-title", tab.title));
		navButton.append(navIcon, navCopy);
		nav.appendChild(navButton);
		panelStack.appendChild(panel);

		navButton.addEventListener("click", () => activate(tab.id));

		for (const field of tab.fields) {
			if (field.section) {
				addSection(panel, field.section);
				continue;
			}

			builders[field.type](panel, field);
		}
	}

	const actions = comboEl("div", "mc-actions");

	const copyButton = comboEl("button", "mc-button mc-button-full", "Copy overlay link");
	copyButton.type = "button";

	const resetButton = comboEl("button", "mc-button mc-button-full", "Reset settings");
	resetButton.type = "button";

	actions.append(copyButton, resetButton);

	const error = comboEl("div", "mc-error");

	sideActions.append(actions, error);

	copyButton.addEventListener("click", async () => {
		error.style.display = "none";

		if (!settings.channel) {
			error.textContent = "Enter your Twitch username in the Channel tab first.";
			error.style.display = "block";
			activate("channel");
			return;
		}

		const url = buildComboUrl(settings);

		let ok = false;

		try {
			await navigator.clipboard.writeText(url);
			ok = true;
		} catch {
			const area = document.createElement("textarea");

			area.value = url;
			area.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
			document.body.appendChild(area);
			area.select();

			try {
				ok = document.execCommand("copy");
			} catch {}

			area.remove();
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

	resetButton.addEventListener("click", () => {
		const channel = settings.channel;

		Object.assign(settings, COMBO_DEFAULTS, { channel });

		for (const sync of syncers) {
			sync();
		}

		commit();
	});

	let autoTimer = null;
	let autoRemaining = 0;

	function stopAuto() {
		clearTimeout(autoTimer);
		autoTimer = null;
		autoButton.classList.remove("is-active");
	}

	function autoStep() {
		if (autoRemaining > 0) {
			autoRemaining -= 1;
			widget.push([COMBO_PREVIEW_EMOTE]);
			autoTimer = setTimeout(autoStep, 260 + Math.random() * 260);
			return;
		}

		widget.reset();
		autoRemaining = 10 + Math.floor(Math.random() * 18);
		autoTimer = setTimeout(autoStep, 1800);
	}

	hitButton.addEventListener("click", () => widget.push([COMBO_PREVIEW_EMOTE]));

	breakButton.addEventListener("click", () => {
		stopAuto();
		widget.reset();
	});

	autoButton.addEventListener("click", () => {
		if (autoTimer) {
			stopAuto();
			return;
		}

		autoButton.classList.add("is-active");
		autoRemaining = 12 + Math.floor(Math.random() * 12);
		autoStep();
	});

	backLink.addEventListener("click", () => {
		stopAuto();
		widget.destroy();
		screen.replaceChildren(...savedNodes);
		delete screen.dataset.comboOpen;
	});

	screen.append(topbar, sidebar, controls, stage);

	activate("channel");

	setTimeout(() => {
		for (let i = 0; i < 4; i++) {
			widget.push([COMBO_PREVIEW_EMOTE]);
		}
	}, 250);
}