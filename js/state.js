let CHANNEL = null;
let TWITCH_USER_ID = null;

let twitchIRCSocket = null;
let twitchIRCReconnectTimer = null;
let twitchIRCBuffer = "";
let twitchIRCReadyPromise = null;
let twitchIRCReadyResolve = null;
let twitchIRCReadyReject = null;

const sevenTVEmotes = new Map();
const sevenTVUsers = new Map();

const sevenTVPersonalEmotes = new Map();
const sevenTVUserIdToUsername = new Map();

const twitchBadges = new Map();
const ffzBadges = new Map();
const chatterinoBadges = new Map();
const sevenTVBadges = new Map();

const ffzRoomBadges = {
	vip: null,
	moderator: null,
};

const twitchEmotes = new Map();
const ffzEmotes = new Map();
const bttvEmotes = new Map();

const externalBadgeCache = new Map();
const externalBadgePromises = new Map();
const badgeImageCache = new Map();

const sevenTVColors = new Map();
const sevenTVColorPromises = new Map();

const SEVENTV_EMOTE_FLAGS = Object.freeze({
	ZERO_WIDTH: 256,
});

const ffzEffects = new Map([
	["ffzX", { effects: ["flipX"] }],
	["ffzY", { effects: ["flipY"] }],
	["ffzW", { effects: ["growX"] }],
	["ffzShrinkX", { effects: ["shrinkX"] }],
	["ffzRainbow", { effects: ["rainbow"] }],
	["ffzHyperRed", { effects: ["hyperRed"] }],
	["ffzShake", { effects: ["shake"] }],
	["ffzCursed", { effects: ["cursed"] }],
	["ffzJam", { effects: ["jam"] }],
	["ffzBounce", { effects: ["bounce"] }],
	["ffzSlide", { effects: ["slide"] }],
	["ffzArrive", { effects: ["appear"] }],
	["ffzLeave", { effects: ["leave"] }],
	["ffzSpin", { effects: ["rotate"] }],
	["ffzPhotocopy", { effects: ["photocopy"] }],
	["FlipX", { effects: ["flipX"] }],
	["FlipY", { effects: ["flipY"] }],
	["GrowX", { effects: ["growX"] }],
	["ShrinkX", { effects: ["shrinkX"] }],
	["Rainbow", { effects: ["rainbow"] }],
	["HyperRed", { effects: ["hyperRed"] }],
	["HyperShake", { effects: ["shake"] }],
	["Cursed", { effects: ["cursed"] }],
	["Jam", { effects: ["jam"] }],
	["Bounce", { effects: ["bounce"] }],
	["Slide", { effects: ["slide"] }],
	["Appear", { effects: ["appear"] }],
	["Leave", { effects: ["leave"] }],
	["Rotate", { effects: ["rotate"] }],
	["Photocopy", { effects: ["photocopy"] }],
]);

const FFZ_EFFECT_FLAGS = Object.freeze({
	HIDDEN: 1,
	GROW_X: 8,
	RAINBOW: 2048,
	HYPER_RED: 4096,
	HYPER_SHAKE: 8192,
	CURSED: 16384,
	JAM: 32768,
	BOUNCE: 65536,
});
function showLoadingIndicator() {
	loadGoogleFontIfNeeded("'Open Sans', sans-serif");

	const indicator = document.createElement("div");

	indicator.id = "overlay-loading-indicator";

	indicator.style.cssText = `
		position: fixed;
		inset: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		gap: 16px;
		padding: 24px;

		color: #ffffff;

		font-family:
			'Open Sans',
			Arial,
			sans-serif;

		font-size: 34px;
		font-weight: 700;
		line-height: 1.25;
		text-align: center;

		text-shadow:
			0 3px 14px
			rgba(0, 0, 0, .85);

		pointer-events: none;
		z-index: 999999;
	`;

	const logo = document.createElement("img");

	logo.src = "waga.gif";

	logo.alt = "Waga";

	logo.draggable = false;

	logo.style.cssText = `
		display: block;

		width: auto;
		height: 86px;
		max-width: min(220px, 60vw);

		object-fit: contain;

		filter:
			drop-shadow(
				0 5px 14px
				rgba(0, 0, 0, .8)
			);
	`;

	const text = document.createElement("div");

	text.id = "overlay-loading-text";

	text.style.cssText = `
		font-family:
			'Open Sans',
			Arial,
			sans-serif;

		font-weight: 700;

		text-shadow:
			0 3px 14px
			rgba(0, 0, 0, .85);
	`;

	indicator.appendChild(logo);
	indicator.appendChild(text);

	document.body.appendChild(indicator);

	return indicator;
}

const ffzBotBadgeUsers = new Set();

async function loadFFZBotBadgeList() {
	try {
		const response = await fetch("https://api.frankerfacez.com/v1/badge/bot");

		if (!response.ok) {
			throw new Error(`FFZ bot badge list: ${response.status}`);
		}

		const data = await response.json();

		for (const login of Object.values(data.users || {}).flat()) {
			ffzBotBadgeUsers.add(
				String(login || "")
					.trim()
					.toLowerCase(),
			);
		}

		console.log(`Loaded ${ffzBotBadgeUsers.size} FFZ-badged bots.`);
	} catch (error) {
		console.error("FFZ bot badge list error:", error);
	}
}

function isKnownBot(login) {
	login = String(login || "")
		.trim()
		.toLowerCase();
	return ffzBotBadgeUsers.has(login);
}

let loadingIndicator = null;
let loadingIndicatorTimer = null;
let loadingScreenWanted = false;

function startLoadingScreen() {
	loadingScreenWanted = true;

	if (loadingIndicator) {
		return;
	}

	if (!document.body) {
		document.addEventListener(
			"DOMContentLoaded",
			() => {
				if (loadingScreenWanted) {
					startLoadingScreen();
				}
			},
			{ once: true },
		);

		return;
	}

	const indicator = showLoadingIndicator();
	const loadingText = indicator.querySelector("#overlay-loading-text");
	let dots = 1;

	loadingIndicator = indicator;

	if (loadingText) {
		loadingText.textContent = "Loading.";
	}

	loadingIndicatorTimer = setInterval(() => {
		if (!loadingText) {
			return;
		}

		dots = (dots % 3) + 1;
		loadingText.textContent = "Loading" + ".".repeat(dots);
	}, 500);
}

function stopLoadingScreen() {
	loadingScreenWanted = false;

	clearInterval(loadingIndicatorTimer);
	loadingIndicatorTimer = null;

	if (loadingIndicator) {
		loadingIndicator.remove();
		loadingIndicator = null;
	}
}

async function runLoadingTasks(tasks) {
	await Promise.allSettled(
		tasks.map((task) =>
			Promise.resolve()
				.then(() => task.run())
				.catch((error) => {
					console.error(`${task.label} failed to load:`, error);
				}),
		),
	);
}

let twemojiReady = null;

const messageElements = new Map();
const userMessageElements = new Map();

const params = new URLSearchParams(window.location.search);

let KICK_CHANNEL = null;
let KICK_CHATROOM_ID = null;
let KICK_USER_ID = null;
let kickSubscriberBadges = [];

const sevenTVKickEmotes = new Map();
const sevenTVGlobalEmotes = new Map();
let sevenTVKickEmoteSetId = null;

const bttvGlobalEmotes = new Map();
const ffzGlobalEmotes = new Map();
let KICK_CHANNEL_ID = null;