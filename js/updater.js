const GITHUB_REPO = "MarzzzDev/MChat";
const GITHUB_BRANCH = "main";
const UPDATE_POLL_MS = 300 * 1000;
const UPDATE_REFRESH_DELAY_MS = 10 * 1000;

let lastKnownCommitSha = null;
let updateRefreshScheduled = false;
let refreshing = false;

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
            lastKnownCommitSha = sha;
            setTimeout(hardRefreshOverlay, UPDATE_REFRESH_DELAY_MS);
        }
    } catch (error) {
        console.warn("[updater] Commit check failed:", error);
    }
}

async function listRepoFiles() {
    const ref = lastKnownCommitSha || GITHUB_BRANCH;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/git/trees/${ref}?recursive=1`,
            {
                headers: { Accept: "application/vnd.github+json" },
                cache: "no-cache",
            },
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const tree = (await response.json())?.tree;

        return (Array.isArray(tree) ? tree : [])
            .filter((entry) => entry.type === "blob")
            .map((entry) => entry.path);
    } catch (error) {
        console.warn("[updater] File list unavailable:", error);
        return [];
    }
}

async function hardRefreshOverlay() {
    if (refreshing) return;
    refreshing = true;

    const base = location.href.split(/[?#]/)[0].replace(/[^/]*$/, "");
    const files = await listRepoFiles();

    await Promise.allSettled(
        ["", ...files].map((file) =>
            fetch(base + encodeURI(file), { cache: "reload" }),
        ),
    );

    location.reload();
}

function startGithubUpdater() {
    checkForGithubCommit();
    setInterval(checkForGithubCommit, UPDATE_POLL_MS);
    console.log("Initiated GitHub updater.");
}