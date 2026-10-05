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

  if (!selectedChannel) {
    showOverlaySetupScreen();
    return;
  }

  CHANNEL = selectedChannel;
  hideOverlaySetupScreen();

  try {
    await createTwitchIRCSocket();
  } catch (error) {
    console.error("Anonymous Twitch IRC startup error:", error);
    return;
  }

  await runLoadingTasks(LOADING_TASKS);

  console.log("Chat emotes and badge data loaded.");
  console.log("Overlay channel:", CHANNEL);
  console.log("Overlay channel ID:", TWITCH_USER_ID);
  console.log("Twitch reader: anonymous IRC");
}

startOverlay().catch((error) => {
  stopLoadingAnimation();

  console.error("Overlay startup error:", error);
});
