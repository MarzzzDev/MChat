(() => {
	const nativeFetch = window.fetch.bind(window);
	const DB_NAME = "mchat-api-cache";
	const STORE = "responses";
	const MIN = 60 * 1000;
	const HOUR = 60 * MIN;
	const MAX_STALE_MS = 7 * 24 * HOUR;

	const RULES = [
		{ re: /^https:\/\/7tv\.io\/v3\/emote-sets\/global/, fresh: 6 * HOUR },
		{ re: /^https:\/\/api\.betterttv\.net\/3\/cached\/(emotes\/global|badges)/, fresh: 6 * HOUR },
		{ re: /^https:\/\/api\.frankerfacez\.com\/v1\/(set\/global|badge\/bot)/, fresh: 6 * HOUR },
		{ re: /^https:\/\/api\.(chatterino|moltorino)\.com\//, fresh: 6 * HOUR },
		{ re: /^https:\/\/(chatterinohomies\.com|itzalex\.github\.io|flxrs\.com|dank-chat-badges\.marseceva\.workers\.dev)/, fresh: 6 * HOUR },
		{ re: /^https:\/\/7tv\.io\/v3\/(users|emote-sets)\//, fresh: 2 * MIN, live: true },
		{ re: /^https:\/\/api\.betterttv\.net\/3\/cached\/users\//, fresh: 2 * MIN, live: true },
		{ re: /^https:\/\/api\.frankerfacez\.com\/v1\/(room|user)\//, fresh: 2 * MIN, live: true },
		{ re: /^https:\/\/api\.7tv\.app\/v4\/gql/, fresh: 5 * MIN, maxStale: 10 * MIN, post: true },
		{ re: /^https:\/\/gql\.twitch\.tv\/gql/, fresh: 6 * HOUR, post: true },
	];

	let dbPromise = null;

	function openDb() {
		return (dbPromise ??= new Promise((resolve) => {
			try {
				const request = indexedDB.open(DB_NAME, 1);

				request.onupgradeneeded = () => request.result.createObjectStore(STORE);
				request.onsuccess = () => {
					setTimeout(() => prune(request.result), 15000);
					resolve(request.result);
				};
				request.onerror = () => resolve(null);
			} catch {
				resolve(null);
			}
		}));
	}

	function prune(db) {
		try {
			const store = db.transaction(STORE, "readwrite").objectStore(STORE);
			const cursor = store.openCursor();

			cursor.onsuccess = () => {
				const item = cursor.result;

				if (!item) {
					return;
				}

				if (Date.now() - (item.value?.t || 0) > MAX_STALE_MS) {
					item.delete();
				}

				item.continue();
			};
		} catch {}
	}

	async function dbGet(key) {
		const db = await openDb();

		if (!db) {
			return null;
		}

		return new Promise((resolve) => {
			try {
				const request = db.transaction(STORE).objectStore(STORE).get(key);

				request.onsuccess = () => resolve(request.result || null);
				request.onerror = () => resolve(null);
			} catch {
				resolve(null);
			}
		});
	}

	async function dbSet(key, value) {
		const db = await openDb();

		if (!db) {
			return;
		}

		try {
			db.transaction(STORE, "readwrite").objectStore(STORE).put(value, key);
		} catch {}
	}

	const inflight = new Map();

	function network(key, input, init) {
		let promise = inflight.get(key);

		if (!promise) {
			promise = nativeFetch(input, init)
				.then(async (response) => {
					if (response.ok) {
						const text = await response.clone().text();

						dbSet(key, {
							t: Date.now(),
							text,
							type: response.headers.get("Content-Type") || "application/json",
						});
					}

					return response;
				})
				.finally(() => inflight.delete(key));

			inflight.set(key, promise);
		}

		return promise.then((response) => response.clone());
	}

	async function cachedFetch(key, rule, input, init) {
		const entry = await dbGet(key);
		const age = entry ? Date.now() - entry.t : Infinity;
		const maxStale = rule.maxStale ?? MAX_STALE_MS;

		if (entry && age < maxStale && rule.live && window.mchatLiveRefresh) {
			try {
				const response = await network(key, input, Object.assign({ cache: "no-cache" }, init));

				if (response.ok) {
					return response;
				}
			} catch {}

			return new Response(entry.text, {
				status: 200,
				headers: { "Content-Type": entry.type },
			});
		}

		if (entry && age < maxStale) {
			if (age >= rule.fresh) {
				network(key, input, init).catch(() => {});
			}

			return new Response(entry.text, {
				status: 200,
				headers: { "Content-Type": entry.type },
			});
		}

		return network(key, input, init);
	}

	window.fetch = function (input, init) {
		if (typeof input !== "string") {
			return nativeFetch(input, init);
		}

		const rule = RULES.find((item) => item.re.test(input));

		if (!rule) {
			return nativeFetch(input, init);
		}

		const method = String(init?.method || "GET").toUpperCase();
		const body = typeof init?.body === "string" ? init.body : "";

		if (method === "POST" ? !rule.post || !body : method !== "GET") {
			return nativeFetch(input, init);
		}

		return cachedFetch(`${method} ${input} ${body}`, rule, input, init);
	};

	openDb();
})();
