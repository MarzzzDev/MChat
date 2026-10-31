const PLATFORM_PROXY_URL = "https://dark-sky-7185.marseceva.workers.dev/";

const TRUSTED_PROXY_ORIGINS = new Set([new URL(PLATFORM_PROXY_URL).origin]);

const PROXY_STRIPPED_HEADERS = new Set([
	"cookie",
	"cookie2",
	"set-cookie",
	"authorization",
	"proxy-authorization",
	"x-csrf-token",
	"x-xsrf-token",
]);
const PROXY_SENSITIVE_HEADER_PATTERN = /auth|token|secret|session|cookie|api-?key/i;

function validatePlatformProxyUrl(value) {
	const raw = String(value ?? "").trim();

	if (!raw || raw.length > 512) {
		return null;
	}

	let url;

	try {
		url = new URL(raw);
	} catch {
		return null;
	}

	if (url.protocol !== "https:" || url.username || url.password) {
		return null;
	}

	if (url.search || url.hash || !TRUSTED_PROXY_ORIGINS.has(url.origin)) {
		return null;
	}

	return url.origin + url.pathname.replace(/\/+$/, "");
}

function getPlatformProxy() {
	const override = params.get("proxy");

	if (override) {
		const validated = validatePlatformProxyUrl(override);

		if (validated) {
			return validated;
		}

		console.warn("[proxy] Ignoring ?proxy= override: not a trusted HTTPS origin.");
	}

	return validatePlatformProxyUrl(PLATFORM_PROXY_URL) || "";
}

function sanitizeProxyHeaders(headers) {
	const clean = new Headers();

	try {
		new Headers(headers || undefined).forEach((value, name) => {
			const lower = name.toLowerCase();

			if (
				PROXY_STRIPPED_HEADERS.has(lower) ||
				PROXY_SENSITIVE_HEADER_PATTERN.test(lower)
			) {
				return;
			}

			clean.set(name, value);
		});
	} catch {}

	return clean;
}

function proxiedUrl(target) {
	const proxy = getPlatformProxy();

	if (!proxy) {
		throw new Error("No trusted platform proxy is configured.");
	}

	let url;

	try {
		url = new URL(String(target));
	} catch {
		throw new Error("Invalid proxy target URL.");
	}

	if (url.protocol !== "https:" || url.username || url.password) {
		throw new Error("Proxy target must be an https URL without credentials.");
	}

	return `${proxy}/?u=${encodeURIComponent(url.href)}`;
}

async function platformFetch(url, init = {}) {
	if (!getPlatformProxy()) {
		return fetch(url, init);
	}

	return fetch(
		proxiedUrl(url),
		Object.assign({}, init, {
			headers: sanitizeProxyHeaders(init.headers),
			credentials: "omit",
			referrerPolicy: "no-referrer",
		}),
	);
}

function createBoundedQueue({ maxSize, batchSize, intervalMs, handler }) {
	const items = [];
	let timer = null;
	let dropped = 0;

	function drain() {
		timer = null;

		const count = Math.min(batchSize, items.length);

		for (let i = 0; i < count; i++) {
			const item = items.shift();

			try {
				handler(item);
			} catch (error) {
				console.error("[queue] handler error:", error);
			}
		}

		if (items.length) {
			timer = setTimeout(drain, intervalMs);
		}
	}

	return {
		push(item) {
			if (items.length >= maxSize) {
				items.shift();
				dropped += 1;
			}

			items.push(item);

			if (timer === null) {
				timer = setTimeout(drain, 0);
			}
		},
		clear() {
			items.length = 0;
			clearTimeout(timer);
			timer = null;
		},
		get size() {
			return items.length;
		},
		get dropped() {
			return dropped;
		},
	};
}

const MOD_COMMANDS = new Map([["-refresh", () => hardRefreshOverlay()]]);

const ALWAYS_ALLOWED_MOD_COMMANDS = new Set(["-refresh", "-modcommands"]);

const OPTION_OVERRIDES_KEY = "mchat-option-overrides";
const optionOverrides = {};

const OPTION_BOOL_WORDS = {
	on: true,
	true: true,
	yes: true,
	1: true,
	off: false,
	false: false,
	no: false,
	0: false,
};

const rootStyle = () => document.documentElement.style;

function numberOption(min, max, get, set) {
	return { kind: "number", min, max, get, set };
}

function boolOption(get, set) {
	return { kind: "bool", get, set };
}

function enumOption(values, get, set) {
	return { kind: "enum", values, get, set };
}

function colorOption(get, set) {
	return { kind: "color", get, set };
}

function listOption(get, set) {
	return { kind: "list", get, set };
}

function simpleBool(read, write, after) {
	return boolOption(read, (value) => {
		write(value);
		after?.();
	});
}

const OVERLAY_OPTIONS = {
	scale: numberOption(
		0.25,
		3,
		() => scale,
		(v) => {
			scale = v;
			rootStyle().setProperty("--chat-scale", v);
		},
	),
	emotescale: numberOption(
		0.25,
		3,
		() => emoteScale,
		(v) => {
			emoteScale = v;
			rootStyle().setProperty("--emote-scale", v);
		},
	),
	bigemotescale: numberOption(
		1,
		3,
		() => bigEmoteScale,
		(v) => {
			bigEmoteScale = v;
			applyBigEmoteSettings();
		},
	),
	badgescale: numberOption(
		0.25,
		2,
		() => badgeScale,
		(v) => {
			badgeScale = v;
			rootStyle().setProperty("--badge-scale", String(v));
		},
	),
	badgespacing: numberOption(
		0,
		30,
		() => badgeSpacing,
		(v) => {
			badgeSpacing = v;
			rootStyle().setProperty("--badge-spacing", `${v}px`);
		},
	),
	gifscale: numberOption(
		0.25,
		3,
		() => gifScale,
		(v) => {
			gifScale = v;
			applyTextStyleSettings();
		},
	),
	usernamesize: numberOption(
		8,
		100,
		() => usernameFontSize,
		(v) => {
			usernameFontSize = v;
			roleTypographyEnabled = true;
			applyRoleTypography();
		},
	),
	messagesize: numberOption(
		8,
		100,
		() => messageFontSize,
		(v) => {
			messageFontSize = v;
			roleTypographyEnabled = true;
			applyRoleTypography();
		},
	),
	strokewidth: numberOption(
		0,
		20,
		() => strokeWidth,
		(v) => {
			strokeWidth = v;
			applyTextStyleSettings();
		},
	),
	shadowintensity: numberOption(
		0,
		1,
		() => shadowIntensity,
		(v) => {
			shadowIntensity = v;
			applyShadowSettings();
		},
	),
	shadowsize: numberOption(
		0,
		40,
		() => shadowSize,
		(v) => {
			shadowSize = v;
			applyShadowSettings();
		},
	),
	shadowoffset: numberOption(
		0,
		20,
		() => shadowOffset,
		(v) => {
			shadowOffset = v;
			applyShadowSettings();
		},
	),
	messagespacing: numberOption(
		0,
		32,
		() => messageSpacing,
		(v) => {
			messageSpacing = v;
			applyMessageCardSettings();
		},
	),
	messagecardopacity: numberOption(
		0,
		1,
		() => messageCardOpacity,
		(v) => {
			messageCardOpacity = v;
			applyMessageCardSettings();
		},
	),
	messagecardradius: numberOption(
		0,
		32,
		() => messageCardRadius,
		(v) => {
			messageCardRadius = v;
			applyMessageCardSettings();
		},
	),
	messagecardborderwidth: numberOption(
		0,
		8,
		() => messageCardBorderWidth,
		(v) => {
			messageCardBorderWidth = v;
			applyMessageCardSettings();
		},
	),
	messagecardpadding: numberOption(
		0,
		24,
		() => messageCardPadding,
		(v) => {
			messageCardPadding = v;
			applyMessageCardSettings();
		},
	),
	fade: {
		kind: "fade",
		get: () => fade,
		set: (v) => {
			fade = v;

			for (const message of document.querySelectorAll("#chat > .message")) {
				if (
					message.classList.contains("hl-card") ||
					message.style.animation.includes("messageFadeOut")
				) {
					continue;
				}

				scheduleMessageFade(message, message.dataset.userKey || null);
			}
		},
	},
	textcolor: colorOption(
		() => textColor,
		(v) => {
			textColor = v;
			applyTextColor(v);
		},
	),
	linkcolor: colorOption(
		() => linkColor,
		(v) => {
			linkColor = v;
			applyLinkColor(v);
		},
	),
	strokecolor: colorOption(
		() => strokeColor,
		(v) => {
			strokeColor = v;
			applyTextStyleSettings();
		},
	),
	messagecardcolor: colorOption(
		() => messageCardColor,
		(v) => {
			messageCardColor = v;
			applyMessageCardSettings();
		},
	),
	messagecardbordercolor: colorOption(
		() => messageCardBorderColor,
		(v) => {
			messageCardBorderColor = v;
			applyMessageCardSettings();
		},
	),
	entryanimation: enumOption(
		["classic", "from-left", "from-right", "smooth-scroll", "none"],
		() => entryAnimation,
		(v) => {
			entryAnimation = v;
			applyEntryAnimation();
		},
	),
	align: enumOption(
		["left", "center", "right"],
		() => alignMode,
		(v) => {
			alignMode = v;
			applyLayoutSettings();
		},
	),
	messagecardborderstyle: enumOption(
		["solid", "dashed", "dotted"],
		() => messageCardBorderStyle,
		(v) => {
			messageCardBorderStyle = v;
			applyMessageCardSettings();
		},
	),
	font: enumOption(
		["opensans", "arial", "comicsans", "roboto", "montserrat", "minecraft"],
		() => fontValueToQueryKey(chatFont),
		(v) => {
			chatFont = fontQueryKeyToValue(v);
			applyChatFont();
			applyRoleTypography();
		},
	),
	bold: simpleBool(() => boldEnabled, (v) => (boldEnabled = v), () => applyTextStyleSettings()),
	uppercase: simpleBool(() => uppercaseEnabled, (v) => (uppercaseEnabled = v), () => applyTextStyleSettings()),
	centerbadges: simpleBool(() => centerBadgesEnabled, (v) => (centerBadgesEnabled = v), () => applyTextStyleSettings()),
	shadow: simpleBool(() => shadowEnabled, (v) => (shadowEnabled = v), () => applyShadowSettings()),
	messagecards: simpleBool(() => messageCardsEnabled, (v) => (messageCardsEnabled = v), () => applyMessageCardSettings()),
	newesttop: simpleBool(() => newestTopEnabled, (v) => (newestTopEnabled = v), () => applyLayoutSettings()),
	wrap: simpleBool(
		() => wrapEnabled,
		(v) => {
			wrapEnabled = v;

			if (v) {
				wrapAfterColonEnabled = false;
			}
		},
		() => {
			applyLayoutSettings();

			for (const message of document.querySelectorAll("#chat > .message:not(.hl-card)")) {
				message.classList.toggle("wrap-message", wrapEnabled);
			}
		},
	),
	wrapaftercolon: simpleBool(
		() => wrapAfterColonEnabled,
		(v) => {
			wrapAfterColonEnabled = v;

			if (v) {
				wrapEnabled = false;
			}
		},
		() => {
			applyLayoutSettings();

			for (const message of document.querySelectorAll("#chat > .message:not(.hl-card)")) {
				message.classList.toggle("wrap-message", wrapEnabled);
			}
		},
	),
	bigemotes: simpleBool(() => bigEmotesEnabled, (v) => (bigEmotesEnabled = v)),
	badges: simpleBool(() => badgesEnabled, (v) => (badgesEnabled = v)),
	timestamps: simpleBool(
		() => timestampsEnabled,
		(v) => (timestampsEnabled = v),
		() => window.refreshMessageTimestamps?.(),
	),
	badgetwitch: simpleBool(() => badgeTwitch, (v) => (badgeTwitch = v)),
	badgeffz: simpleBool(() => badgeFfz, (v) => (badgeFfz = v)),
	badgeseventv: simpleBool(() => badgeSeventv, (v) => (badgeSeventv = v)),
	badgechatterino: simpleBool(() => badgeChatterino, (v) => (badgeChatterino = v)),
	badgehomies: simpleBool(() => badgeHomies, (v) => (badgeHomies = v)),
	badgebttv: simpleBool(() => badgeBttv, (v) => (badgeBttv = v)),
	badgedankchat: simpleBool(() => badgeDankchat, (v) => (badgeDankchat = v)),
	badgemoltorino: simpleBool(() => badgeMoltorino, (v) => (badgeMoltorino = v)),
	pfps: simpleBool(() => pfpsEnabled, (v) => (pfpsEnabled = v)),
	gifs: simpleBool(() => gifsEnabled, (v) => (gifsEnabled = v)),
	highlights: simpleBool(() => highlightsEnabled, (v) => (highlightsEnabled = v)),
	hlfirst: simpleBool(() => hlFirstEnabled, (v) => (hlFirstEnabled = v)),
	hlredeems: simpleBool(() => hlRedeemsEnabled, (v) => (hlRedeemsEnabled = v)),
	hlgifts: simpleBool(() => hlGiftsEnabled, (v) => (hlGiftsEnabled = v)),
	hlsubs: simpleBool(() => hlSubsEnabled, (v) => (hlSubsEnabled = v)),
	hlraids: simpleBool(() => hlRaidsEnabled, (v) => (hlRaidsEnabled = v)),
	hlstreaks: simpleBool(() => hlStreaksEnabled, (v) => (hlStreaksEnabled = v)),
	pins: simpleBool(() => pinsEnabled, (v) => (pinsEnabled = v)),
	bots: simpleBool(() => botsEnabled, (v) => (botsEnabled = v)),
	hidelinks: simpleBool(() => hideLinksEnabled, (v) => (hideLinksEnabled = v)),
	platformindicator: simpleBool(() => platformIndicatorEnabled, (v) => (platformIndicatorEnabled = v)),
	colonmatchusername: simpleBool(() => colonMatchUsernameEnabled, (v) => (colonMatchUsernameEnabled = v)),
	unlisted: simpleBool(() => showUnlisted7TV, (v) => (showUnlisted7TV = v)),
	cheers: simpleBool(() => cheersEnabled, (v) => (cheersEnabled = v)),
	collapse: simpleBool(() => collapseEnabled, (v) => (collapseEnabled = v)),
	msgfilter: listOption(
		() => messageFilters,
		(v) => {
			messageFilters = v;
		},
	),
	botfilter: listOption(
		() => botFilterUsers,
		(v) => {
			botFilterUsers = v;
		},
	),
};

function coerceOptionValue(option, input) {
	switch (option.kind) {
		case "number": {
			const value = Number(input);

			return Number.isFinite(value)
				? Math.max(option.min, Math.min(value, option.max))
				: undefined;
		}

		case "bool":
			if (typeof input === "boolean") {
				return input;
			}

			return OPTION_BOOL_WORDS[String(input).toLowerCase()];

		case "enum": {
			const value = String(input).toLowerCase();

			return option.values.includes(value) ? value : undefined;
		}

		case "color": {
			const match = /^#?([0-9a-f]{6})$/i.exec(String(input).trim());

			return match ? `#${match[1].toLowerCase()}` : undefined;
		}

		case "fade": {
			if (input === false || /^(off|false|no)$/i.test(String(input))) {
				return false;
			}

			const value = Number(input);

			return Number.isFinite(value) && value >= 1 ? value : undefined;
		}

		case "list": {
			if (Array.isArray(input)) {
				return input.map(String);
			}

			return /^(off|none|clear)$/i.test(String(input).trim())
				? []
				: parseQueryList(input, { stripAt: option === OVERLAY_OPTIONS.botfilter });
		}
	}

	return undefined;
}

function saveOptionOverrides() {
	try {
		localStorage.setItem(
			OPTION_OVERRIDES_KEY,
			JSON.stringify({ query: location.search, values: optionOverrides }),
		);
	} catch {}
}

function runOptionCommand(name, option, args) {
	let input;

	if (option.kind === "bool" && !args.length) {
		input = !option.get();
	} else if (!args.length) {
		return;
	} else if (option.kind === "list") {
		input = args.join(" ");
	} else {
		input = args[0];
	}

	const value = coerceOptionValue(option, input);

	if (value === undefined) {
		console.warn(`[mod] Invalid value for -${name}:`, input);
		return;
	}

	option.set(value);
	optionOverrides[name] = value;
	saveOptionOverrides();

	console.log(`[mod] -${name} set to`, value);
}

function applyStoredOptionOverrides() {
	try {
		const saved = JSON.parse(localStorage.getItem(OPTION_OVERRIDES_KEY) || "null");

		if (!saved || saved.query !== location.search) {
			localStorage.removeItem(OPTION_OVERRIDES_KEY);
			return;
		}

		for (const [name, stored] of Object.entries(saved.values || {})) {
			const option = OVERLAY_OPTIONS[name];
			const value = option ? coerceOptionValue(option, stored) : undefined;

			if (value === undefined) {
				continue;
			}

			option.set(value);
			optionOverrides[name] = value;
		}
	} catch (error) {
		console.warn("Stored option overrides could not be applied:", error);
	}
}

function resetOptionOverrides() {
	try {
		localStorage.removeItem(OPTION_OVERRIDES_KEY);
	} catch {}

	location.reload();
}

for (const [name, option] of Object.entries(OVERLAY_OPTIONS)) {
	MOD_COMMANDS.set(`-${name}`, (args) => runOptionCommand(name, option, args));
}

MOD_COMMANDS.set("-reset", resetOptionOverrides);

MOD_COMMANDS.set("-reconnect", (args) => {
	const platform = String(args[0] || "all").toLowerCase();
	const reconnectors = {
		twitch: () => reconnectTwitchChat(),
		kick: () => reconnectKickChat(),
		youtube: () => reconnectYouTubeChat(),
		tiktok: () => reconnectTikTokChat(),
	};
	const selected = platform === "all" ? Object.keys(reconnectors) : [platform];
	const jobs = selected.filter((name) => reconnectors[name] && (name !== "twitch" || CHANNEL) && (name !== "kick" || selectedKick) && (name !== "youtube" || selectedYouTube) && (name !== "tiktok" || selectedTikTok));
	if (!jobs.length) {
		console.warn(`[mchat] No active platform matched -reconnect ${platform}`);
		return;
	}
	for (const name of jobs) {
		Promise.resolve(reconnectors[name]()).catch((error) => console.error(`[mchat] ${name} reconnect failed:`, error));
	}
	console.info(`[mchat] Reconnecting: ${jobs.join(", ")}`);
});

MOD_COMMANDS.set("-connections", () => {
	const status = {
		twitch: twitchIRCSocket?.readyState === WebSocket.OPEN ? "connected" : CHANNEL ? "reconnecting" : "off",
		kick: kickSocket?.readyState === WebSocket.OPEN ? "connected" : selectedKick ? "reconnecting" : "off",
		youtube: youtubeChat ? "connected" : selectedYouTube ? "reconnecting" : "off",
		tiktok: tikTokPollController ? "connected" : selectedTikTok ? "reconnecting" : "off",
	};
	console.info("[mchat] Platform connections:", status);
});

const SHOW_TRUSTED_HOSTS = ["kappa.lol", "femboy.beauty", "olrite.lol", "gachi.gay"];
const SHOW_DURATION_MS = 5000;
const SHOW_IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "avif", "svg"]);
const SHOW_VIDEO_EXT = new Set(["mp4", "webm", "mov", "m4v"]);
const SHOW_AUDIO_EXT = new Set(["mp3", "ogg", "wav", "m4a", "flac", "opus", "aac"]);

let activeShow = null;

function resolveTrustedShowUrl(input) {
	let url;

	try {
		url = new URL(String(input || "").trim());
	} catch {
		return null;
	}

	if (url.protocol !== "https:" || url.username || url.password) {
		return null;
	}

	const host = url.hostname.toLowerCase();

	const trusted = SHOW_TRUSTED_HOSTS.some(
		(allowed) => host === allowed || host.endsWith(`.${allowed}`),
	);

	return trusted ? url.href : null;
}

function detectShowKinds(href) {
	const match = /\.([a-z0-9]+)$/i.exec(new URL(href).pathname);
	const ext = match ? match[1].toLowerCase() : "";

	if (SHOW_IMAGE_EXT.has(ext)) {
		return ["image"];
	}

	if (SHOW_VIDEO_EXT.has(ext)) {
		return ["video"];
	}

	if (SHOW_AUDIO_EXT.has(ext)) {
		return ["audio"];
	}

	return ["image", "video"];
}

function getShowLayer() {
	let layer = document.getElementById("show-layer");

	if (layer) {
		return layer;
	}

	layer = document.createElement("div");
	layer.id = "show-layer";

	Object.assign(layer.style, {
		position: "fixed",
		left: "0",
		right: "0",
		top: "50%",
		bottom: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		pointerEvents: "none",
		zIndex: "2147483647",
	});

	document.body.appendChild(layer);

	return layer;
}

function clearShow() {
	if (!activeShow) {
		return;
	}

	clearTimeout(activeShow.timer);

	for (const node of activeShow.nodes) {
		if (typeof node.pause === "function") {
			node.pause();
		}

		node.removeAttribute?.("src");
		node.remove?.();
	}

	activeShow = null;
}

function buildShowNode(kind, href) {
	if (kind === "audio") {
		const audio = new Audio();

		audio.preload = "auto";
		audio.autoplay = true;
		audio.src = href;

		return audio;
	}

	const node = document.createElement(kind === "video" ? "video" : "img");

	Object.assign(node.style, {
		maxWidth: "100%",
		maxHeight: "100%",
		objectFit: "contain",
	});

	if (kind === "video") {
		node.autoplay = true;
		node.playsInline = true;
		node.preload = "auto";
	} else {
		node.decoding = "async";
		node.referrerPolicy = "no-referrer";
	}

	node.src = href;

	return node;
}

function showMedia(href) {
	clearShow();

	const layer = getShowLayer();
	const kinds = detectShowKinds(href);
	const state = { nodes: [], timer: null };

	activeShow = state;

	const attempt = (index) => {
		if (activeShow !== state) {
			return;
		}

		const kind = kinds[index];

		if (!kind) {
			clearShow();
			return;
		}

		clearTimeout(state.timer);

		if (kind !== "video") {
			state.timer = setTimeout(clearShow, SHOW_DURATION_MS);
		}

		const node = buildShowNode(kind, href);

		state.nodes.push(node);

		if (kind === "video") {
			node.addEventListener("ended", () => {
				if (activeShow === state) {
					clearShow();
				}
			});
		}

		node.addEventListener(
			"error",
			() => {
				if (activeShow !== state) {
					return;
				}

				if (typeof node.pause === "function") {
					node.pause();
				}

				node.removeAttribute("src");
				node.remove();
				state.nodes = state.nodes.filter((item) => item !== node);

				attempt(index + 1);
			},
			{ once: true },
		);

		if (kind !== "audio") {
			layer.appendChild(node);
		}

		if (typeof node.play === "function") {
			node.play().catch(() => {});
		}
	};

	attempt(0);
}

MOD_COMMANDS.set("-show", (args, rawArgs) => {
	const href = resolveTrustedShowUrl(rawArgs[0]);

	if (!href) {
		console.warn("[mod] -show rejected: untrusted or invalid url");
		return;
	}

	showMedia(href);
});

MOD_COMMANDS.set("-skip", () => {
	clearShow();
});

MOD_COMMANDS.set("-modcommands", (args, rawArgs, isBroadcaster) => {
	if (!args.length) {
		console.info("[mchat] Commands: -reconnect [twitch|kick|youtube|tiktok|all], -connections, -refresh, -modcommands on|off");
		return;
	}
	const value = OPTION_BOOL_WORDS[String(args[0] || "").toLowerCase()];

	if (value === undefined) {
		return;
	}

	if (value === false || isBroadcaster) {
		modCommandsEnabled = value;
		console.log(`[mod] Mod commands ${value ? "enabled" : "disabled"}`);
	}
});

function runModCommand(text, isMod, isBroadcaster = false) {
	const broadcaster = Boolean(isBroadcaster);

	if (!isMod && !broadcaster) {
		return false;
	}

	const original = String(text || "")
		.replace(/^\x01?ACTION /, "")
		.replace(/\x01$/, "")
		.trim();

	const commandParts = original.toLowerCase().split(/\s+/);
	const name = commandParts.shift();
	const args = commandParts;

	if (
		!broadcaster &&
		!modCommandsEnabled &&
		!ALWAYS_ALLOWED_MOD_COMMANDS.has(name)
	) {
		return false;
	}

	const rawArgs = original.split(/\s+/).slice(1);

	const handler = MOD_COMMANDS.get(name);

	if (!handler) {
		return false;
	}

	handler(args, rawArgs, broadcaster);

	return true;
}

function removePlatformElement(element) {
	if (!element) return;
	clearTimeout(element?._fadeTimer);
	clearTimeout(element?._removeTimer);
	if (lastRepeat?.element === element) lastRepeat = null;
	element.getAnimations().forEach((animation) => animation.cancel());
	element.remove();
	unregisterMessageIds(element);

	for (const [key, set] of userMessageElements) {
		if (set.delete(element) && set.size === 0) {
			userMessageElements.delete(key);
		}
	}
}

function removePlatformMessage(messageId) {
	if (!messageId) {
		return;
	}

	const element = messageElements.get(String(messageId));

	if (element) {
		removePlatformElement(element);
	}
}

function removePlatformUserMessages(platform, userId) {
	if (userId == null) {
		return;
	}

	const set = userMessageElements.get(`${platform}:${userId}`);

	if (!set) {
		return;
	}

	for (const element of Array.from(set)) {
		removePlatformElement(element);
	}
}

function clearPlatformMessages(platform) {
	const chat = document.getElementById("chat");

	if (!chat) {
		return;
	}

	for (const element of Array.from(chat.querySelectorAll(".message"))) {
		if (element.dataset.platform === platform) {
			removePlatformElement(element);
		}
	}
}

function checkBadgeIcon(background) {
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
		`<rect width="32" height="32" rx="16" fill="${background}"/>` +
		`<path d="M9 17l5 5 9-11" stroke="#fff" stroke-width="3.5" fill="none" ` +
		`stroke-linecap="round" stroke-linejoin="round"/></svg>`;

	return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function glyphBadgeIcon(background, shapes, radius = 6) {
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
		`<rect width="32" height="32" rx="${radius}" fill="${background}"/>` +
		`<g fill="#fff">${shapes}</g></svg>`;

	return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function createPlatformBadges(tags) {
	const container = document.createElement("span");

	container.className = "badges platform-badges";
	if (tags.platform === "tiktok" && pfpsEnabled && tags["profile-picture"]) {
		const pfpUrl = safeMediaUrl(tags["profile-picture"]);
		const pfp = pfpUrl
			? createBadge(pfpUrl, `${String(tags["display-name"] || "TikTok user").slice(0, 100)} profile picture`)
			: null;
		if (pfp) {
			pfp.classList.add("tiktok-pfp-badge");
			pfp.style.objectFit = "cover";
			pfp.style.borderRadius = "50%";
			container.appendChild(pfp);
		}
	}

	const platformBadges = Array.isArray(tags["platform-badges"])
		? tags["platform-badges"].filter(Boolean).slice(0, 20)
		: [];

	for (const badge of platformBadges) {
		const badgeUrl = safeMediaUrl(badge.url);
		const img = badgeUrl
			? createBadge(badgeUrl, String(badge.title || "").slice(0, 100))
			: null;

		if (img) {
			img.alt = String(badge.title || "").slice(0, 100);
			if (tags.platform === "tiktok" && badge.combined) {
				const item = document.createElement("span");
				item.className = "tiktok-combined-badge";
				item.style.display = "inline-flex";
				item.style.alignItems = "center";
				item.style.verticalAlign = "middle";
				item.style.position = "relative";
				item.style.overflow = "hidden";
				item.style.borderRadius = "5px";
				const dark = badge.darkBackgroundColor || badge.backgroundColor;
				const darkColor = safeCssColor(dark);
				if (darkColor) item.style.backgroundColor = darkColor;
				const background = safeMediaUrl(badge.darkBackgroundUrl || badge.backgroundUrl);
				if (background) {
					const backgroundImage = document.createElement("img");
					backgroundImage.className = "tiktok-badge-background";
					backgroundImage.src = background;
					backgroundImage.alt = "";
					backgroundImage.draggable = false;
					item.appendChild(backgroundImage);
				}
				img.classList.add("tiktok-badge-icon");
				img.alt = "";
				img.style.marginRight = "0";
				img.style.position = "relative";
				img.style.zIndex = "1";
				item.appendChild(img);
				if (badge.text) {
					const label = document.createElement("span");
					label.className = "tiktok-combined-badge-text";
					label.textContent = String(badge.text).slice(0, 50);
					label.style.color = safeCssColor(badge.textColor) || "#ffffff";
					label.title = String(badge.title || "TikTok badge").slice(0, 100);
					label.style.position = "relative";
					label.style.zIndex = "1";
					item.appendChild(label);
				}
				container.appendChild(item);
			} else {
				if (tags.platform === "tiktok") img.classList.add("tiktok-badge-icon");
				container.appendChild(img);
			}

			const fallbackUrl = safeMediaUrl(badge.fallback);

			if (fallbackUrl) {
				img.addEventListener(
					"error",
					() => {
						img.src = fallbackUrl;
					},
					{ once: true },
				);
			}

		}
	}

	return container;
}

function isCommandMessage(text) {
	return String(text || "")
		.trim()
		.startsWith("!");
}

const MAX_PLATFORM_SEGMENTS = 300;
const MAX_PLATFORM_TEXT_CHARS = 1000;
const MAX_PLATFORM_NAME_CHARS = 100;
const BLOCKED_TAG_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function sanitizePlatformSegments(segments) {
	const clean = [];
	let budget = MAX_PLATFORM_TEXT_CHARS;

	for (const segment of Array.isArray(segments) ? segments : []) {
		if (clean.length >= MAX_PLATFORM_SEGMENTS || budget <= 0) {
			break;
		}

		if (!segment || typeof segment !== "object") {
			continue;
		}

		if (segment.type === "emote") {
			const url = safeMediaUrl(segment.url);
			const name = String(segment.name ?? "").slice(0, 100);

			if (url) {
				clean.push(Object.assign({}, segment, { url, name }));
				budget -= name.length;
				continue;
			}

			if (name) {
				clean.push({ type: "text", text: name });
				budget -= name.length;
			}

			continue;
		}

		const text = String(segment.text ?? "").slice(0, budget);

		if (text) {
			clean.push(Object.assign({}, segment, { type: "text", text }));
			budget -= text.length;
		}
	}

	return clean;
}

let platformMessageQueue = null;

function getPlatformMessageQueue() {
	platformMessageQueue ??= createBoundedQueue({
		maxSize: 500,
		batchSize: 20,
		intervalMs: 50,
		handler: (job) => {
			Promise.resolve(
				onMsg(job.username, job.text, job.color, job.userId, job.tags, null, job.messageId),
			).catch((error) =>
				console.error(`${job.tags.platform} message rendering error:`, error),
			);
		},
	});

	return platformMessageQueue;
}

function emitPlatformMessage({
	platform,
	username,
	color,
	userId,
	messageId,
	segments,
	badges = [],
	extraTags = {},
}) {
	const safePlatform = /^[a-z0-9_-]{1,20}$/.test(String(platform)) ? String(platform) : "twitch";
	const safeSegments = sanitizePlatformSegments(segments);
	const safeName = String(username ?? "Unknown").slice(0, MAX_PLATFORM_NAME_CHARS);

	const text = safeSegments
		.map((segment) => (segment.type === "emote" ? segment.name : segment.text))
		.join("");

	const tags = Object.assign({
		platform: safePlatform,
		segments: safeSegments,
		emotes: "",
		gifs: "",
		badges: "",
		"platform-badges": Array.isArray(badges) ? badges.slice(0, 20) : [],
		"display-name": safeName,
		"user-id": userId,
		"is-action": false,
		"custom-reward-id": "",
	});

	for (const [key, value] of Object.entries(extraTags || {})) {
		if (BLOCKED_TAG_KEYS.has(key)) {
			continue;
		}

		if (key === "hl-color") {
			const safe = safeCssColor(value);

			if (safe) {
				tags[key] = safe;
			}

			continue;
		}

		tags[key] = typeof value === "string" ? value.slice(0, 500) : value;
	}

	getPlatformMessageQueue().push({
		username: safeName,
		text,
		color,
		userId,
		tags,
		messageId: messageId == null ? null : String(messageId).slice(0, 128),
	});
}

const PLATFORM_INDICATOR_LOGOS = {
	twitch: "logos/twitch.png",
	kick: "logos/kick.svg",
	youtube: "logos/youtube.webp",
};

const PLATFORM_INDICATOR_TITLES = {
	twitch: "Twitch",
	kick: "Kick",
	youtube: "YouTube",
};

function isMultiChat() {
	return (
		[selectedChannel, selectedKick, selectedYouTube, selectedTikTok].filter(Boolean).length > 1
	);
}

function createPlatformIndicator(platform) {
	const url = PLATFORM_INDICATOR_LOGOS[platform];

	if (!url) {
		return null;
	}

	const container = document.createElement("span");

	container.className = "badges message-badges platform-indicator";

	container.dataset.platform = platform;

	const img = document.createElement("img");

	img.className = "badge platform-indicator-badge";

	img.src = url;

	img.alt = PLATFORM_INDICATOR_TITLES[platform] || platform;

	img.title = PLATFORM_INDICATOR_TITLES[platform] || platform;

	img.draggable = false;

	img.style.width = "calc(45px * var(--badge-scale, 1))";

	img.style.height = "calc(45px * var(--badge-scale, 1))";

	img.style.objectFit = "contain";

	container.appendChild(img);

	return container;
}