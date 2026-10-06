const GITHUB_REPO = "MarzzzDev/MChat";
const GITHUB_BRANCH = "main";
const UPDATE_POLL_MS = 300 * 1000;
const UPDATE_REFRESH_DELAY_MS = 10 * 1000;

const OVERLAY_FILES = [
    "",
    "index.html",
    "state.js",
    "styles.js",
    "irc.js",
    "platforms.js",
    "kick.js",
    "youtube.js",
    "seventv.js",
    "twitch-data.js",
    "badges.js",
    "emotes.js",
    "rendering.js",
    "settings.js",
    "setup.js",
    "main.js",
    "privacy.html",
    "proxy.js",
    "highlights.js",
    "style.css"
];

let lastKnownCommitSha = null;
let updateRefreshScheduled = false;

async function checkForGithubCommit() {
    if (updateRefreshScheduled) return;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/commits/${GITHUB_BRANCH}`,
            {
                headers: { Accept: "application/vnd.github+json" },
                cache: "no-cache",
            },
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const sha = (await response.json())?.sha;
        if (!sha) return;

        if (lastKnownCommitSha === null) {
            lastKnownCommitSha = sha;
            console.log("[updater] Watching commit", sha.slice(0, 7));
            return;
        }

        if (sha !== lastKnownCommitSha) {
            console.log(
                `[updater] New commit ${sha.slice(0, 7)} detected, refreshing in ${UPDATE_REFRESH_DELAY_MS / 1000}s`,
            );
            updateRefreshScheduled = true;
            setTimeout(hardRefreshOverlay, UPDATE_REFRESH_DELAY_MS);
        }
    } catch (error) {
        console.warn("[updater] Commit check failed:", error);
    }
}

async function hardRefreshOverlay() {
    const base = location.href.split(/[?#]/)[0].replace(/[^/]*$/, "");

    await Promise.allSettled(
        OVERLAY_FILES.map((file) => fetch(base + file, { cache: "reload" })),
    );

    location.reload();
}

function startGithubUpdater() {
    checkForGithubCommit();
    setInterval(checkForGithubCommit, UPDATE_POLL_MS);
    console.log("Initiated GitHub updater.");
}