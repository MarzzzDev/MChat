if ("serviceWorker" in navigator) navigator.serviceWorker.register("./js/sw.js");

const LOADING_TASKS = [
	{ label: "", run: load7TVGlobalEmotes },
	{ label: "", run: load7TVEmotes },
	{ label: "", run: loadFFZEmotes },
	{ label: "", run: loadBTTVEmotes },
	{ label: "", run: loadTwitchBadges },
	{ label: "", run: loadFFZBadges },
	{ label: "", run: loadChatterinoBadges },
	{ label: "", run: loadHomiesBadges },
	{ label: "", run: loadBTTVBadges },
	{ label: "", run: loadDankChatBadges },
	{ label: "", run: loadMoltorinoBadges },
	{ label: "", run: loadChannelHighlightData },
];

let loadingAnimationInterval = null;

function startLoadingAnimation() {
	const loadingElement = document.getElementById("loading-text");

	if (!loadingElement) return;

	let dots = 1;

	loadingElement.textContent = "Loading.";

	loadingAnimationInterval = setInterval(() => {
		dots++;

		if (dots > 3) {
			dots = 1;
		}

		loadingElement.textContent = "Loading" + ".".repeat(dots);
	}, 500);
}

function stopLoadingAnimation() {
	if (loadingAnimationInterval) {
		clearInterval(loadingAnimationInterval);
		loadingAnimationInterval = null;
	}
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

	CHANNEL = selectedChannel || null;
	hideOverlaySetupScreen();

	if (CHANNEL) {
		try {
			await createTwitchIRCSocket();
		} catch (error) {
			console.error("Anonymous Twitch IRC startup error:", error);

			if (!selectedKick && !selectedYouTube) {
				return;
			}
		}
	}

	const tasks = [...LOADING_TASKS];

	if (selectedKick) {
		tasks.push({ label: "Kick chat", run: () => startKickChat(selectedKick) });
	}

	if (selectedYouTube) {
		startYouTubeChat(selectedYouTube).catch((error) =>
			console.error("YouTube chat startup error:", error),
		);
	}

	await runLoadingTasks(tasks);

	console.log("Chat emotes and badge data loaded.");
	console.log("Overlay channel:", CHANNEL);
	console.log("Overlay channel ID:", TWITCH_USER_ID);
	console.log("Twitch reader: anonymous IRC");

	if (selectedKick) console.log("Overlay Kick channel:", selectedKick);
	if (selectedYouTube) console.log("Overlay YouTube channel:", selectedYouTube);
}

startOverlay().catch((error) => {
	stopLoadingAnimation();

	console.error("Overlay startup error:", error);
});