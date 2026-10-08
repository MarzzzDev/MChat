if ("serviceWorker" in navigator) navigator.serviceWorker.register("./js/sw.js");

(function preconnectHosts() {
	const apiHosts = [
		"https://7tv.io",
		"https://api.frankerfacez.com",
		"https://api.betterttv.net",
		"https://gql.twitch.tv",
	];
	const imageHosts = [
		"https://cdn.7tv.app",
		"https://static-cdn.jtvnw.net",
		"https://cdn.betterttv.net",
		"https://cdn.frankerfacez.com",
	];

	const add = (href, cors) => {
		const link = document.createElement("link");

		link.rel = "preconnect";
		link.href = href;

		if (cors) {
			link.crossOrigin = "anonymous";
		}

		(document.head || document.documentElement).appendChild(link);
	};

	apiHosts.forEach((host) => add(host, true));
	imageHosts.forEach((host) => add(host, false));
})();

const TWITCH_READY_TIMEOUT_MS = 8000;

function hideStaticLoadingText() {
	const el = document.getElementById("loading-text");

	if (!el) return;

	const box =
		el.closest("#loading, #loading-screen, .loading, .loading-screen") || el;
	box.style.display = "none";
}

function logTaskError(label, error) {
	console.error(`${label} failed to load:`, error);
}

const startedTasks = [];

function trackTask(label, run) {
	const promise = Promise.resolve()
		.then(run)
		.catch((error) => logTaskError(label, error));

	startedTasks.push(promise);

	return promise;
}

let channelDataPromise = null;

function onTwitchRoomReady() {
	if (channelDataPromise || !CHANNEL || !TWITCH_USER_ID) {
		return;
	}

	trackTask("Twitch badges", loadTwitchBadges);

	channelDataPromise = trackTask("7TV channel emotes", load7TVEmotes);

	trackTask("BTTV emotes", loadBTTVEmotes);
	trackTask("FFZ badges", loadFFZBadges);
	trackTask("Channel highlights", loadChannelHighlightData);
}

loadFFZBotBadgeList();

async function startOverlay() {
	startGithubUpdater();
	ensureEmoteScaleStyle();
	addGlobalStyle();

	if (legacySerializedRedirecting) {
		return;
	}

	if (!selectedChannel && !selectedKick && !selectedYouTube) {
		showOverlaySetupScreen();
		return;
	}

	startLoadingScreen();
	hideStaticLoadingText();

	CHANNEL = selectedChannel || null;
	hideOverlaySetupScreen();

	const ircReady = CHANNEL
		? createTwitchIRCSocket().catch((error) => {
			  console.error("Anonymous Twitch IRC startup error:", error);
			  return null;
		  })
		: Promise.resolve(null);

	const required = [trackTask("7TV global emotes", load7TVGlobalEmotes)];

	trackTask("FFZ emotes", loadFFZEmotes);
	trackTask("Chatterino badges", loadChatterinoBadges);
	trackTask("Homies badges", loadHomiesBadges);
	trackTask("BTTV badges", loadBTTVBadges);
	trackTask("DankChat badges", loadDankChatBadges);
	trackTask("Moltorino badges", loadMoltorinoBadges);

	if (selectedKick) {
		trackTask("Kick chat", () => startKickChat(selectedKick));
	}

	if (selectedYouTube) {
		startYouTubeChat(selectedYouTube).catch((error) =>
			console.error("YouTube chat startup error:", error),
		);
	}

	if (CHANNEL) {
		required.push(ircReady.then(() => channelDataPromise));
	}

	await Promise.race([
		Promise.allSettled(required),
		new Promise((resolve) => setTimeout(resolve, TWITCH_READY_TIMEOUT_MS)),
	]);

	stopLoadingScreen();

	Promise.allSettled(startedTasks).then(() =>
		console.log("Chat emotes and badge data loaded."),
	);

	console.log("Overlay channel:", CHANNEL);
	console.log("Overlay channel ID:", TWITCH_USER_ID);
	console.log("Twitch reader: anonymous IRC");

	if (selectedKick) console.log("Overlay Kick channel:", selectedKick);
	if (selectedYouTube) console.log("Overlay YouTube channel:", selectedYouTube);
}

startOverlay().catch((error) => {
	stopLoadingScreen();

	console.error("Overlay startup error:", error);
});