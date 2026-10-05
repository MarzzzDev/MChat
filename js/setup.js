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
		{ badges: "custommod/1,ewcgold/1", "msg-id": "highlighted-message" },
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
		"Underpaid_Actor",
		"PagMan ffzSpin",
		"#FF69B4",
		"406239629",
		{ badges: "founder/1,noob/1" },
	],
];
let currentPreviewMessage = 0;
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

	const delay = Math.random() * 1000 + 3000;

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
				grid-template-columns: repeat(5, 1fr);
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
			const warning = document.createElement("span");
			warning.className = "mc-preview-warning";
			warning.textContent = "*";

			warning.addEventListener("mouseenter", () => {
				warning.textContent = "Doesn't affect the Live Chat preview";
			});

			warning.addEventListener("mouseleave", () => {
				warning.textContent = "*";
			});

			name.appendChild(warning);
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
		"Generate the URL with the current overlay settings. Paste it into an OBS Browser Source.";
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
		showUnlisted7TV,
	);

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

	function addHighlightToggle(label, note, key, checked, color) {
		const checkbox = addToggle(hlGroup, label, note, key, checked);
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
		"Choose the font. Changes are applied to the live preview immediately.",
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

	function syncCustomFontField() {
		customFontField.style.display = fontSelect.value === "custom" ? "" : "none";
	}

	syncCustomFontField();

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

	const helpPanel = createPanel(
		"help",
		"Help",
		"Learn what MChat can do and how to use the overlay.",
		"05",
	);

	const helpFeatures = [
		"MChat is a Twitch chat overlay that works with OBS, Streamlabs, XSplit and other streaming software, integrating with emotes and badges from multiple platforms, such as 7TV, FFZ and BTTV. Chat look can be customized to your liking by adjusting the overlay settings such as the text scale, emote scale and any other preference you could ever want, and counting.",
		"7TV Paints, FFZ, BTTV and Twitch badges are supported.",
		"MChat is the only overlay that supports all effects, including FFZ and BTTV effect (ffzCursed, h!, etc)",
		"We have support for badges from every single platform available, and if there's a platform we're missing let us know!",
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
	});

	let customFontTimer = null;

	customFontInput.addEventListener("input", () => {
		clearTimeout(customFontTimer);

		customFontTimer = setTimeout(() => {
			customFontName = sanitizeFontName(customFontInput.value);
			applyChatFont();
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
		const channel = channelInput.value.trim().toLowerCase().replace(/^#/, "");
		const kickChannel = cleanKickInput(kickInput.value);
		const youtubeChannel = cleanYouTubeInput(youtubeInput.value);

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

			scale: Math.max(0.25, Math.min(Number(textScaleInput.value) || 1, 3)),

			emoteScale: Math.max(
				0.25,
				Math.min(Number(emoteScaleInput.value) || 1, 3),
			),

			wrap: wrapCheckbox.checked,

			unlisted: unlistedCheckbox.checked,

			font: fontSelect.value,

			customFont: sanitizeFontName(customFontInput.value),

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

	copyButton.addEventListener("click", async () => {
		const url = getOverlayUrl();
		if (!url) {
			return;
		}

		try {
			await navigator.clipboard.writeText(url);
		} catch {
			const textarea = document.createElement("textarea");
			textarea.value = url;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			textarea.remove();
		}

		copyButton.textContent = "Link copied";
		window.setTimeout(() => {
			copyButton.textContent = "Copy overlay link";
		}, 1500);
	});

	syncFadeState();
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