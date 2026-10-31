const SCOPE_URL = new URL(self.registration.scope);
const BASE = SCOPE_URL.href + "preview-cache/";
const MANIFEST_URL = BASE + "manifest.json";

const MANIFEST_TTL_MS = 60 * 1000;
const MANIFEST_RETRY_MS = 10 * 1000;
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024;
const MAX_MANIFEST_ASSETS = 5000;
const MAX_ASSET_KEY_LENGTH = 2048;
const MAX_ASSET_FILE_LENGTH = 256;

const ALLOWED_REMOTE_ORIGINS = new Set([
	"https://cdn.7tv.app",
	"https://cdn.betterttv.net",
	"https://cdn.frankerfacez.com",
	"https://static-cdn.jtvnw.net",
	"https://cdn.jsdelivr.net",
]);

const SAFE_ASSET_FILE = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;

let manifest = null;
let manifestLoadedAt = 0;
let manifestLoading = null;

function resolveAssetFile(file) {
	if (typeof file !== "string" || file.length > MAX_ASSET_FILE_LENGTH || !SAFE_ASSET_FILE.test(file)) {
		return null;
	}

	if (file.split("/").some((segment) => segment === "." || segment === "..")) {
		return null;
	}

	const resolved = new URL(file, BASE);

	if (
		resolved.origin !== SCOPE_URL.origin ||
		!resolved.href.startsWith(BASE) ||
		resolved.href === MANIFEST_URL ||
		resolved.search ||
		resolved.hash
	) {
		return null;
	}

	return resolved.href;
}

function isAllowedAssetKey(key) {
	if (typeof key !== "string" || key.length > MAX_ASSET_KEY_LENGTH) {
		return false;
	}

	let url;

	try {
		url = new URL(key);
	} catch {
		return false;
	}

	if (url.href !== key || url.username || url.password || url.hash) {
		return false;
	}

	if (url.origin === SCOPE_URL.origin) {
		return url.protocol === "https:" || url.protocol === "http:";
	}

	return url.protocol === "https:" && ALLOWED_REMOTE_ORIGINS.has(url.origin);
}

function isPlainObject(value) {
	return (
		value !== null &&
		typeof value === "object" &&
		Object.getPrototypeOf(value) === Object.prototype
	);
}

function validateManifest(data) {
	const entries = new Map();

	if (!isPlainObject(data) || !isPlainObject(data.assets)) {
		return entries;
	}

	for (const [key, file] of Object.entries(data.assets)) {
		if (entries.size >= MAX_MANIFEST_ASSETS) {
			break;
		}

		const target = resolveAssetFile(file);

		if (target && isAllowedAssetKey(key)) {
			entries.set(key, target);
		}
	}

	return entries;
}

async function fetchManifest() {
	const response = await fetch(MANIFEST_URL, {
		cache: "no-cache",
		credentials: "same-origin",
		redirect: "error",
	});

	if (!response.ok || response.type === "opaque") {
		throw new Error(`Manifest request failed: ${response.status}`);
	}

	const declared = Number(response.headers.get("content-length"));

	if (Number.isFinite(declared) && declared > MAX_MANIFEST_BYTES) {
		throw new Error("Manifest too large.");
	}

	const text = await response.text();

	if (text.length > MAX_MANIFEST_BYTES) {
		throw new Error("Manifest too large.");
	}

	return validateManifest(JSON.parse(text));
}

function getManifest() {
	const now = Date.now();

	if (manifest && now - manifestLoadedAt < MANIFEST_TTL_MS) {
		return Promise.resolve(manifest);
	}

	if (manifestLoading) {
		return manifestLoading;
	}

	manifestLoading = fetchManifest()
		.then((loaded) => {
			manifest = loaded;
			manifestLoadedAt = Date.now();
			return manifest;
		})
		.catch(() => {
			manifestLoadedAt = Date.now() - MANIFEST_TTL_MS + MANIFEST_RETRY_MS;
			return manifest;
		})
		.finally(() => {
			manifestLoading = null;
		});

	return manifestLoading;
}

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

self.addEventListener("message", (event) => {
	if (event.data === "mchat-invalidate-manifest") {
		manifest = null;
		manifestLoadedAt = 0;
	}
});

self.addEventListener("fetch", (event) => {
	const request = event.request;

	if (request.method !== "GET" || request.mode === "navigate" || request.headers.has("range")) {
		return;
	}

	event.respondWith(
		(async () => {
			try {
				const target = (await getManifest())?.get(request.url);

				if (target) {
					const response = await fetch(target, { redirect: "error" });

					if (response.ok && response.type === "basic") {
						return response;
					}
				}
			} catch {}

			return fetch(request);
		})(),
	);
});