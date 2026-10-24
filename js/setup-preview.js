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
