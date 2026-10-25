if ("serviceWorker" in navigator) navigator.serviceWorker.register("./js/sw.js");

const CHANNEL_ID_KEY = "mchat-channel-id:";

function getCachedChannelId(login) {
	try {
		return localStorage.getItem(CHANNEL_ID_KEY + String(login).toLowerCase());
	} catch {
		return null;
	}
}

function cacheChannelId(login, id) {
	try {
		localStorage.setItem(CHANNEL_ID_KEY + String(login).toLowerCase(), String(id));
	} catch {}
}

async function resolveTwitchChannelId(login) {
	const safe = String(login || "").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

	if (!safe) {
		return null;
	}

	const data = await twitchGraphQL(`query { user(login: "${safe}") { id } }`);

	return data?.user?.id ? String(data.user.id) : null;
}

let resolveChannelData;
const channelDataReady = new Promise((resolve) => {
	resolveChannelData = resolve;
});

function startChannelIdLookup() {
	const cachedId = getCachedChannelId(CHANNEL);

	if (cachedId) {
		TWITCH_USER_ID = cachedId;
		onTwitchRoomReady();
		return;
	}

	resolveTwitchChannelId(CHANNEL)
		.then((id) => {
			if (id && !TWITCH_USER_ID) {
				TWITCH_USER_ID = id;
				cacheChannelId(CHANNEL, id);
				onTwitchRoomReady();
			}
		})
		.catch(() => {});
}

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

const TWITCH_READY_TIMEOUT_MS = 3000;

function hideStaticLoadingText() {
	const loadingText = document.getElementById("loading-text");

	if (!loadingText) return;

	const box =
		loadingText.closest("#loading, #loading-screen, .loading, .loading-screen") || loadingText;
	box.style.display = "none";
}

function logTaskError(label, error) {
	console.error(`${label} failed to load:`, error);
}

const startedTasks = [];

function trackTask(label, run) {
	const promise = Promise.resolve()
		.then(run)
		.catch((error) => logTaskError(label, error))

	startedTasks.push(promise);

	return promise;
}

let channelDataPromise = null;

function onTwitchRoomReady() {
	if (channelDataPromise || !CHANNEL || !TWITCH_USER_ID) {
		return;
	}

	channelDataPromise = trackTask("7TV channel emotes", load7TVEmotes);
	channelDataPromise.then(resolveChannelData, resolveChannelData);

	trackTask("Twitch badges", loadTwitchBadges);
	trackTask("BTTV emotes", loadBTTVEmotes);
	trackTask("FFZ badges", loadFFZBadges);
	trackTask("Channel highlights", loadChannelHighlightData);
}

loadFFZBotBadgeList();

async function startOverlay() {
	if (location.hostname === "mchat.marz.lol" && params.get("combo") === "1") {
		const comboUrl = new URL(location.href);
		comboUrl.hostname = "combos.marz.lol";
		comboUrl.pathname = "/";
		location.replace(comboUrl.href);
		return;
	}

	startGithubUpdater();
	ensureEmoteScaleStyle();
	addGlobalStyle();

	const startedAt = performance.now();

	CHANNEL = selectedChannel || null;
	hideOverlaySetupScreen();

	loadTwemoji().catch(() => {});

	if (CHANNEL) {
		startChannelIdLookup();
	}

	if (params.get("combo") === "1") {
		await startComboOverlay();
		return;
	}

	if (legacySerializedRedirecting) {
		return;
	}

	if (!selectedChannel && !selectedKick && !selectedYouTube) {
		if (location.hostname === "combos.marz.lol") {
			document.title = "Emote Combos · MChat";
			const canonical = document.querySelector('link[rel="canonical"]');

			if (canonical) {
				canonical.href = "https://combos.marz.lol/";
			}
		}

		showOverlaySetupScreen();
		if (location.hostname === "combos.marz.lol") {
			showComboMenu();
		}
		return;
	}

	applyStoredOptionOverrides();

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
		required.push(channelDataReady, ircReady);
	}

	await Promise.race([
		Promise.allSettled(required),
		new Promise((resolve) => setTimeout(resolve, TWITCH_READY_TIMEOUT_MS)),
	]);

	stopLoadingScreen();
	startEmoteRefreshLoop();
	console.log(`Overlay ready in ${Math.round(performance.now() - startedAt)}ms`);
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
