const LOADING_TASKS = [
    { label: "7TV global emotes", run: load7TVGlobalEmotes },
    { label: "7TV channel emotes", run: load7TVEmotes },
    { label: "FFZ emotes", run: loadFFZEmotes },
    { label: "BTTV emotes", run: loadBTTVEmotes },
    { label: "Twitch badges", run: loadTwitchBadges },
    { label: "FFZ badges", run: loadFFZBadges },
    { label: "Chatterino badges", run: loadChatterinoBadges },
    { label: "Homies badges", run: loadHomiesBadges },
    { label: "BTTV badges", run: loadBTTVBadges },
    { label: "DankChat badges", run: loadDankChatBadges },
    { label: "Moltorino badges", run: loadMoltorinoBadges },
    { label: "Channel rewards", run: loadChannelHighlightData },
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

    if (!selectedChannel) {
        showOverlaySetupScreen();
        return;
    }

    CHANNEL = selectedChannel;
    hideOverlaySetupScreen();

    startLoadingAnimation();

    try {
        await createTwitchIRCSocket();
    } catch (error) {
        stopLoadingAnimation();

        console.error(
            "Anonymous Twitch IRC startup error:",
            error
        );

        return;
    }

    await runLoadingTasks(LOADING_TASKS);

    stopLoadingAnimation();

    console.log("Chat emotes and badge data loaded.");
    console.log("Overlay channel:", CHANNEL);
    console.log("Overlay channel ID:", TWITCH_USER_ID);
    console.log("Twitch reader: anonymous IRC");
}

startOverlay()
    .catch(error => {
        stopLoadingAnimation();

        console.error(
            "Overlay startup error:",
            error
        );
    });