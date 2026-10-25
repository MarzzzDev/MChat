const GITHUB_REPO = "MarzzzDev/MChat";
const GITHUB_BRANCH = "main";
const UPDATE_POLL_MS = 300 * 1000;
const UPDATE_REFRESH_DELAY_MS = 10 * 1000;
const UPDATE_CHAT_SNAPSHOT_KEY = "mchat-update-chat-snapshot";

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
			console.log(`[updater] New version ${sha.slice(0, 7)} detected. Refreshing in ${UPDATE_REFRESH_DELAY_MS / 1000}s.`);
			lastKnownCommitSha = sha;
			updateRefreshScheduled = true;
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
	const chat = document.getElementById("chat");
	if (chat) {
		try {
			const snapshotChat = chat.cloneNode(true);
			const liveMessages = chat.querySelectorAll(":scope > .message");
			const copiedMessages = snapshotChat.querySelectorAll(":scope > .message");
			liveMessages.forEach((message, index) => {
				const ids = message._messageIds ? Array.from(message._messageIds) : [];
				if (ids.length && copiedMessages[index]) {
					copiedMessages[index].dataset.updateMessageIds = JSON.stringify(ids);
				}
			});
			sessionStorage.setItem(UPDATE_CHAT_SNAPSHOT_KEY, JSON.stringify({
				url: location.pathname + location.search,
				createdAt: Date.now(),
				html: snapshotChat.innerHTML,
			}));
		} catch (error) {
			console.warn("[updater] Could not preserve visible chat for refresh:", error);
		}
	}

	try {
		const files = await Promise.race([
			listRepoFiles(),
			new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
		]);

		await Promise.race([
			Promise.allSettled(
				[""].concat(files).map((file) =>
					fetch(base + encodeURI(file), { cache: "reload" }),
				),
			),
			new Promise((resolve) => setTimeout(resolve, 5000)),
		]);
	} finally {
		location.reload();
	}
}

function restoreUpdatedChat() {
	let snapshot;
	try {
		snapshot = JSON.parse(sessionStorage.getItem(UPDATE_CHAT_SNAPSHOT_KEY) || "null");
		sessionStorage.removeItem(UPDATE_CHAT_SNAPSHOT_KEY);
	} catch {
		return false;
	}

	if (
		!snapshot ||
		snapshot.url !== location.pathname + location.search ||
		Date.now() - Number(snapshot.createdAt) > 30 * 60 * 1000 ||
		typeof snapshot.html !== "string"
	) {
		return false;
	}

	const chat = document.getElementById("chat");
	if (!chat) return false;

	chat.innerHTML = snapshot.html;
	for (const message of chat.querySelectorAll(":scope > .message")) {
		let ids = [];
		try {
			ids = JSON.parse(message.dataset.updateMessageIds || "[]");
		} catch {}
		delete message.dataset.updateMessageIds;
		const id = message.dataset.messageId;
		if (id && !ids.includes(id)) ids.push(id);
		if (ids.length) {
			message._messageIds = new Set(ids.map(String));
			for (const messageId of message._messageIds) messageElements.set(messageId, message);
		}
		const userKey = message.dataset.userKey;
		if (userKey) {
			if (!userMessageElements.has(userKey)) userMessageElements.set(userKey, new Set());
			userMessageElements.get(userKey).add(message);
		}
		if (typeof scheduleMessageFade === "function") {
			scheduleMessageFade(message, userKey || null);
		}
	}

	console.log(`[updater] Restored ${chat.querySelectorAll(":scope > .message").length} visible messages.`);
	return true;
}

function startGithubUpdater() {
	checkForGithubCommit();
	setInterval(checkForGithubCommit, UPDATE_POLL_MS);
	console.log("Initiated GitHub updater.");
}
