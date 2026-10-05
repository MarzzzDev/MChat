const BASE = self.registration.scope + "preview-cache/";
let manifest;
const getManifest = async () =>
(manifest ??= await (await fetch(BASE + "manifest.json")).json());

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;
    e.respondWith((async () => {
        try {
            const file = (await getManifest()).assets[e.request.url];
            if (file) return await fetch(BASE + file);
        } catch {}
        return fetch(e.request);
    })());
});
