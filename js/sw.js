const BASE = self.registration.scope + "preview-cache/";
let manifest;
const getManifest = async () => {
	if (!manifest) {
		manifest = fetch(BASE + "manifest.json").then((response) => response.json());
	}
	return manifest;
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;
	const url = new URL(event.request.url);
	const scopeUrl = new URL(self.registration.scope);
	const previewCachePath = new URL("preview-cache/", scopeUrl).pathname;
	if (url.origin !== scopeUrl.origin || !url.pathname.startsWith(previewCachePath)) return;
	event.respondWith((async () => {
		try {
			const file = (await getManifest()).assets[event.request.url];
			if (file) return await fetch(BASE + file);
		} catch {}
		return fetch(event.request);
	})());
});
