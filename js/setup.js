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
		{ badges: "mod/1,ewcgold/1", "msg-id": "highlighted-message" },
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

function showOverlaySetupScreen() {
	ensureEmoteScaleStyle();

	let screen = document.getElementById("overlay-setup-screen");

	if (screen) {
		return;
	}

	screen = document.createElement("div");
	screen.id = "overlay-setup-screen";

	loadGoogleFontIfNeeded("'Open Sans', sans-serif");

	const style = document.createElement("style");
	style.dataset.marzSetup = "true";
	style.textContent = `
		html:has(#overlay-setup-screen),
		body:has(#overlay-setup-screen) {
			margin: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			background: #09090b;
			scrollbar-width: none;
		}

		html:has(#overlay-setup-screen)::-webkit-scrollbar,
		body:has(#overlay-setup-screen)::-webkit-scrollbar {
			display: none;
		}

		#overlay-setup-screen {
			--mc-bg: #09090b;
			--mc-surface: #0e0e10;
			--mc-raised: #131315;
			--mc-line: #1f1f23;
			--mc-line-strong: #2e2e34;
			--mc-text: #fafafa;
			--mc-dim: #8e8e97;
			--mc-faint: #63636c;
			--mc-accent: #e8d58a;
			--mc-accent-ink: #1a1708;

			position: fixed;
			left: 0;
			top: 0;
			width: 80vw;
			height: 80vh;
			zoom: 1.25;
			z-index: 999999;
			display: grid;
			grid-template-columns: 190px minmax(340px, 430px) minmax(0, 1fr);
			grid-template-rows: 56px minmax(0, 1fr);
			background: var(--mc-bg);
			color: var(--mc-text);
			font-family: 'Open Sans', Arial, sans-serif;
			font-size: 11px;
			line-height: 1.45;

			overflow: hidden;
			overflow: clip;
			-webkit-font-smoothing: antialiased;
		}

		#overlay-setup-screen *,
		#overlay-setup-screen *::before,
		#overlay-setup-screen *::after {
			box-sizing: border-box;
		}

		#overlay-setup-screen button,
		#overlay-setup-screen input,
		#overlay-setup-screen select {
			font: inherit;
		}

		#overlay-setup-screen :focus-visible {
			outline: 2px solid var(--mc-accent);
			outline-offset: 2px;
		}

		#overlay-setup-screen .mc-topbar {
			grid-column: 1 / -1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20px;
			border-bottom: 1px solid var(--mc-line);
			background: var(--mc-surface);
		}

		#overlay-setup-screen .mc-preview-warning {
			position: relative;
			display: inline-block;
			margin-left: 4px;
			color: var(--mc-faint);
			font-size: 10px;
			font-weight: 600;
			line-height: 1;
			cursor: default;
			user-select: none;
		}

		#overlay-setup-screen .mc-brand {
			display: flex;
			align-items: center;
			gap: 12px;
			min-width: 0;
		}

		#overlay-setup-screen .mc-brand-mark {
			height: 30px;
			width: auto;
			max-width: 96px;
			display: block;
			flex: 0 0 auto;
			object-fit: contain;
		}

		#overlay-setup-screen .mc-brand-text {
			min-width: 0;
		}

		#overlay-setup-screen .mc-brand-name {
			color: var(--mc-text);
			font-size: 13px;
			font-weight: 700;
			line-height: 1.2;
		}

		#overlay-setup-screen .mc-brand-m {
			color: var(--mc-accent);
		}

		#overlay-setup-screen .mc-brand-page {
			color: var(--mc-faint);
			font-size: 10.5px;
			line-height: 1.3;
		}

		#overlay-setup-screen .mc-top-link {
			display: inline-flex;
			align-items: center;
			height: 32px;
			padding: 0 14px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			color: var(--mc-dim);
			font-size: 10.5px;
			font-weight: 600;
			text-decoration: none;
			transition: color .15s ease, border-color .15s ease;
		}

		#overlay-setup-screen .mc-top-link:hover {
			border-color: var(--mc-dim);
			color: var(--mc-text);
		}


		#overlay-setup-screen .mc-sidebar {
			min-width: 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			padding: 16px 12px;
			border-right: 1px solid var(--mc-line);
			background: var(--mc-bg);
		}

		#overlay-setup-screen .mc-nav-label {
			padding: 0 10px 8px;
			color: var(--mc-faint);
			font-size: 10.5px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-nav {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		#overlay-setup-screen .mc-nav-button {
			display: block;
			width: 100%;
			padding: 9px 10px;
			border: 0;
			border-radius: 6px;
			background: transparent;
			color: var(--mc-dim);
			text-align: left;
			cursor: pointer;
			transition: background .15s ease, color .15s ease;
		}

		#overlay-setup-screen .mc-nav-button:hover {
			background: var(--mc-surface);
			color: var(--mc-text);
		}

		#overlay-setup-screen .mc-nav-button.is-active {
			background: var(--mc-raised);
			color: var(--mc-text);
		}

		#overlay-setup-screen .mc-nav-icon {
			display: none;
		}

		#overlay-setup-screen .mc-nav-copy {
			display: block;
			min-width: 0;
		}

		#overlay-setup-screen .mc-nav-title {
			font-size: 11px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-side-spacer {
			flex: 1;
		}

		#overlay-setup-screen .mc-side-hint {
			padding: 12px 10px 0;
			border-top: 1px solid var(--mc-line);
			color: var(--mc-faint);
			font-size: 10.5px;
			line-height: 1.5;
		}

		#overlay-setup-screen .mc-controls {
			min-width: 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			background: var(--mc-surface);
			border-right: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-controls-head {
			padding: 20px 24px 16px;
			border-bottom: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-control-title {
			margin: 0;
			font-size: 16px;
			line-height: 1.25;
			font-weight: 700;
		}

		#overlay-setup-screen .mc-control-subtitle {
			margin: 4px 0 0;
			color: var(--mc-faint);
			font-size: 10.5px;
			line-height: 1.5;
		}

		#overlay-setup-screen .mc-panel-stack {
			flex: 1;
			min-height: 0;
			overflow: auto;
			padding: 20px 24px 28px;
			scrollbar-width: thin;
			scrollbar-color: var(--mc-line-strong) transparent;
		}

		#overlay-setup-screen .mc-panel {
			display: none;
		}

		#overlay-setup-screen .mc-panel.is-active {
			display: block;
		}

		#overlay-setup-screen .mc-setup-footer {
			flex: 0 0 auto;
			padding: 14px 24px 16px;
			border-top: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-feedback {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 12px;
			color: var(--mc-dim);
		}

		#overlay-setup-screen .mc-discord-icon {
			width: 20px;
			height: 20px;
			flex: 0 0 20px;
			display: grid;
			place-items: center;
			color: var(--mc-faint);
		}

		#overlay-setup-screen .mc-discord-icon svg {
			width: 20px;
			height: 20px;
			display: block;
		}

		#overlay-setup-screen .mc-feedback-copy {
			min-width: 0;
			display: flex;
			flex-direction: column;
		}

		#overlay-setup-screen .mc-feedback-label {
			color: var(--mc-faint);
			font-size: 10px;
		}

		#overlay-setup-screen .mc-feedback-link {
			color: var(--mc-text);
			font-size: 10.5px;
			font-weight: 600;
			text-decoration: none;
		}

		#overlay-setup-screen .mc-feedback-link:hover {
			text-decoration: underline;
			text-underline-offset: 2px;
		}

		#overlay-setup-screen .mc-attribution {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 4px 8px;
			color: var(--mc-faint);
			font-size: 10px;
			line-height: 1.5;
		}

		#overlay-setup-screen .mc-attribution-brand {
			color: var(--mc-dim);
			font-weight: 600;
		}

		#overlay-setup-screen .mc-attribution-separator {
			color: var(--mc-line-strong);
		}

		#overlay-setup-screen .mc-attribution-disclaimer {
			color: var(--mc-faint);
		}

		#overlay-setup-screen .mc-attribution-github,
		#overlay-setup-screen .mc-attribution-commit {
			color: var(--mc-dim);
			text-decoration: none;
		}

		#overlay-setup-screen .mc-attribution-commit {
			font-family: ui-monospace, Menlo, Consolas, monospace;
			color: var(--mc-faint);
		}

		#overlay-setup-screen .mc-attribution-github:hover,
		#overlay-setup-screen .mc-attribution-commit:hover {
			color: var(--mc-text);
			text-decoration: underline;
			text-underline-offset: 2px;
		}

		#overlay-setup-screen .mc-help-list {
			margin: 0;
			padding: 0;
			list-style: none;
		}

		#overlay-setup-screen .mc-help-item {
			margin-bottom: 6px;
			padding: 10px 12px;
			border-radius: 8px;
			background: var(--mc-raised);
			color: var(--mc-dim);
			font-size: 11px;
			line-height: 1.55;
		}

		#overlay-setup-screen .mc-help-item:first-child {
			color: var(--mc-text);
		}

		#overlay-setup-screen .mc-help-note {
			margin-top: 14px;
			color: var(--mc-faint);
			font-size: 10.5px;
		}

		#overlay-setup-screen .mc-field {
			margin-bottom: 18px;
		}

		#overlay-setup-screen .mc-field:last-child {
			margin-bottom: 0;
		}

		#overlay-setup-screen .mc-label {
			display: block;
			margin-bottom: 6px;
			color: var(--mc-dim);
			font-size: 10.5px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-input,
		#overlay-setup-screen .mc-select {
			width: 100%;
			height: 34px;
			padding: 0 11px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			background: var(--mc-bg);
			color: var(--mc-text);
			outline: none;
			font-size: 11px;
			transition: border-color .15s ease;
		}

		#overlay-setup-screen .mc-input::placeholder {
			color: var(--mc-faint);
		}

		#overlay-setup-screen .mc-input:hover,
		#overlay-setup-screen .mc-select:hover {
			border-color: #3a3a41;
		}

		#overlay-setup-screen .mc-input:focus,
		#overlay-setup-screen .mc-select:focus {
			border-color: var(--mc-accent);
		}

		#overlay-setup-screen .mc-input:disabled {
			cursor: not-allowed;
		}

		#overlay-setup-screen .mc-select {
			appearance: none;
			-webkit-appearance: none;
			padding-right: 32px;
			cursor: pointer;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right 12px center;
		}

		#overlay-setup-screen .mc-inline {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 10px;
			align-items: center;
		}

		#overlay-setup-screen .mc-divider {
			height: 1px;
			margin: 22px 0;
			background: var(--mc-line);
		}

		#overlay-setup-screen .mc-subhead {
			margin: 0 0 10px;
			color: var(--mc-text);
			font-size: 11px;
			font-weight: 700;
		}

		#overlay-setup-screen .mc-muted {
			color: var(--mc-faint);
			font-size: 10.5px;
		}

		#overlay-setup-screen .mc-two-col {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 12px;
		}

		#overlay-setup-screen .mc-range-line {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 8px;
			align-items: center;
		}

		#overlay-setup-screen .mc-unit {
			color: var(--mc-faint);
			font-size: 10.5px;
		}

		#overlay-setup-screen .mc-toggle-row {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			min-height: 46px;
			padding: 8px 12px;
			margin-bottom: 6px;
			border-radius: 8px;
			background: var(--mc-raised);
			cursor: pointer;
			user-select: none;
			transition: background .15s ease;
		}

		#overlay-setup-screen .mc-toggle-row:hover {
			background: #161618;
		}

		#overlay-setup-screen .mc-toggle-row.mc-static-row {
			cursor: default;
		}

		#overlay-setup-screen .mc-toggle-copy {
			min-width: 0;
		}

		#overlay-setup-screen .mc-toggle-title {
			color: var(--mc-text);
			font-size: 11px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-toggle-note {
			margin-top: 1px;
			color: var(--mc-faint);
			font-size: 10.5px;
			line-height: 1.4;
		}

		#overlay-setup-screen .mc-check {
			width: 1px;
			height: 1px;
			position: absolute;
			left: 0;
			top: 0;
			opacity: 0;
			pointer-events: none;
		}

		#overlay-setup-screen .mc-check:focus-visible + .mc-switch {
			outline: 2px solid var(--mc-accent);
			outline-offset: 2px;
		}

		#overlay-setup-screen .mc-switch {
			width: 34px;
			height: 20px;
			flex: 0 0 auto;
			position: relative;
			border-radius: 999px;
			background: var(--mc-line-strong);
			transition: background .15s ease;
		}

		#overlay-setup-screen .mc-switch::after {
			content: "";
			position: absolute;
			width: 16px;
			height: 16px;
			top: 2px;
			left: 2px;
			border-radius: 50%;
			background: #a1a1aa;
			transition: transform .15s ease;
		}

		#overlay-setup-screen .mc-toggle-row.is-on .mc-switch {
			background: var(--mc-accent);
		}

		#overlay-setup-screen .mc-toggle-row.is-on .mc-switch::after {
			background: var(--mc-accent-ink);
			transform: translateX(14px);
		}

		#overlay-setup-screen .mc-group {
			margin: 22px 0 18px;
			border: 1px solid var(--mc-line);
			border-radius: 10px;
			background: var(--mc-raised);
			overflow: clip;
		}

		#overlay-setup-screen .mc-group-head {
			padding: 12px 14px 10px;
			border-bottom: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-message-layout-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0 10px;
			padding: 10px 12px 0;
		}

		#overlay-setup-screen .mc-message-layout-grid > .mc-toggle-row {
			grid-column: 1 / -1;
			min-height: 40px;
			padding: 7px 10px;
			margin-bottom: 8px;
		}

		#overlay-setup-screen .mc-message-layout-grid > .mc-field {
			min-width: 0;
			margin-bottom: 6px;
		}

		#overlay-setup-screen .mc-message-layout-grid .mc-label {
			margin-bottom: 3px;
		}

		#overlay-setup-screen .mc-message-layout-grid > .mc-field.is-disabled {
			opacity: .4;
		}

		@media (max-width: 520px) {
			#overlay-setup-screen .mc-message-layout-grid {
				grid-template-columns: minmax(0, 1fr);
			}
		}

		#overlay-setup-screen .mc-group-title {
			color: var(--mc-text);
			font-size: 11px;
			font-weight: 700;
		}

		#overlay-setup-screen .mc-group-note {
			margin-top: 2px;
			color: var(--mc-faint);
			font-size: 10.5px;
		}

		#overlay-setup-screen .mc-group .mc-toggle-row {
			margin: 0;
			padding: 10px 14px;
			border-radius: 0;
			background: transparent;
			border-bottom: 1px solid var(--mc-line);
			justify-content: flex-start;
			transition: background .15s ease, box-shadow .15s ease;
		}

		#overlay-setup-screen .mc-group .mc-toggle-row:last-child {
			border-bottom: 0;
		}

		#overlay-setup-screen .mc-group .mc-toggle-row:hover {
			background: rgba(255, 255, 255, .02);
		}

		#overlay-setup-screen .mc-group .mc-toggle-row.is-on {
			box-shadow: inset 2px 0 0 var(--hc);
		}

		#overlay-setup-screen .mc-group .mc-toggle-copy {
			flex: 1;
		}

		#overlay-setup-screen .mc-group .mc-switch {
			margin-left: auto;
		}

		#overlay-setup-screen .mc-hl-icon {
			width: 28px;
			height: 28px;
			flex: 0 0 28px;
			display: grid;
			place-items: center;
			border-radius: 7px;
			font-size: 13px;
			color: var(--mc-faint);
			background: var(--mc-bg);
			transition: background .15s ease, color .15s ease;
		}

		#overlay-setup-screen .mc-toggle-row.is-on .mc-hl-icon {
			color: var(--hc);
			background: color-mix(in srgb, var(--hc) 16%, transparent);
		}

		#overlay-setup-screen .mc-platform-grid {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			justify-content: center;
			padding: 10px;
			margin: -4px 0 6px;
			border-radius: 0 0 8px 8px;
			background: var(--mc-raised);
			transition: opacity .15s ease;
		}

		#overlay-setup-screen .mc-platform-grid.is-disabled {
			opacity: .4;
		}

		#overlay-setup-screen .mc-channel-label-row {
			display: flex;
			align-items: center;
			gap: 6px;
			margin-bottom: 6px;
		}

		#overlay-setup-screen .mc-channel-label {
			margin: 0;
			color: var(--mc-dim);
			font-size: 10.5px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-channel-toggle {
			padding: 0;
			border: 0;
			background: transparent;
			color: var(--mc-dim);
			font-size: 10.5px;
			font-weight: 600;
			line-height: 1;
			cursor: pointer;
			transition: color .15s ease;
		}

		#overlay-setup-screen .mc-channel-toggle:hover {
			color: var(--mc-text);
		}

		#overlay-setup-screen .mc-channel-input-wrap {
			overflow: hidden;
			transition: opacity .18s ease, transform .18s ease;
		}

		#overlay-setup-screen .mc-channel-input-wrap.is-hidden {
			opacity: 0;
			transform: translateY(-4px);
		}

		#overlay-setup-screen .mc-channel-manager {
			display: flex;
			flex-direction: column;
			gap: 8px;
			max-height: 0;
			margin-top: 0;
			overflow: hidden;
			opacity: 0;
			transform: translateY(-5px);
			transition:
				max-height .22s ease,
				margin-top .22s ease,
				opacity .18s ease,
				transform .22s ease;
		}

		#overlay-setup-screen .mc-channel-manager.is-open {
			max-height: 140px;
			margin-top: 8px;
			opacity: 1;
			transform: translateY(0);
		}

		#overlay-setup-screen .mc-channel-row {
			display: grid;
			grid-template-columns: 28px minmax(0, 1fr);
			gap: 10px;
			align-items: center;
		}

		#overlay-setup-screen .mc-channel-logo {
			width: 22px;
			height: 22px;
			display: block;
			object-fit: contain;
		}

		#overlay-setup-screen .mc-channel-input {
			width: 100%;
			height: 34px;
			padding: 0 11px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			background: var(--mc-bg);
			color: var(--mc-text);
			outline: none;
			font-size: 11px;
		}

		#overlay-setup-screen .mc-channel-input::placeholder {
			color: var(--mc-faint);
		}

		#overlay-setup-screen .mc-channel-input:focus {
			border-color: var(--mc-accent);
		}
		#overlay-setup-screen .mc-platform-button {
			display: flex;
			flex: 0 0 auto;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 4px;
			min-width: 48px;
			height: 48px;
			padding: 4px 8px;
			border: 1px solid transparent;
			border-radius: 6px;
			background: var(--mc-bg);
			color: var(--mc-faint);
			cursor: pointer;
			user-select: none;
			transition: border-color .15s ease, background .15s ease, color .15s ease;
		}

		#overlay-setup-screen .mc-platform-button:hover {
			border-color: var(--mc-line-strong);
		}

		#overlay-setup-screen .mc-platform-button.is-active {
			border-color: var(--pc, var(--mc-accent));
			background: color-mix(in srgb, var(--pc, #e8d58a) 16%, transparent);
			color: var(--mc-text);
		}

		#overlay-setup-screen .mc-platform-button:disabled {
			cursor: not-allowed;
			pointer-events: none;
		}

		#overlay-setup-screen .mc-platform-logo {
			width: 22px;
			height: 22px;
			display: block;
			object-fit: contain;
			filter: grayscale(1);
			opacity: .5;
			transition: filter .15s ease, opacity .15s ease;
			pointer-events: none;
		}

		#overlay-setup-screen .mc-platform-button.is-active .mc-platform-logo {
			filter: none;
			opacity: 1;
		}

		#overlay-setup-screen .mc-platform-label {
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 10px;
			font-weight: 600;
			pointer-events: none;
		}

		#overlay-setup-screen .mc-color-row {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 90px;
			align-items: center;
			gap: 12px;
			padding: 8px 12px;
			margin: -4px 0 6px;
			border-radius: 0 0 8px 8px;
			background: var(--mc-raised);
			transition: opacity .15s ease;
		}

		#overlay-setup-screen .mc-color-row {
			border-top: 0 !important;
			margin-top: -4px !important;
			margin-bottom: 6px !important;
		}

		#overlay-setup-screen .mc-color-row.is-disabled {
			opacity: .4;
		}

		#overlay-setup-screen .mc-color {
			width: 90px;
			height: 28px;
			padding: 2px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			background: var(--mc-bg);
			cursor: pointer;
		}

		#overlay-setup-screen .mc-toggle-row .mc-color {
			width: 60px;
			flex: 0 0 auto;
		}

		#overlay-setup-screen .mc-color::-webkit-color-swatch-wrapper { padding: 0; }
		#overlay-setup-screen .mc-color::-webkit-color-swatch { border: 0; border-radius: 3px; }
		#overlay-setup-screen .mc-color::-moz-color-swatch { border: 0; border-radius: 3px; }

		#overlay-setup-screen .mc-range {
			width: 100%;
			height: 18px;
			margin: 0;
			accent-color: var(--mc-accent);
			cursor: pointer;
		}

		#overlay-setup-screen .mc-range:disabled {
			cursor: not-allowed;
		}

		#overlay-setup-screen .mc-percent {
			color: var(--mc-dim);
			font-size: 10.5px;
			font-weight: 600;
			text-align: right;
			font-variant-numeric: tabular-nums;
		}

		#overlay-setup-screen .mc-actions {
			display: grid;
			grid-template-columns: 1fr;
			gap: 8px;
			margin-top: 20px;
		}

		#overlay-setup-screen .mc-button {
			height: 36px;
			border: 1px solid var(--mc-accent);
			border-radius: 6px;
			background: var(--mc-accent);
			color: var(--mc-accent-ink);
			font-size: 11px;
			font-weight: 700;
			cursor: pointer;
			transition: background .15s ease, border-color .15s ease;
		}

		#overlay-setup-screen .mc-button:hover {
			background: #f0e1a2;
			border-color: #f0e1a2;
		}

		#overlay-setup-screen .mc-button-full {
			grid-column: 1 / -1;
		}

		#overlay-setup-screen .mc-footnote {
			margin-top: 10px;
			color: var(--mc-faint);
			font-size: 10.5px;
			text-align: center;
		}

		#overlay-setup-screen .mc-error {
			display: none;
			margin-top: 12px;
			padding: 10px 12px;
			border: 1px solid rgba(239, 68, 68, .35);
			border-radius: 6px;
			color: #f29a9a;
			font-size: 10.5px;
			line-height: 1.45;
		}

		#overlay-setup-screen .mc-stage {
			min-width: 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			background: var(--mc-bg);
		}

		#overlay-setup-screen .mc-stage-head {
			height: 48px;
			flex: 0 0 48px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20px;
			border-bottom: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-stage-title {
			color: var(--mc-dim);
			font-size: 11px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-stage-meta {
			display: flex;
			align-items: center;
			gap: 10px;
			color: var(--mc-faint);
			font-size: 10.5px;
		}

		#overlay-setup-screen .mc-sim-config,
		#overlay-setup-screen .mc-sim-actions,
		#overlay-setup-screen .mc-sim-tool-group {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		#overlay-setup-screen .mc-sim-tool-group + .mc-sim-tool-group {
			padding-left: 10px;
			border-left: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-stage-head.is-sim {
			height: auto;
			flex: 0 0 auto;
			flex-direction: column;
			align-items: stretch;
			gap: 10px;
			padding: 12px 20px;
		}

		#overlay-setup-screen .mc-stage-head.is-sim .mc-stage-meta {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			gap: 8px;
			align-items: start;
		}

		#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-config,
		#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-actions {
			flex-wrap: wrap;
			gap: 8px;
		}

		#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-actions {
			justify-content: space-between;
		}

		#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-actions > .mc-sim-btn.is-active {
			margin-left: auto;
		}

		#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-config {
			padding-bottom: 8px;
			border-bottom: 1px solid var(--mc-line);
		}

		#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-hint {
			order: initial;
			flex: none;
			color: var(--mc-dim);
			font-variant-numeric: tabular-nums;
			line-height: 1.45;
			text-align: left;
			white-space: normal;
		}

		@media (max-width: 520px) {
			#overlay-setup-screen .mc-stage-head.is-sim {
				padding: 10px 12px;
			}

			#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-config,
			#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-actions {
				gap: 6px;
			}
		}

		#overlay-setup-screen .mc-stage-canvas {
			position: relative;
			flex: 1;
			min-width: 0;
			min-height: 0;
			display: grid;
			place-items: center;
			padding: 24px;
			overflow: hidden;
			overflow: clip;
		}

		#overlay-setup-screen .mc-preview-frame {
			position: relative;
			width: min(760px, 100%);
			height: 100%;
			min-width: 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			overflow: hidden;
			overflow: clip;
			contain: paint;
			border: 1px solid var(--mc-line);
			border-radius: 8px;
			background: var(--mc-surface);
		}

		#overlay-setup-screen #chat.mc-preview-chat {
			position: relative;
			z-index: 2;
			width: 100%;
			height: 100%;
			flex: 1;
			min-height: 0;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			overflow-y: auto;
			padding: 12px;
			scrollbar-width: none;
			background: var(--chat-bg, transparent);
		}


		#overlay-setup-screen .mc-preview-tooltip {
			position: absolute;
			left: 50%;
			bottom: calc(100% + 7px);
			transform: translateX(-50%);
			width: max-content;
			max-width: 220px;
			padding: 6px 9px;
			border: 1px solid var(--mc-border);
			border-radius: 6px;
			background: var(--mc-panel);
			color: var(--mc-text);
			font-size: 11px;
			font-weight: 400;
			line-height: 1.3;
			white-space: normal;
			text-align: center;
			opacity: 0;
			pointer-events: none;
			visibility: hidden;
			transition: opacity 0.12s ease, visibility 0.12s ease;
			z-index: 20;
		}

		#overlay-setup-screen #chat.mc-preview-chat::-webkit-scrollbar {
			display: none;
		}

		#overlay-setup-screen #chat.mc-preview-chat > .message {
			flex: 0 0 auto;
			height: auto;
			min-height: min-content;
		}

		#overlay-setup-screen #chat.mc-preview-chat > * {
			flex-shrink: 0;
		}

		@media (max-width: 1020px) {
			#overlay-setup-screen {
				grid-template-columns: 176px minmax(320px, 380px) minmax(0, 1fr);
			}

			#overlay-setup-screen .mc-stage-canvas {
				padding: 16px;
			}
		}

		@media (max-width: 780px) {
			#overlay-setup-screen {
				grid-template-columns: 1fr;
				grid-template-rows: 56px auto minmax(320px, 1fr);
				overflow-y: auto;
			}

			#overlay-setup-screen .mc-sidebar {
				min-height: auto;
				padding: 8px 12px;
				border-right: 0;
				border-bottom: 1px solid var(--mc-line);
			}

			#overlay-setup-screen .mc-nav-label {
				display: none;
			}

			#overlay-setup-screen .mc-nav {
				display: grid;
				grid-template-columns: repeat(6, 1fr);
			}

			#overlay-setup-screen .mc-nav-button {
				padding: 9px 4px;
				text-align: center;
			}

			#overlay-setup-screen .mc-nav-title {
				font-size: 10.5px;
			}

			#overlay-setup-screen .mc-side-spacer,
			#overlay-setup-screen .mc-side-hint {
				display: none;
			}

			#overlay-setup-screen .mc-controls {
				border-right: 0;
				border-bottom: 1px solid var(--mc-line);
			}

			#overlay-setup-screen .mc-panel-stack {
				max-height: 430px;
			}

			#overlay-setup-screen .mc-stage {
				min-height: 430px;
			}
		}

		@media (max-width: 520px) {
			#overlay-setup-screen .mc-two-col {
				grid-template-columns: 1fr;
			}

			#overlay-setup-screen .mc-preview-frame {
				width: 100%;
			}
		}

		#overlay-setup-screen .mc-multichat-overlay {
			position: absolute;
			inset: 0;
			z-index: 100;
			display: grid;
			place-items: center;
			background: rgba(0, 0, 0, .58);
			backdrop-filter: blur(3px);
			-webkit-backdrop-filter: blur(3px);
			opacity: 0;
			pointer-events: none;
			transition: opacity .18s ease;
		}

		#overlay-setup-screen .mc-multichat-overlay.is-open {
			opacity: 1;
			pointer-events: auto;
		}

		#overlay-setup-screen .mc-multichat-card {
			width: min(430px, calc(100% - 40px));
			min-height: 390px;
			padding: 30px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			border: 1px solid var(--mc-line-strong);
			border-radius: 12px;
			background: var(--mc-surface);
			box-shadow: 0 24px 80px rgba(0, 0, 0, .45);
			transform: translateY(8px) scale(.98);
			transition: transform .2s ease;
		}

		#overlay-setup-screen .mc-multichat-overlay.is-open .mc-multichat-card {
			transform: translateY(0) scale(1);
		}

		#overlay-setup-screen .mc-multichat-label {
			margin-bottom: 8px;
			color: var(--mc-accent);
			font-size: 10px;
			font-weight: 700;
			letter-spacing: .14em;
			text-transform: uppercase;
		}

		#overlay-setup-screen .mc-multichat-title {
			margin: 0;
			color: var(--mc-text);
			font-size: 25px;
			font-weight: 700;
			line-height: 1.15;
		}

		#overlay-setup-screen .mc-multichat-subtitle {
			margin: 8px 0 0;
			color: var(--mc-dim);
			font-size: 12px;
			font-weight: 600;
		}

		#overlay-setup-screen .mc-multichat-platforms {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			margin: 24px 0 20px;
		}

		#overlay-setup-screen .mc-multichat-platform {
			width: 44px;
			height: 44px;
			display: grid;
			place-items: center;
			border: 1px solid var(--mc-line-strong);
			border-radius: 8px;
			background: var(--mc-bg);
		}

		#overlay-setup-screen .mc-multichat-platform img {
			width: 22px;
			height: 22px;
			display: block;
			object-fit: contain;
		}

		#overlay-setup-screen .mc-multichat-plus {
			color: var(--mc-faint);
			font-size: 14px;
			font-weight: 700;
		}

		#overlay-setup-screen .mc-multichat-text {
			max-width: 330px;
			margin: 0;
			color: var(--mc-dim);
			font-size: 11px;
			line-height: 1.65;
		}

		#overlay-setup-screen .mc-multichat-status {
			display: inline-flex;
			align-items: center;
			gap: 7px;
			margin-top: 22px;
			padding: 6px 10px;
			border: 1px solid rgba(232, 213, 138, .2);
			border-radius: 999px;
			background: rgba(232, 213, 138, .06);
			color: var(--mc-accent);
			font-size: 10px;
			font-weight: 700;
		}

		#overlay-setup-screen .mc-multichat-status-dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--mc-accent);
			box-shadow: 0 0 8px rgba(232, 213, 138, .6);
		}

		#overlay-setup-screen .mc-multichat-close {
			height: 34px;
			margin-top: 22px;
			padding: 0 18px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			background: var(--mc-raised);
			color: var(--mc-text);
			font-size: 10.5px;
			font-weight: 600;
			cursor: pointer;
			transition: background .15s ease, border-color .15s ease;
		}

		#overlay-setup-screen .mc-multichat-close:hover {
			border-color: var(--mc-dim);
			background: #18181b;
		}

		#overlay-setup-screen .mc-textarea {
			width: 100%;
			min-height: 64px;
			padding: 9px 11px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			background: var(--mc-bg);
			color: var(--mc-text);
			outline: none;
			font: inherit;
			font-size: 11px;
			resize: vertical;
			box-sizing: border-box;
		}

		#overlay-setup-screen .mc-textarea:focus {
			border-color: var(--mc-accent);
		}

		#overlay-setup-screen .mc-textarea::placeholder {
			color: var(--mc-faint);
		}

		#overlay-setup-screen .mc-chip-row {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 8px;
			min-height: 4px;
		}

		#overlay-setup-screen .mc-chip {
			padding: 4px 9px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 999px;
			background: var(--mc-raised);
			color: var(--mc-text);
			font-size: 10px;
			font-weight: 600;
			cursor: pointer;
		}

		#overlay-setup-screen .mc-chip:hover {
			border-color: var(--mc-dim);
		}

		#overlay-setup-screen .mc-sim-btn {
			height: 28px;
			padding: 0 12px;
			border: 1px solid var(--mc-line-strong);
			border-radius: 6px;
			background: var(--mc-raised);
			color: var(--mc-text);
			font-size: 10.5px;
			font-weight: 600;
			cursor: pointer;
			transition: background .15s ease, border-color .15s ease, color .15s ease;
		}

		#overlay-setup-screen .mc-sim-btn:hover {
			border-color: var(--mc-accent);
		}

		#overlay-setup-screen .mc-sim-btn.is-active {
			background: var(--mc-accent);
			border-color: var(--mc-accent);
			color: var(--mc-accent-ink);
		}

		#overlay-setup-screen .mc-stage-head {
			height: auto;
			min-height: 48px;
			flex: 0 0 auto;
			padding: 8px 20px;
			gap: 12px;
		}

		#overlay-setup-screen .mc-stage-title {
			flex: 0 0 auto;
			white-space: nowrap;
		}

		#overlay-setup-screen .mc-stage-meta {
			flex: 1 1 auto;
			min-width: 0;
			flex-wrap: wrap;
			justify-content: flex-end;
			gap: 8px;
		}

		#overlay-setup-screen .mc-stage-meta > * {
			flex: 0 0 auto;
			white-space: nowrap;
		}

		#overlay-setup-screen .mc-sim-hint {
			flex: 1 1 100% !important;
			order: 10;
			text-align: right;
			white-space: normal !important;
			font-size: 10px;
		}

		#overlay-setup-screen .mc-preview-frame.is-sim {
			flex: none;
			justify-content: flex-start;
			background: #000;
		}

		#overlay-setup-screen .mc-sim-video {
			position: absolute;
			inset: 0;
			z-index: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			background: #000;
			pointer-events: none;
		}

		#overlay-setup-screen .mc-sim-note {
			position: absolute;
			inset: 0;
			z-index: 1;
			display: none;
			place-items: center;
			padding: 24px;
			text-align: center;
			color: var(--mc-dim);
			font-size: 11px;
			background: radial-gradient(circle at 50% 40%, #1b1b20, #09090b);
			pointer-events: none;
		}

		#overlay-setup-screen .mc-sim-box {
			position: absolute;
			z-index: 3;
			cursor: move;
			touch-action: none;
			user-select: none;
			-webkit-user-select: none;
			outline: 1px dashed transparent;
		}

		#overlay-setup-screen .mc-sim-box:hover,
		#overlay-setup-screen .mc-sim-box.is-dragging {
			outline-color: var(--mc-accent);
		}

		#overlay-setup-screen .mc-sim-inner {
			transform-origin: 0 0;
			pointer-events: none;
			overflow: hidden;
			overflow: clip;
		}

		#overlay-setup-screen .mc-sim-handle {
			position: absolute;
			right: -6px;
			bottom: -6px;
			width: 13px;
			height: 13px;
			border-radius: 3px;
			background: var(--mc-accent);
			cursor: nwse-resize;
			opacity: 0;
			transition: opacity .12s ease;
		}

		#overlay-setup-screen .mc-sim-box:hover .mc-sim-handle,
		#overlay-setup-screen .mc-sim-box.is-dragging .mc-sim-handle {
			opacity: 1;
		}

		#overlay-setup-screen .mc-sim-edge {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 12px;
			cursor: ew-resize;
		}

		#overlay-setup-screen .mc-sim-edge::after {
			content: "";
			position: absolute;
			top: calc(50% - 18px);
			height: 36px;
			width: 4px;
			border-radius: 2px;
			background: var(--mc-accent);
			opacity: 0;
			transition: opacity .12s ease;
		}

		#overlay-setup-screen .mc-sim-edge-l {
			left: -6px;
		}

		#overlay-setup-screen .mc-sim-edge-l::after {
			left: 4px;
		}

		#overlay-setup-screen .mc-sim-edge-r {
			right: -6px;
		}

		#overlay-setup-screen .mc-sim-edge-r::after {
			right: 4px;
		}

		#overlay-setup-screen .mc-sim-edge-t,
		#overlay-setup-screen .mc-sim-edge-b {
			left: 0;
			right: 0;
			width: auto;
			height: 12px;
			cursor: ns-resize;
		}

		#overlay-setup-screen .mc-sim-edge-t::after,
		#overlay-setup-screen .mc-sim-edge-b::after {
			left: calc(50% - 18px);
			width: 36px;
			height: 4px;
		}

		#overlay-setup-screen .mc-sim-edge-t {
			top: -6px;
			bottom: auto;
		}

		#overlay-setup-screen .mc-sim-edge-t::after {
			top: 4px;
		}

		#overlay-setup-screen .mc-sim-edge-b {
			top: auto;
			bottom: -6px;
		}

		#overlay-setup-screen .mc-sim-edge-b::after {
			top: auto;
			bottom: 4px;
		}

		#overlay-setup-screen .mc-sim-box:hover .mc-sim-edge::after,
		#overlay-setup-screen .mc-sim-box.is-dragging .mc-sim-edge::after {
			opacity: 1;
		}

		#overlay-setup-screen .mc-sim-drag {
			display: inline-flex;
			align-items: center;
			cursor: grab;
			user-select: none;
			-webkit-user-select: none;
		}

		#overlay-setup-screen .mc-sim-drag:active {
			cursor: grabbing;
		}

		#overlay-setup-screen .mc-drag-button {
			display: grid;
			place-items: center;
			cursor: grab;
			user-select: none;
			-webkit-user-select: none;
		}

		#overlay-setup-screen .mc-drag-button:active {
			cursor: grabbing;
		}

		@media (max-width: 1020px) {
			#overlay-setup-screen .mc-stage-head.is-sim .mc-sim-hint {
				display: block !important;
			}
		}
	`;

	screen.appendChild(style);

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
			zoomViewAt(1.5, framePoint(event));
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
		zoomViewAt(1 / 1.5, framePoint(event));
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
				zoomViewAt(1.5, framePoint(event));
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

	function createPanel(id, navTitle, navDesc, icon) {
		const panel = document.createElement("section");
		panel.className = "mc-panel";
		panel.dataset.panel = id;

		const navButton = document.createElement("button");
		navButton.type = "button";
		navButton.className = "mc-nav-button";
		navButton.dataset.panel = id;

		const navIcon = document.createElement("span");
		navIcon.className = "mc-nav-icon";
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

		navButton.addEventListener("click", () => {
			for (const button of nav.querySelectorAll(".mc-nav-button")) {
				button.classList.toggle("is-active", button === navButton);
			}

			for (const otherPanel of panelStack.querySelectorAll(".mc-panel")) {
				otherPanel.classList.toggle("is-active", otherPanel === panel);
			}

			controlTitle.textContent = navTitle;
			controlSubtitle.textContent = navDesc;
		});

		return panel;
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

	// previewWarning: true uses the default text, a string uses that text.
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
		"Connection",
		"Choose the Twitch channel this overlay should read from.",
		"01",
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
	connectionSub.textContent = "Browser source";
	connectionPanel.appendChild(connectionSub);

	const connectionText = document.createElement("div");
	connectionText.className = "mc-muted";
	connectionText.textContent =
		"Drag the button below into the OBS preview and confirm the prompt. OBS adds the overlay as a browser source with your current settings. If you used Simulate, it also gets the size and scale from there.";
	connectionText.style.lineHeight = "1.55";
	connectionPanel.appendChild(connectionText);

	const appearancePanel = createPanel(
		"appearance",
		"Appearance",
		"Control any setting of the appearance to your liking.",
		"02",
	);

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

	const gifsCheckbox = addToggle(
		appearancePanel,
		"GIFs",
		"Show Twitch GIFs in chat messages.",
		"gifs",
		gifsEnabled,
	);
	const botsCheckbox = addToggle(
		appearancePanel,
		"Bots",
		"Show bot messages and commands in chat.",
		"bots",
		botsEnabled,
	);
	const platformIndicatorCheckbox = addToggle(
		appearancePanel,
		"Show Platform Indicator",
		"Show which platform each message came from when multichat is active.",
		"platformIndicator",
		platformIndicatorEnabled,
		"Preview isn't a multichat, so no indicator shows",
	);
	const highlightsCheckbox = addToggle(
		appearancePanel,
		"Highlights",
		"Highlight usernames with the 7TV Paint/Color",
		"highlights",
		highlightsEnabled,
		true
	);
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

	const typographyPanel = createPanel(
		"typography",
		"Typography",
		"Tune the shared style or set username and message typography separately.",
		"03",
	);

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

	addField(typographyPanel, "Emote scale", emoteScaleInput);

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

	const gifScaleInput = document.createElement("input");
	gifScaleInput.type = "number";
	gifScaleInput.className = "mc-input";
	gifScaleInput.min = "0.25";
	gifScaleInput.max = "3";
	gifScaleInput.step = "0.05";
	gifScaleInput.value = String(gifScale);

	addField(typographyPanel, "GIF scale", gifScaleInput);

	const uppercaseCheckbox = addToggle(
		typographyPanel,
		"All uppercase",
		"Convert usernames, messages and replies to uppercase.",
		"uppercase",
		uppercaseEnabled,
	);

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

	const timingPanel = createPanel(
		"timing",
		"Timing",
		"Tune message lifetime and fading behavior.",
		"04",
	);

	const filtersPanel = createPanel(
		"filters",
		"Filters",
		"Hide messages containing words, or messages from specific users and bots.",
		"05",
	);

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

	const helpPanel = createPanel(
		"help",
		"Help",
		"Learn what MChat can do and how to use the overlay.",
		"06",
	);

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

	connectionPanel.appendChild(actions);
	connectionPanel.appendChild(error);

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

	activatePanel("connection");

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

	gifsCheckbox.addEventListener("change", () => {
		gifsEnabled = gifsCheckbox.checked;
		rerenderPreviewChat();
	});
	botsCheckbox.addEventListener("change", () => {
		botsEnabled = botsCheckbox.checked;
		rerenderPreviewChat();
	});
	platformIndicatorCheckbox.addEventListener("change", () => {
		platformIndicatorEnabled = platformIndicatorCheckbox.checked;
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

			gifs: gifsCheckbox.checked,

			bots: botsCheckbox.checked,

			platformIndicator: platformIndicatorCheckbox.checked,

			highlights: highlightsCheckbox.checked,

			hlFirst: hlFirstCheckbox.checked,

			hlRedeems: hlRedeemsCheckbox.checked,

			hlGifts: hlGiftsCheckbox.checked,

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

			badgeScale: Number(badgeScaleInput.value) / 100,

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