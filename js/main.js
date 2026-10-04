const LOADING_TASKS = [
    { label: "7TV global emotes", run: load7TVGlobalEmotes },
    { label: "7TV channel emotes", run: load7TVEmotes },
    { label: "FFZ emotes", run: loadFFZEmotes },
    { label: "BTTV emotes", run: loadBTTVEmotes },
    { label: "Twitch badges", run: loadTwitchBadges },
    { label: "FFZ badges", run: loadFFZBadges },
    { label: "Chatterino badges", run: loadChatterinoBadges },
    { label: "Homies badges", run: loadHomiesBadges }
];

loadFFZBotBadgeList();

async function startOverlay() {
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

    try {
        await createTwitchIRCSocket();
    } catch (error) {
        console.error(
            "Anonymous Twitch IRC startup error:",
            error
        );
        return;
    }

    await runLoadingTasks(LOADING_TASKS);

    console.log("Chat emotes and badge data loaded.");
    console.log("Overlay channel:", CHANNEL);
    console.log("Overlay channel ID:", TWITCH_USER_ID);
    console.log("Twitch reader: anonymous IRC");
}

startOverlay()
    .catch(error => {
        console.error(
            "Overlay startup error:",
            error
        );
    });
