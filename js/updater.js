const GITHUB_REPO = "MarzzzDev/MChat";
const GITHUB_BRANCH = "main";
const GITHUB_API_PREFIX = `https://api.github.com/repos/${GITHUB_REPO}/`;
const GITHUB_COMMIT_URL_PREFIX = `https://github.com/${GITHUB_REPO}/commit/`;
const COMMIT_SHA_PATTERN = /^[0-9a-f]{40}$/;
const MAX_REPO_FILES = 2000;
const MAX_REPO_PATH_LENGTH = 256;
const PREFETCH_CONCURRENCY = 8;
const MAX_SNAPSHOT_HTML_CHARS = 2 * 1024 * 1024;
const UPDATE_POLL_MS = 300 * 1000;
const UPDATE_REFRESH_DELAY_MS = 10 * 1000;
const UPDATE_CHAT_SNAPSHOT_KEY = "mchat-update-chat-snapshot";

const UPDATER_CONFIG_VALID =
	/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(GITHUB_REPO) &&
	/^[A-Za-z0-9_.\/-]+$/.test(GITHUB_BRANCH) &&
	!GITHUB_BRANCH.includes("..");

function isExpectedGithubResponse(response) {
	return typeof response?.url === "string" && response.url.startsWith(GITHUB_API_PREFIX);
}

function isSafeRepoPath(path) {
	if (
		typeof path !== "string" ||
		!path ||
		path.length > MAX_REPO_PATH_LENGTH ||
		path.startsWith("/") ||
		path.includes("\\") ||
		/[\u0000-\u001f\u007f]/.test(path)
	) {
		return false;
	}

	return path
		.split("/")
		.every((segment) => segment && segment !== "." && segment !== ".." && !segment.startsWith("."));
}

function buildSameOriginRepoUrl(base, path) {
	const encoded = path.split("/").map(encodeURIComponent).join("/");
	const url = new URL(base + encoded, location.href);

	return url.origin === location.origin && url.href.startsWith(base) ? url.href : null;
}

let lastKnownCommitSha = null;
let updateRefreshScheduled = false;
let refreshing = false;

async function checkForGithubCommit() {
	if (updateRefreshScheduled || !UPDATER_CONFIG_VALID) return;

	try {
		const response = await fetch(
			`${GITHUB_API_PREFIX}commits/${encodeURIComponent(GITHUB_BRANCH)}`,
			{
				headers: { Accept: "application/vnd.github+json" },
				cache: "no-cache",
				credentials: "omit",
				referrerPolicy: "no-referrer",
				redirect: "error",
			},
		);

		if (!response.ok) {
			throw new Error(`GitHub API returned ${response.status}`);
		}

		if (!isExpectedGithubResponse(response)) {
			throw new Error("Update response came from an unexpected URL.");
		}

		const data = await response.json();
		const sha = data?.sha;

		if (typeof sha !== "string" || !COMMIT_SHA_PATTERN.test(sha)) {
			console.warn("[updater] Ignoring update metadata with an invalid commit SHA.");
			return;
		}

		if (
			data.html_url !== undefined &&
			(typeof data.html_url !== "string" || !data.html_url.startsWith(GITHUB_COMMIT_URL_PREFIX))
		) {
			console.warn("[updater] Ignoring update metadata for an unexpected repository.");
			return;
		}

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
	if (!UPDATER_CONFIG_VALID) return [];

	const ref = lastKnownCommitSha || GITHUB_BRANCH;

	try {
		const response = await fetch(
			`${GITHUB_API_PREFIX}git/trees/${encodeURIComponent(ref)}?recursive=1`,
			{
				headers: { Accept: "application/vnd.github+json" },
				cache: "no-cache",
				credentials: "omit",
				referrerPolicy: "no-referrer",
				redirect: "error",
			},
		);

		if (!response.ok) {
			throw new Error(`GitHub API returned ${response.status}`);
		}

		if (!isExpectedGithubResponse(response)) {
			throw new Error("File list came from an unexpected URL.");
		}

		const tree = (await response.json())?.tree;

		return (Array.isArray(tree) ? tree : [])
			.filter((entry) => entry?.type === "blob" && isSafeRepoPath(entry.path))
			.map((entry) => entry.path)
			.slice(0, MAX_REPO_FILES);
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

		const urls = [base]
			.concat(files.map((file) => buildSameOriginRepoUrl(base, file)))
			.filter(Boolean);

		let expired = false;
		let cursor = 0;

		const worker = async () => {
			while (!expired && cursor < urls.length) {
				const url = urls[cursor++];

				try {
					await fetch(url, { cache: "reload", credentials: "same-origin" });
				} catch {}
			}
		};

		await Promise.race([
			Promise.allSettled(Array.from({ length: PREFETCH_CONCURRENCY }, worker)),
			new Promise((resolve) =>
				setTimeout(() => {
					expired = true;
					resolve();
				}, 5000),
			),
		]);
	} finally {
		location.reload();
	}
}

const SNAPSHOT_ALLOWED_TAGS = new Set([
	"div", "span", "img", "a", "br",
	"svg", "path", "g", "circle", "rect",
]);

const SNAPSHOT_ALLOWED_ATTRS = new Set([
	"class", "style", "alt", "title", "src", "href", "width", "height", "draggable",
	"role", "aria-hidden", "aria-label",
	"viewbox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin",
	"d", "cx", "cy", "r", "x", "y", "rx", "ry",
]);

function snapshotUrlAllowed(value) {
	const candidate = String(value || "").trim();

	if (/^data:image\/(?:png|gif|webp|jpeg|svg\+xml)[;,]/i.test(candidate)) {
		return candidate.length <= 8192;
	}

	try {
		const url = new URL(candidate);

		return url.protocol === "https:" && !url.username && !url.password;
	} catch {
		return false;
	}
}

function snapshotStyleAllowed(value) {
	const style = String(value || "");

	if (/expression\s*\(|javascript:|@import|behavior\s*:|-moz-binding|[<\\]/i.test(style)) {
		return false;
	}

	for (const match of style.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
		if (!snapshotUrlAllowed(match[2])) {
			return false;
		}
	}

	return !/url\(/i.test(style.replace(/url\(\s*(["']?)(.*?)\1\s*\)/gi, ""));
}

function sanitizeSnapshotNode(node) {
	for (const child of Array.from(node.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) {
			continue;
		}

		if (child.nodeType !== Node.ELEMENT_NODE) {
			child.remove();
			continue;
		}

		if (!SNAPSHOT_ALLOWED_TAGS.has(child.localName.toLowerCase())) {
			child.remove();
			continue;
		}

		for (const attr of Array.from(child.attributes)) {
			const name = attr.name.toLowerCase();
			let keep = SNAPSHOT_ALLOWED_ATTRS.has(name) || /^data-[a-z0-9-]+$/.test(name);

			if (keep && (name === "src" || name === "href")) {
				keep = snapshotUrlAllowed(attr.value);
			} else if (keep && name === "style") {
				keep = snapshotStyleAllowed(attr.value);
			}

			if (!keep) {
				child.removeAttribute(attr.name);
			}
		}

		if (child.localName.toLowerCase() === "a") {
			child.setAttribute("rel", "noopener noreferrer");
		}

		sanitizeSnapshotNode(child);
	}
}

function sanitizeSnapshotHtml(html) {
	const template = document.createElement("template");

	template.innerHTML = html;
	sanitizeSnapshotNode(template.content);

	return template.content;
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
		typeof snapshot.html !== "string" ||
		snapshot.html.length > MAX_SNAPSHOT_HTML_CHARS
	) {
		return false;
	}

	const chat = document.getElementById("chat");
	if (!chat) return false;

	chat.replaceChildren(sanitizeSnapshotHtml(snapshot.html));
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