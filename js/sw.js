const BASE = self.registration.scope + "preview-cache/";
let manifest;
const getManifest = async () =>
(manifest ??= await (await fetch(BASE + "manifest.json")).json());

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;
	event.respondWith((async () => {
		try {
			const file = (await getManifest()).assets[event.request.url];
			if (file) return await fetch(BASE + file);
		} catch {}
		return fetch(event.request);
	})());
});
