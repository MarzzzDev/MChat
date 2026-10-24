const HL_FIRST_MESSAGE_COLOR = "#c832c8";
const HL_FIRST_MESSAGE_LABEL = "First Message";
const HL_REDEEM_COLOR = "rgba(69, 164, 179, 0.75)";
const HL_REDEEM_FALLBACK_LABEL = "Channel Point Redeem";
const HL_REDEEM_BACKGROUND = "rgba(80, 160, 170, 0.35)";
const HL_OPACITY_PERCENT = 10;
const HL_DEFAULT_ACCENT = "#755ebc";

const channelRewards = new Map();

const HL_GIFT_ICON =
	'<svg viewBox="0 0 20 20" fill="currentColor">' +
	'<path fill-rule="evenodd" clip-rule="evenodd" ' +
	'd="M16 6h2v6h-1v6H3v-6H2V6h2V4.793c0-2.507 3.03-3.762 4.803-1.99.131.131.249.275.352.429L10 4.5l.845-1.268a2.81 2.81 0 01.352-.429C12.969 1.031 16 2.286 16 4.793V6zM6 4.793V6h2.596L7.49 4.341A.814.814 0 006 4.793zm8 0V6h-2.596l1.106-1.659a.814.814 0 011.49.451zM16 8v2h-5V8h5zm-1 8v-4h-4v4h4zM9 8v2H4V8h5zm0 4H5v4h4v-4z"></path>' +
	"</svg>";

const HL_MASS_GIFT_IMAGE =
	"https://static-cdn.jtvnw.net/subs-image-assets/gift-illus.png";

const HL_PIN_ICON =
	'<svg viewBox="0 0 20 20" fill="currentColor">' +
	'<path fill-rule="evenodd" clip-rule="evenodd" ' +
	'd="M13.5 1.5l5 5-1.6.8-2.9 2.9c.4 1.3.2 2.7-.5 3.9l-.4.6-3.3-3.3L5.4 15l-.4.4-1.4-1.4.4-.4 4.6-4.4-3.3-3.3.6-.4c1.2-.7 2.6-.9 3.9-.5l2.9-2.9.8-1.6z"></path>' +
	"</svg>";

const HL_SUB_ICON =
	'<svg viewBox="0 0 20 20" fill="currentColor">' +
	'<path d="M10 1.5l2.6 5.8 6.3.6-4.7 4.2 1.3 6.2L10 15.1l-5.5 3.2 1.3-6.2-4.7-4.2 6.3-.6z"></path>' +
	"</svg>";

const HL_RAID_ICON =
	'<svg viewBox="0 0 20 20" fill="currentColor">' +
	'<path d="M7 2a3 3 0 100 6 3 3 0 000-6zM1 17c0-3.3 2.7-6 6-6s6 2.7 6 6zM14 4a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM14.500 11c2.500.2 4.500 2.300 4.500 5h-4c0-1.900-.5-3.500-1.500-4.700.3-.2.700-.3 1-.3z"></path>' +
	"</svg>";

const HL_STREAK_ICON =
	'<svg viewBox="0 0 20 20" fill="currentColor">' +
	'<path d="M10 1.500C10.500 5 6 6.500 6 11.500a4 4 0 008 0c0-2-1-3.200-2-4.500-.2 1.200-.8 2-1.500 2.300.4-2.500-.2-5.500-.5-7.800z"></path>' +
	"</svg>";

const HL_ANNOUNCE_TITLE = "Announcement";

const HL_ANNOUNCE_COLORS = {
	PRIMARY: "primary",
	BLUE: "blue",
	GREEN: "green",
	ORANGE: "orange",
	PURPLE: "purple",
};

const HL_ANNOUNCE_ICON =
	'<svg viewBox="0 0 20 20" fill="currentColor">' +
	'<path fill-rule="evenodd" clip-rule="evenodd" ' +
	'd="M11 14l7 4V2l-7 4H4a2 2 0 00-2 2v4a2 2 0 002 2h2v4h2v-4h3zm1-6.268l4-2.286v9.108l-4-2.286V7.732zM10 12H4V8h6v4z"></path>' +
	"</svg>";

function addHighlightStyles() {
	if (document.getElementById("hl-style")) {
		return;
	}

	const style = document.createElement("style");
	style.id = "hl-style";

	style.textContent = `
		:root {
			--hl-k: 3.85;
			--hl-rem: calc(10px * var(--hl-k));
			--hl-accent: ${HL_DEFAULT_ACCENT};
			--hl-accent-2: #bf94ff;
			--hl-muted: #999;
			--hl-link: #bf94ff;
			--hl-bleed: 18px;
			--hl-card-text-scale: 0.8;
		}

		.message.has-highlight,
		.message.hl-card {
			align-self: stretch;
			width: auto;
			max-width: none;
			margin-left: calc(-1 * var(--hl-bleed));
			margin-right: calc(-1 * var(--hl-bleed));
		}

		.message.has-highlight {
			position: relative;
			box-sizing: border-box;
			margin-top: 0;
			margin-bottom: var(--message-spacing);
			padding:
				var(--hl-rem)
				calc(0.75 * var(--hl-rem))
				calc(0.5 * var(--hl-rem));
			border: calc(0.25 * var(--hl-rem)) solid var(--hl-color);
			border-top: none;
			border-bottom: none;
			border-radius: 0;
			background-color: var(--hl-dim);
		}

		.message.has-highlight > .hl-label {
			position: absolute;
			top: calc(0.1 * var(--hl-rem));
			right: calc(0.75 * var(--hl-rem));
			color: var(--hl-color);
			font-family: var(--chat-font);
			font-size: calc(0.88 * var(--hl-rem));
			font-weight: 600;
			line-height: 1;
			text-transform: uppercase;
			letter-spacing: normal;
			pointer-events: none;
			-webkit-text-stroke: 0;
		}

		.message.hl-card {
			display: block !important;
			box-sizing: border-box;
			border-radius: 0;
			overflow-wrap: anywhere;
			padding:
				calc(0.3 * var(--hl-rem))
				calc(1 * var(--hl-rem))
				calc(0.3 * var(--hl-rem))
				calc(1 * var(--hl-rem));
		}

		.message.hl-card .text {
			font-weight: 600;
			font-size: calc(var(--message-font-size, 50px) * var(--hl-card-text-scale, 0.8));
		}

		.message.hl-card .hl-bold {
			font-weight: 900;
		}

		.message.hl-gift {
			margin-top: 0;
			margin-bottom: var(--message-spacing);
			border-left: calc(0.4 * var(--hl-rem)) solid var(--hl-accent);
			background-color: hsla(0, 0%, 50%, 0.1);
		}

		.hl-gift-part {
			display: flex;
		}

		.hl-gift-icon {
			display: flex;
			flex-shrink: 0;
			padding-right: calc(0.9 * var(--hl-rem));
			margin: auto 0;
			color: var(--text-color);
		}

		.hl-gift-icon svg {
			width: calc(20px * var(--hl-k));
			height: calc(16px * var(--hl-k));
			fill: currentColor;
		}

		.hl-gift-icon img {
			display: block;
			height: calc(20px * var(--hl-k));
			width: auto;
		}

		.hl-gift-text {
			margin-left: calc(0.25 * var(--hl-rem));
		}

		.hl-gift-gifter {
			display: inline;
			margin-right: 0.3em;
		}

		.hl-gift-gifter .hl-gift-name {
			display: inline !important;
		}

		.hl-gift-gifter .hl-gift-name-big {
			display: inline !important;
			font-size: calc(var(--message-font-size, 50px) * var(--hl-card-text-scale, 0.8) * 1.2) !important;
		}

		.hl-gift-gifter .badges {
			vertical-align: middle;
		}

		.message.has-highlight.hl-announce {
			--hl-announce-bar: calc(0.8 * var(--hl-rem));
			--hl-announce-x: calc(1.2 * var(--hl-rem));
			--hl-announce-gradient: linear-gradient(var(--hl-accent), var(--hl-accent));
			display: block;
			isolation: isolate;
			padding: 0 var(--hl-announce-x) calc(0.5 * var(--hl-rem));
			border-style: solid;
			border-color: transparent;
			border-width: 0 var(--hl-announce-bar);
			border-image: var(--hl-announce-gradient) 1;
			background-color: hsla(0, 0%, 50%, 0.05);
			overflow-wrap: anywhere;
		}

		.message.has-highlight.hl-announce-blue {
			--hl-announce-gradient: linear-gradient(#00d6d6, #9146ff);
		}

		.message.has-highlight.hl-announce-green {
			--hl-announce-gradient: linear-gradient(#00db84, #57bee6);
		}

		.message.has-highlight.hl-announce-orange {
			--hl-announce-gradient: linear-gradient(#ffb31a, #e0e000);
		}

		.message.has-highlight.hl-announce-purple {
			--hl-announce-gradient: linear-gradient(#9146ff, #ff75e6);
		}

		html.hl-no-accent .message.has-highlight.hl-announce-primary {
			--hl-announce-gradient: linear-gradient(#9146ff, #ff75e6);
		}

		.message.hl-announce::before {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: -1;
			background: var(--hl-announce-gradient);
			opacity: 0.12;
			pointer-events: none;
		}

		.hl-announce-header {
			display: flex;
			align-items: center;
			margin: 0 calc(-1 * var(--hl-announce-x)) calc(0.5 * var(--hl-rem));
			padding:
				calc(0.5 * var(--hl-rem))
				calc(0.5 * var(--hl-rem))
				calc(0.5 * var(--hl-rem))
				var(--hl-rem);
			background-color: hsla(0, 0%, 50%, 0.15);
		}

		.hl-announce-icon {
			display: inline-flex;
			padding: 0 calc(0.5 * var(--hl-rem));
			color: var(--text-color);
		}

		.hl-announce-icon svg {
			width: calc(18px * var(--hl-k));
			height: calc(20px * var(--hl-k));
			fill: currentColor;
		}

		.hl-announce-header .hl-announce-title {
			font-weight: 600;
		}

		.message.has-highlight.hl-announce-primary {
			--hl-a1: var(--hl-accent);
			--hl-a2: var(--hl-accent-2);
			--hl-announce-gradient: linear-gradient(var(--hl-a1), var(--hl-a2));
			--hl-announce-bar: calc(0.4 * var(--hl-rem));
			--hl-announce-x: calc(1.4 * var(--hl-rem));
			background-color: hsla(0, 0%, 8%, 0.55);
		}

		html.hl-no-accent .message.has-highlight.hl-announce-primary {
			--hl-a1: #9146ff;
			--hl-a2: #ff75e6;
		}

		.message.hl-announce-primary::before {
			background: linear-gradient(115deg, var(--hl-a1), var(--hl-a2));
			opacity: 0.22;
		}

		.hl-announce-primary .hl-announce-header {
			position: relative;
			isolation: isolate;
			margin-bottom: calc(0.6 * var(--hl-rem));
			padding-top: calc(0.6 * var(--hl-rem));
			padding-bottom: calc(0.6 * var(--hl-rem));
			background-color: transparent;
		}

		.hl-announce-primary .hl-announce-header::before {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: -1;
			background: linear-gradient(90deg, var(--hl-a1), var(--hl-a2));
			opacity: 0.45;
		}

		.hl-announce-primary .hl-announce-header .hl-announce-title {
			font-size: calc(0.9 * var(--hl-rem));
			font-weight: 800;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.hl-event-message {
			display: block;
			margin-top: calc(0.25 * var(--hl-rem));
			overflow-wrap: anywhere;
		}

		.hl-event-message .text {
			font-weight: 600;
		}

		#pin-slot {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 20;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: calc(0.3 * var(--hl-rem));
			padding: 18px 18px 0;
			zoom: var(--chat-scale);
			filter: var(--shadow-filter, );
			pointer-events: none;
		}

		body.has-pin #chat {
			padding-top: calc(var(--pin-h, 0px) + 10px);
		}

		.hl-pin {
			box-sizing: border-box;
			margin: 0 calc(-1 * var(--hl-bleed));
			padding:
				calc(0.5 * var(--hl-rem))
				calc(2 * var(--hl-rem))
				calc(0.5 * var(--hl-rem))
				calc(1.6 * var(--hl-rem));
			border-left: calc(0.4 * var(--hl-rem)) solid #00f26b;
			background-color: rgba(24, 24, 27, 0.95);
			overflow-wrap: anywhere;
		}

		.hl-pin-header {
			display: flex;
			align-items: center;
			margin-bottom: calc(0.25 * var(--hl-rem));
			color: var(--hl-muted);
		}

		.hl-pin-icon {
			display: inline-flex;
			flex-shrink: 0;
			margin-right: calc(0.5 * var(--hl-rem));
		}

		.hl-pin-icon svg {
			width: calc(16px * var(--hl-k));
			height: calc(16px * var(--hl-k));
			fill: currentColor;
		}

		.hl-pin-header .hl-pin-label {
			margin-right: calc(0.35 * var(--hl-rem));
			color: inherit;
			font-size: calc(0.85 * var(--hl-rem));
			font-weight: 600;
		}

		.hl-pin-user {
			display: inline-flex;
			align-items: center;
		}

		.hl-pin-user .badges {
			margin-right: calc(0.2 * var(--hl-rem));
		}

		.hl-pin-header .badge:not(.platform-indicator-badge) {
			width: calc(30px * var(--badge-scale, 1)) !important;
			height: calc(30px * var(--badge-scale, 1)) !important;
			min-width: calc(30px * var(--badge-scale, 1)) !important;
			min-height: calc(30px * var(--badge-scale, 1)) !important;
			max-width: calc(30px * var(--badge-scale, 1)) !important;
			max-height: calc(30px * var(--badge-scale, 1)) !important;
		}

		.hl-pin-header .hl-pin-name {
			font-size: calc(0.85 * var(--hl-rem));
			font-weight: 700;
		}

		.hl-pin-body .text {
			font-weight: 600;
		}

		.message-cards #chat > .message.has-highlight {
			margin-left: 0;
			margin-right: 0;
			border-radius: var(--message-card-radius);
			overflow: hidden;
		}

		.message-cards #chat > .message.has-highlight::after {
			content: "";
			position: absolute;
			inset: 0;
			box-sizing: border-box;
			border: var(--message-card-border-width) var(--message-card-border-style) var(--message-card-border-color);
			border-radius: var(--message-card-radius);
			pointer-events: none;
			z-index: 3;
		}

	`;

	(document.head || document.documentElement).appendChild(style);
}

addHighlightStyles();

function hlShiftHex(hex, degrees) {
	const value = String(hex).replace(/^#/, "");
	const red = parseInt(value.slice(0, 2), 16) / 255;
	const g = parseInt(value.slice(2, 4), 16) / 255;
	const b = parseInt(value.slice(4, 6), 16) / 255;
	const max = Math.max(red, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;

	let h = 0;
	let saturation = 0;

	if (d !== 0) {
		saturation = d / (1 - Math.abs(2 * l - 1));

		if (max === red) {
			h = ((g - b) / d) % 6;
		} else if (max === g) {
			h = (b - r) / d + 2;
		} else {
			h = (red - g) / d + 4;
		}

		h *= 60;
	}

	const hue = (((h + degrees) % 360) + 360) % 360;
	const sat = Math.max(saturation, 0.55);
	const light = Math.min(Math.max(l, 0.5), 0.72);

	const c = (1 - Math.abs(2 * light - 1)) * sat;
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = light - c / 2;

	const [rp, gp, bp] =
		hue < 60
			? [c, x, 0]
			: hue < 120
				? [x, c, 0]
				: hue < 180
					? [0, c, x]
					: hue < 240
						? [0, x, c]
						: hue < 300
							? [x, 0, c]
							: [c, 0, x];

	return (
		"#" +
		[rp, gp, bp]
			.map((channel) =>
				Math.round((channel + m) * 255)
					.toString(16)
					.padStart(2, "0"),
			)
			.join("")
	);
}

function hlHexAlpha(percent) {
	const alpha = Math.min(1, Math.max(0, Number(percent) / 100));

	return Math.ceil(255 * alpha)
		.toString(16)
		.padStart(2, "0")
		.toUpperCase();
}

function hlEl(tag, className, text) {
	const element = document.createElement(tag);

	if (className) {
		element.className = className;
	}

	if (text != null) {
		element.textContent = text;
	}

	return element;
}

function hlText(text, extraClass = "") {
	return hlEl("span", `text ${extraClass}`.trim(), text);
}

function hlResolveChatter(name, info = {}) {
	const lower = String(name || "").toLowerCase();
	const login = String(info.login || name || "").toLowerCase();
	const known = knownChatters.get(lower) || knownChatters.get(login) || {};

	return {
		color: getTwitchDisplayColor(info.color || known.color, login),
		userId: info.userId ?? known.userId ?? null,
		platform: info.platform || known.platform || "twitch",
		badges: info.badges || known.badges || "",
		platformBadges: info.platformBadges || known.platformBadges || null,
	};
}

function hlNameEl(name, className = "", info = {}) {
	const element = hlEl("span", `text ${className}`.trim(), name);

	if (info.plain) {
		element.style.setProperty("color", "var(--hl-link)");

		return element;
	}

	const chatter = hlResolveChatter(name, info);

	element.style.setProperty("color", chatter.color);
	element.style.webkitTextFillColor = chatter.color;

	if (chatter.userId && typeof get7TVPaint === "function") {
		Promise.resolve(get7TVPaint(chatter.userId, chatter.platform))
			.then((paint) => {
				if (paint && element.isConnected !== false) {
					applyPaint(element, paint);
				}
			})
			.catch(() => {});
	}

	return element;
}

function hlBadgesEl(name, info = {}) {
	if (!badgesEnabled || info.plain) {
		return null;
	}

	const chatter = hlResolveChatter(name, info);

	const element =
		chatter.platform === "twitch"
			? createTwitchBadges({ badges: chatter.badges })
			: createPlatformBadges({ "platform-badges": chatter.platformBadges || [] });

	if (!element.children.length) {
		return null;
	}

	element.classList.add("message-badges");

	return element;
}

function hlNameLine(name, className, info = {}) {
	const line = hlEl("div", "hl-gift-gifter");
	const badges = hlBadgesEl(name, info);

	if (badges) {
		line.appendChild(badges);
	}

	line.appendChild(hlNameEl(name, className, info));

	return line;
}

function hlTierLabel(plan) {
	const value = String(plan || "");

	if (value.toLowerCase() === "prime") {
		return "Prime";
	}

	const tier = value.charAt(0);

	return tier ? `Tier ${tier}` : "Tier 1";
}

const hlPins = new Map();

let hlPinSlot = null;
let hlPinObserver = null;

function hlEnsurePinSlot() {
	if (hlPinSlot && hlPinSlot.isConnected) {
		return hlPinSlot;
	}

	hlPinSlot = document.createElement("div");
	hlPinSlot.id = "pin-slot";

	document.body.appendChild(hlPinSlot);

	if (typeof ResizeObserver === "function") {
		hlPinObserver = new ResizeObserver(hlSyncPinHeight);
		hlPinObserver.observe(hlPinSlot);
	}

	return hlPinSlot;
}

function hlSyncPinHeight() {
	const zoom = Number(scale) > 0 ? Number(scale) : 1;

	const height =
		hlPinSlot && hlPins.size
			? hlPinSlot.getBoundingClientRect().height / zoom
			: 0;

	document.documentElement.style.setProperty("--pin-h", `${height}px`);
	document.body.classList.toggle("has-pin", height > 0);
}

function hlParseTime(value) {
	if (value == null || value === "") {
		return null;
	}

	const number = Number(value);

	if (Number.isFinite(number)) {
		return number < 1e12 ? number * 1000 : number;
	}

	const parsed = Date.parse(String(value));

	return Number.isFinite(parsed) ? parsed : null;
}

const hlTwitchUserCache = new Map();

function hlLookupTwitchUser(key, byId) {
	const cacheKey = `${byId ? "id" : "login"}:${String(key).toLowerCase()}`;

	if (hlTwitchUserCache.has(cacheKey)) {
		return hlTwitchUserCache.get(cacheKey);
	}

	const url = `https://api.ivr.fi/v2/twitch/user?${byId ? "id" : "login"}=${encodeURIComponent(key)}`;

	const attempt = async (fetcher) => {
		const response = await fetcher(url);

		if (!response.ok) {
			throw new Error(`IVR user lookup: ${response.status}`);
		}

		return response.json();
	};

	const promise = attempt(fetch)
		.catch(() => attempt(platformFetch))
		.then((data) => {
			const user = Array.isArray(data) ? data[0] : data;

			if (!user) {
				return null;
			}

			return {
				color: user.chatColor || "",
				userId: user.id != null ? String(user.id) : null,
				badges: (Array.isArray(user.badges) ? user.badges : [])
					.map((badge) => `${badge.setID}/${badge.version}`)
					.join(","),
			};
		})
		.catch(() => null);

	hlTwitchUserCache.set(cacheKey, promise);

	return promise;
}

function hlWithRoleBadge(badges, userId) {
	const current = String(badges || "");

	if (/(^|,)(broadcaster|moderator)\//.test(current)) {
		return current;
	}

	const role =
		userId && TWITCH_USER_ID && String(userId) === String(TWITCH_USER_ID)
			? "broadcaster/1"
			: "moderator/1";

	return current ? `${role},${current}` : role;
}

function hlHidePin(platform) {
	const entry = hlPins.get(platform);

	if (!entry) {
		return;
	}

	clearTimeout(entry.timer);
	entry.element.remove();
	hlPins.delete(platform);
	hlSyncPinHeight();
}

function hlShowPin({
	platform = "twitch",
	id = null,
	username,
	color,
	userId = null,
	text = "",
	tags = {},
	pinnedBy = "",
	endsAt = null,
}) {
	if (!pinsEnabled || !username) {
		return;
	}

	hlHidePin(platform);

	const pinTags = Object.assign({}, tags, {
		platform,
		"display-name": username,
		"user-id": userId,
	});

	const card = hlEl("div", "hl-pin");

	card.dataset.platform = platform;

	if (id) {
		card.dataset.pinId = String(id);
	}

	const pinner =
		typeof pinnedBy === "string" ? { name: pinnedBy } : pinnedBy || {};

	const header = hlEl("div", "hl-pin-header");
	const icon = hlEl("div", "hl-pin-icon");

	icon.insertAdjacentHTML("beforeend", HL_PIN_ICON);

	header.append(
		icon,
		hlText(pinner.name ? "Pinned by" : "Pinned message", "hl-pin-label"),
	);

	if (pinner.name) {
		const user = hlEl("span", "hl-pin-user");

		header.appendChild(user);

		const fillPinner = (info) => {
			const resolved = Object.assign({}, info, { platform });

			if (platform === "twitch") {
				resolved.badges = hlWithRoleBadge(
					resolved.badges || hlResolveChatter(pinner.name, resolved).badges,
					resolved.userId || hlResolveChatter(pinner.name, resolved).userId,
				);
			}

			const pinnerBadges = hlBadgesEl(pinner.name, resolved);

			user.replaceChildren();

			if (pinnerBadges) {
				user.appendChild(pinnerBadges);
			}

			user.appendChild(hlNameEl(pinner.name, "hl-pin-name", resolved));
		};

		fillPinner(Object.assign({}, pinner));

		const known = hlResolveChatter(pinner.name, Object.assign({}, pinner, { platform }));
		const knownChatter = knownChatters.has(String(pinner.name).toLowerCase());

		if (platform === "twitch" && !pinner.color && !knownChatter) {
			const byId = Boolean(pinner.userId);
			const key = pinner.userId || pinner.login || pinner.name;

			hlLookupTwitchUser(key, byId).then((found) => {
				if (found && card.isConnected) {
					fillPinner(Object.assign({}, pinner, {
						color: pinner.color || found.color,
						userId: pinner.userId || found.userId || known.userId,
						badges: pinner.badges || found.badges,
					}));
				}
			});
		}
	}

	const body = hlEl("div", "hl-pin-body");

	const badges = badgesEnabled
		? platform === "twitch"
			? createTwitchBadges(pinTags)
			: createPlatformBadges(pinTags)
		: document.createElement("span");

	badges.classList.add("message-badges");

	const author = hlEl("span", "message-author");
	const name = hlEl("span", "username", `${username}:\u00A0`);

	name.style.color = color;
	name.style.webkitTextFillColor = color;

	author.append(badges, name);

	if (userId && typeof get7TVPaint === "function") {
		get7TVPaint(userId, platform)
			.then((paint) => {
				if (paint && card.isConnected) {
					applyPaint(name, paint);
				}
			})
			.catch(() => {});
	}

	body.append(author, renderMessageText(text, pinTags, username));
	card.append(header, body);

	hlEnsurePinSlot().appendChild(card);

	const entry = { element: card, timer: null, id };

	const endTime = hlParseTime(endsAt);

	if (endTime) {
		entry.timer = setTimeout(
			() => hlHidePin(platform),
			Math.max(0, endTime - Date.now()),
		);
	}

	hlPins.set(platform, entry);
	hlSyncPinHeight();
}

let hlPubSub = null;
let hlPubSubPing = null;
let hlPubSubRetry = null;
let hlPubSubChannel = null;
let hlPubSubDisabled = false;

function startTwitchPins() {
	if (
		!pinsEnabled ||
		!TWITCH_USER_ID ||
		hlPubSubDisabled ||
		hlPubSubChannel === String(TWITCH_USER_ID)
	) {
		return;
	}

	hlPubSubChannel = String(TWITCH_USER_ID);

	connectPinPubSub();
}

function connectPinPubSub() {
	clearTimeout(hlPubSubRetry);

	const socket = new WebSocket("wss://pubsub-edge.twitch.tv/v1");

	hlPubSub = socket;

	socket.onopen = () => {
		socket.send(
			JSON.stringify({
				type: "LISTEN",
				data: { topics: [`pinned-chat-updates-v1.${hlPubSubChannel}`] },
			}),
		);

		clearInterval(hlPubSubPing);

		hlPubSubPing = setInterval(() => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ type: "PING" }));
			}
		}, 240000);
	};

	socket.onmessage = (event) => {
		try {
			handlePinPubSub(JSON.parse(event.data), socket);
		} catch (error) {
			console.warn("Twitch pin message error:", error);
		}
	};

	socket.onerror = () => {};

	socket.onclose = () => {
		clearInterval(hlPubSubPing);

		if (hlPubSub !== socket) {
			return;
		}

		hlPubSub = null;

		if (!hlPubSubDisabled) {
			hlPubSubRetry = setTimeout(connectPinPubSub, 5000);
		}
	};
}

function hlPinEmoteTag(fragments) {
	const groups = new Map();

	let offset = 0;

	for (const fragment of Array.isArray(fragments) ? fragments : []) {
		const text = String(fragment?.text || "");

		const emoteId =
			fragment?.content?.emoteID ??
			fragment?.content?.emoteId ??
			fragment?.emoteID ??
			fragment?.emote?.id ??
			null;

		if (emoteId != null && text) {
			const key = String(emoteId);

			if (!groups.has(key)) {
				groups.set(key, []);
			}

			groups.get(key).push(`${offset}-${offset + text.length - 1}`);
		}

		offset += text.length;
	}

	return Array.from(groups, ([emoteId, ranges]) => `${emoteId}:${ranges.join(",")}`).join("/");
}

function hlPinBadgeTag(badges) {
	if (typeof badges === "string") {
		return badges;
	}

	return (Array.isArray(badges) ? badges : [])
		.map((badge) => {
			const set = badge?.id ?? badge?.setID ?? badge?.set_id;
			const version = badge?.version ?? badge?.versionID ?? "1";

			return set ? `${set}/${version}` : "";
		})
		.filter(Boolean)
		.join(",");
}

function handlePinPubSub(message, socket) {
	if (message?.type === "RECONNECT") {
		socket.close();
		return;
	}

	if (message?.type === "RESPONSE" && message.error) {
		console.warn("Twitch pins unavailable:", message.error);

		hlPubSubDisabled = true;
		socket.close();

		return;
	}

	if (message?.type !== "MESSAGE") {
		return;
	}

	const inner = JSON.parse(message.data?.message || "{}");
	const kind = String(inner?.type || "").toLowerCase();
	const data = inner?.data || {};

	if (kind.includes("unpin")) {
		hlHidePin("twitch");
		return;
	}

	if (!kind.includes("pin") && !kind.includes("update")) {
		return;
	}

	const pinned = data.message || data.pinned_message || data;
	const sender = pinned.sender || data.sender || {};
	const content = pinned.content || {};
	const fragments = content.fragments || pinned.fragments || [];

	const text =
		content.text ??
		pinned.text ??
		fragments.map((fragment) => fragment?.text || "").join("");

	const login = String(sender.login || sender.display_name || "").toLowerCase();

	const username =
		sender.display_name || sender.displayName || sender.login || "";

	hlShowPin({
		platform: "twitch",
		id: data.id || pinned.id || null,
		username,
		color: getTwitchDisplayColor(sender.chat_color || sender.color, login),
		userId: sender.id != null ? String(sender.id) : null,
		text,
		tags: {
			emotes: hlPinEmoteTag(fragments),
			badges: hlPinBadgeTag(sender.badges),
		},
		pinnedBy: (() => {
			const by = data.pinned_by || data.pinnedBy || {};

			return {
				name: by.display_name || by.displayName || by.login || "",
				login: by.login || "",
				userId: by.id != null ? String(by.id) : null,
				color: by.chat_color || by.color || "",
				badges: hlPinBadgeTag(by.badges),
			};
		})(),
		endsAt: data.ends_at ?? data.endsAt ?? null,
	});
}

function hlAppendToChat(element) {
	const chat = document.getElementById("chat");

	if (!chat) {
		return;
	}

	if (typeof placeInChat === "function") {
		placeInChat(chat, element);
	} else {
		chat.appendChild(element);
	}

	lastRepeat = null;

	if (typeof fade === "number" && Number.isFinite(fade)) {
		setTimeout(
			() => {
				element.style.animation = "messageFadeOut 1s ease-in forwards";

				setTimeout(() => {
					element.remove();
				}, 1000);
			},
			Math.max(0, fade * 1000 - 1000),
		);
	}
}

function applyHighlight(message, color, label, background = null) {
	message.classList.add("has-highlight");
	message.style.setProperty("--hl-color", color);
	message.style.setProperty(
		"--hl-dim",
		background || color + hlHexAlpha(HL_OPACITY_PERCENT),
	);

	if (label) {
		const labelElement = hlEl("div", "hl-label", label);
		message.insertBefore(labelElement, message.firstChild);
	}
}

function applyRewardHighlight(message, tags) {
	const reward = channelRewards.get(String(tags["custom-reward-id"] || ""));

	const label =
		reward?.title ||
		tags["hl-label"] ||
		(tags["msg-id"] === "highlighted-message"
			? "Highlight My Message"
			: HL_REDEEM_FALLBACK_LABEL);

	applyHighlight(message, HL_REDEEM_COLOR, label, HL_REDEEM_BACKGROUND);
}

function applyAnnouncementHighlight(message, tags) {
	const key = String(tags["msg-param-color"] || "PRIMARY").toUpperCase();
	const color = HL_ANNOUNCE_COLORS[key] || "primary";

	message.classList.add("has-highlight", "hl-announce", `hl-announce-${color}`);

	const header = hlEl("div", "hl-announce-header");
	const icon = hlEl("div", "hl-announce-icon");

	icon.insertAdjacentHTML("beforeend", HL_ANNOUNCE_ICON);
	header.append(icon, hlText(HL_ANNOUNCE_TITLE, "hl-announce-title"));

	message.insertBefore(header, message.firstChild);
}

function applyMessageHighlights(message, tags, displayName) {
	if (tags["msg-id"] === "announcement") {
		applyAnnouncementHighlight(message, tags);
		return;
	}

	if (tags["hl-kind"] === "paid" && tags["hl-label"]) {
		if (hlGiftsEnabled) {
			applyHighlight(
				message,
				tags["hl-color"] || HL_REDEEM_COLOR,
				tags["hl-label"],
				tags["hl-background"] || null,
			);
		}

		return;
	}

	const isRedeem =
		Boolean(tags["custom-reward-id"]) ||
		tags["msg-id"] === "highlighted-message";

	if (isRedeem && hlRedeemsEnabled) {
		applyRewardHighlight(message, tags);
		return;
	}

	if (hlFirstEnabled && String(tags["first-msg"]) === "1") {
		applyHighlight(message, HL_FIRST_MESSAGE_COLOR, HL_FIRST_MESSAGE_LABEL);
	}
}
function createSubGiftCard({ gifter, plan, recipient, tier, gifterInfo = {}, recipientInfo = {} }) {
	const tierText = tier === undefined ? hlTierLabel(plan) : tier;
	const card = hlEl("div", "message hl-card hl-gift");
	const part = hlEl("div", "hl-gift-part");

	const icon = hlEl("div", "hl-gift-icon");
	icon.insertAdjacentHTML("beforeend", HL_GIFT_ICON);

	const body = hlEl("div", "hl-gift-text");

	body.append(
		hlNameLine(gifter, "hl-bold hl-gift-name", gifterInfo),
		hlText("Gifted a "),
	);
	if (tierText) {
		body.append(hlText(tierText, "hl-bold"), hlText(" "));
	}
	body.append(hlText("Sub to "), hlNameEl(recipient, "hl-bold", recipientInfo));

	part.append(icon, body);
	card.appendChild(part);

	return card;
}

function createMassGiftCard({ gifter, plan, count, senderCount, tier, gifterInfo = {} }) {
	const tierText = tier === undefined ? hlTierLabel(plan) : tier;
	const card = hlEl("div", "message hl-card hl-gift");
	const part = hlEl("div", "hl-gift-part");

	const icon = hlEl("div", "hl-gift-icon");
	const image = document.createElement("img");
	image.src = HL_MASS_GIFT_IMAGE;
	image.alt = "mystery gift";
	image.draggable = false;
	icon.appendChild(image);

	const body = hlEl("div", "hl-gift-text");

	const subWord = count > 1 ? "Subs" : "Sub";

	body.append(
		hlNameLine(gifter, "hl-bold hl-gift-name-big", gifterInfo),
		hlText(`${['is gifting', count, tierText, subWord].filter(Boolean).join(' ')}. `),
	);

	if (senderCount > 0) {
		body.appendChild(
			hlText(
				senderCount === count
					? "It's their first Gift Sub in the channel!"
					: `They've gifted a total of ${senderCount} Subs in the channel!`,
			),
		);
	}

	part.append(icon, body);
	card.appendChild(part);

	return card;
}

function createNoticeCard({ name, text, platform }) {
	const card = hlEl("div", "message hl-card hl-gift");
	const part = hlEl("div", "hl-gift-part");

	const icon = hlEl("div", "hl-gift-icon");
	icon.insertAdjacentHTML("beforeend", HL_GIFT_ICON);

	const body = hlEl("div", "hl-gift-text");

	body.append(
		hlNameLine(name, "hl-bold hl-gift-name", platform ? { platform } : {}),
		hlText(text),
	);

	part.append(icon, body);
	card.appendChild(part);

	return card;
}

function appendNoticeCard(options) {
	if (!hlGiftsEnabled) {
		return;
	}

	hlAppendToChat(createNoticeCard(options));
}

function hlGifterInfo(tags) {
	const anonymous = hlGifterName(tags) === "Anonymous";

	return {
		plain: anonymous,
		platform: "twitch",
		color: tags.color || "",
		userId: tags["user-id"] || null,
		login: tags.login || "",
		badges: tags.badges || "",
	};
}

function hlGifterName(tags) {
	const anonymous =
		String(tags["msg-id"] || "").startsWith("anon") ||
		String(tags.login || "").toLowerCase() === "ananonymousgifter";

	if (anonymous) {
		return "Anonymous";
	}

	return tags["display-name"] || tags.login || "Someone";
}

function hlEventInfo(tags, login) {
	return {
		platform: "twitch",
		color: tags.color || "",
		userId: tags["user-id"] || null,
		login: login || tags.login || "",
		badges: tags.badges || "",
	};
}

function createEventCard({ icon, name, info = {}, parts = [], message = "", tags = {} }) {
	const card = hlEl("div", "message hl-card hl-gift");
	const part = hlEl("div", "hl-gift-part");

	const iconElement = hlEl("div", "hl-gift-icon");
	iconElement.insertAdjacentHTML("beforeend", icon);

	const body = hlEl("div", "hl-gift-text");

	body.append(hlNameLine(name, "hl-bold hl-gift-name", info));
	for (const part of parts) {
		body.appendChild(part);
	}

	const text = String(message || "").trim();

	if (text) {
		const messageElement = hlEl("div", "hl-event-message");

		messageElement.appendChild(renderMessageText(text, tags, name));
		body.appendChild(messageElement);
	}

	part.append(iconElement, body);
	card.appendChild(part);

	return card;
}

function createSubCard(tags, message = "") {
	const name = tags["display-name"] || tags.login || "Someone";
	const isResub = tags["msg-id"] === "resub";
	const plan = String(tags["msg-param-sub-plan"] || "1000");
	const isPrime = plan.toLowerCase() === "prime";

	const months =
		Number(tags["msg-param-cumulative-months"] || tags["msg-param-months"]) || 1;

	const streak = Number(tags["msg-param-streak-months"]) || 0;
	const shareStreak = String(tags["msg-param-should-share-streak"]) === "1";
	const multiMonth = Number(tags["msg-param-multimonth-duration"]) || 0;

	const parts = [
		hlText(`${isResub ? "Resubscribed" : "Subscribed"} ${isPrime ? "with" : "at"} `),
		hlText(hlTierLabel(plan), "hl-bold"),
		hlText("."),
	];

	if (multiMonth > 1) {
		parts.push(
			hlText(" Subscribed for "),
			hlText(`${multiMonth} months`, "hl-bold"),
			hlText(" in advance."),
		);
	}

	if (months > 1) {
		parts.push(
			hlText(" They've subscribed for "),
			hlText(`${months} months`, "hl-bold"),
		);

		if (shareStreak && streak > 1) {
			parts.push(
				hlText(", currently on a "),
				hlText(`${streak} month`, "hl-bold"),
				hlText(" streak"),
			);
		}

		parts.push(hlText("!"));
	}

	return createEventCard({
		icon: HL_SUB_ICON,
		name,
		info: hlEventInfo(tags),
		parts,
		message,
		tags,
	});
}

function createRaidCard(tags) {
	const name =
		tags["msg-param-displayName"] ||
		tags["display-name"] ||
		tags["msg-param-login"] ||
		tags.login ||
		"Someone";

	const count = Number(tags["msg-param-viewerCount"]) || 0;

	return createEventCard({
		icon: HL_RAID_ICON,
		name,
		info: hlEventInfo(tags, tags["msg-param-login"]),
		parts: [
			hlText("Raided with "),
			hlText(`${count.toLocaleString()} ${count === 1 ? "viewer" : "viewers"}`, "hl-bold"),
			hlText("!"),
		],
		tags,
	});
}

function createWatchStreakCard(tags, message = "") {
	const name = tags["display-name"] || tags.login || "Someone";
	const streams = Number(tags["msg-param-value"]) || 0;
	const reward = Number(tags["msg-param-copoReward"]) || 0;

	const parts = [
		hlText("Watched "),
		hlText(`${streams} consecutive ${streams === 1 ? "stream" : "streams"}`, "hl-bold"),
		hlText(" and sparked a watch streak!"),
	];

	if (reward > 0) {
		parts.push(
			hlText(" "),
			hlText(`+${reward.toLocaleString()}`, "hl-bold"),
			hlText(" channel points"),
		);
	}

	return createEventCard({
		icon: HL_STREAK_ICON,
		name,
		info: hlEventInfo(tags),
		parts,
		message,
		tags,
	});
}

function handleTwitchIRCUsernotice(message) {
	const tags = message.tags || {};
	const msgId = tags["msg-id"];
	const trailing = message.trailing || "";

	if (msgId === "subgift" || msgId === "anonsubgift") {
		if (!hlGiftsEnabled || tags["msg-param-community-gift-id"]) {
			return;
		}

		hlAppendToChat(
			createSubGiftCard({
				gifter: hlGifterName(tags),
				gifterInfo: hlGifterInfo(tags),
				plan: tags["msg-param-sub-plan"],
				recipient:
					tags["msg-param-recipient-display-name"] ||
					tags["msg-param-recipient-user-name"] ||
					"someone",
				recipientInfo: {
					platform: "twitch",
					userId: tags["msg-param-recipient-id"] || null,
					login: tags["msg-param-recipient-user-name"] || "",
				},
			}),
		);

		return;
	}

	if (msgId === "submysterygift" || msgId === "anonsubmysterygift") {
		if (!hlGiftsEnabled) {
			return;
		}

		const count = Number(tags["msg-param-mass-gift-count"]) || 1;

		hlAppendToChat(
			createMassGiftCard({
				gifter: hlGifterName(tags),
				gifterInfo: hlGifterInfo(tags),
				plan: tags["msg-param-sub-plan"],
				count,
				senderCount: Number(tags["msg-param-sender-count"]) || 0,
			}),
		);

		return;
	}

	if (msgId === "sub" || msgId === "resub") {
		if (hlSubsEnabled) {
			hlAppendToChat(createSubCard(tags, trailing));
		}

		return;
	}

	if (msgId === "raid") {
		if (hlRaidsEnabled) {
			hlAppendToChat(createRaidCard(tags));
		}

		return;
	}

	if (
		msgId === "viewermilestone" &&
		String(tags["msg-param-category"]).toLowerCase() === "watch-streak"
	) {
		if (hlStreaksEnabled) {
			hlAppendToChat(createWatchStreakCard(tags, trailing));
		}
	}
}

async function loadChannelHighlightData() {
	if (!TWITCH_USER_ID) {
		return;
	}

	const userId = JSON.stringify(String(TWITCH_USER_ID));

	startTwitchPins();

	try {
		const data = await twitchGraphQL(
			`query { user(id: ${userId}) { primaryColorHex } }`,
		);

		const hex = data?.user?.primaryColorHex;

		if (/^[0-9a-f]{6}$/i.test(hex || "")) {
			document.documentElement.style.setProperty("--hl-accent", `#${hex}`);
			document.documentElement.style.setProperty(
				"--hl-accent-2",
				hlShiftHex(hex, 40),
			);
			document.documentElement.classList.remove("hl-no-accent");
		} else {
			document.documentElement.classList.add("hl-no-accent");
		}
	} catch (error) {
		console.warn("Channel accent color unavailable:", error);
	}

	try {
		const data = await twitchGraphQL(
			`query { user(id: ${userId}) { channel { communityPointsSettings { customRewards { id title cost } } } } }`,
		);

		const rewards = data?.user?.channel?.communityPointsSettings?.customRewards;

		for (const reward of Array.isArray(rewards) ? rewards : []) {
			if (reward?.id) {
				channelRewards.set(String(reward.id), {
					title: reward.title,
					cost: reward.cost,
				});
			}
		}

		console.log(`Loaded ${channelRewards.size} channel point rewards.`);
	} catch (error) {
		console.warn("Channel point rewards unavailable:", error);
	}
}
