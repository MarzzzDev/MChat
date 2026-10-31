const MAX_REMOTE_URL_LENGTH = 2048;
const MAX_DATA_URL_LENGTH = 8192;
const SAFE_DATA_IMAGE = /^data:image\/(?:png|gif|webp|jpeg|svg\+xml)[;,]/i;

function safeMediaUrl(value) {
	if (typeof value !== "string") {
		return null;
	}

	let candidate = value.trim();

	if (!candidate) {
		return null;
	}

	if (/^data:/i.test(candidate)) {
		return candidate.length <= MAX_DATA_URL_LENGTH && SAFE_DATA_IMAGE.test(candidate)
			? candidate
			: null;
	}

	if (candidate.length > MAX_REMOTE_URL_LENGTH) {
		return null;
	}

	if (candidate.startsWith("//")) {
		candidate = `https:${candidate}`;
	}

	let url;

	try {
		url = new URL(candidate);
	} catch {
		return null;
	}

	if (url.protocol !== "https:" || url.username || url.password) {
		return null;
	}

	return url.href;
}

function cssUrl(value) {
	const safe = safeMediaUrl(value);

	return safe ? `url("${safe.replace(/["\\\n\r]/g, encodeURIComponent)}")` : null;
}

function safeCssColor(value) {
	if (typeof value !== "string") {
		return null;
	}

	const color = value.trim();

	if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
		return color;
	}

	if (
		/^rgba?\(\s*\d{1,3}\s*(?:,\s*\d{1,3}\s*){2}(?:,\s*(?:0|1|0?\.\d+|\d{1,3}%?)\s*)?\)$/i.test(
			color,
		)
	) {
		return color;
	}

	return null;
}

function isTrusted7TVUrl(href) {
	try {
		const url = new URL(href);

		return (
			url.protocol === "https:" &&
			!url.username &&
			!url.password &&
			(url.hostname === "7tv.app" || url.hostname.endsWith(".7tv.app"))
		);
	} catch {
		return false;
	}
}

function setBoundedCache(map, key, value, limit) {
	if (map.has(key)) {
		map.delete(key);
	}

	map.set(key, value);

	while (map.size > limit) {
		map.delete(map.keys().next().value);
	}
}

async function pickFirstLoaded(urls, probe, waveSize = 4) {
	for (let i = 0; i < urls.length; i += waveSize) {
		const wave = urls
			.slice(i, i + waveSize)
			.map((url) => probe(url).then((ok) => (ok ? url : null)));

		for (const pending of wave) {
			const url = await pending;

			if (url) {
				return url;
			}
		}
	}

	return null;
}

function get7TVPaintLayerUrls(paint, layer) {
	if (!paint?.id || !layer?.id) {
		return [];
	}

	const paintId = encodeURIComponent(String(paint.id));

	const layerId = encodeURIComponent(String(layer.id));

	return [
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/4x.gif`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/3x.gif`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/2x.gif`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/1x.gif`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/4x`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/3x`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/2x`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/1x`,

		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/4x.webp`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/3x.webp`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/2x.webp`,
		`https://cdn.7tv.app/paint/${paintId}/layer/${layerId}/1x.webp`,
	];
}

const TWEMOJI_VERSION = "14.0.2";
const TWEMOJI_INTEGRITY =
	"sha384-32KMvAMS4DUBcQtHG6fzADguo/tpN1Nh6BAJa2QqZc6/i0K+YPQE+bWiqBRAWuFs";
const TWEMOJI_CDN_URL = `https://cdn.jsdelivr.net/npm/twemoji@${TWEMOJI_VERSION}/dist/twemoji.min.js`;

function getTwemojiScriptSources() {
	return [TWEMOJI_CDN_URL];
}

function injectTwemojiScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");

		script.src = src;
		script.integrity = TWEMOJI_INTEGRITY;
		script.crossOrigin = "anonymous";
		script.referrerPolicy = "no-referrer";
		script.async = true;

		script.onload = () => {
			if (window.twemoji) {
				resolve(window.twemoji);
			} else {
				script.remove();
				reject(new Error("Twemoji loaded but was not found."));
			}
		};

		script.onerror = () => {
			script.remove();
			reject(new Error(`Failed to load Twemoji from ${src}.`));
		};

		(document.head || document.documentElement).appendChild(script);
	});
}

function loadTwemoji() {
	if (window.twemoji) {
		return Promise.resolve(window.twemoji);
	}

	if (twemojiReady) {
		return twemojiReady;
	}

	twemojiReady = (async () => {
		let lastError = null;

		for (const src of getTwemojiScriptSources()) {
			try {
				return await injectTwemojiScript(src);
			} catch (error) {
				lastError = error;
			}
		}

		twemojiReady = null;
		throw lastError || new Error("Failed to load Twemoji.");
	})();

	return twemojiReady;
}

function get7TVEmoteFlags(emote) {
	return Number(emote?.data?.flags ?? emote?.flags ?? 0);
}

function get7TVEmoteFile(emote) {
	const files = emote?.data?.host?.files || [];

	if (!files.length) {
		return null;
	}

	return (
		files.find((file) => String(file.name || "").includes("4x")) ||
		files.find((file) => String(file.name || "").includes("3x")) ||
		files.find((file) => String(file.name || "").includes("2x")) ||
		files.find((file) => String(file.name || "").includes("1x")) ||
		files[files.length - 1]
	);
}

function get7TVHostUrl(emote) {
	let host = emote?.data?.host?.url;

	if (typeof host !== "string" || !host) {
		return null;
	}

	if (host.startsWith("//")) {
		host = `https:${host}`;
	} else if (!/^https?:\/\//i.test(host)) {
		host = `https://${host}`;
	}

	host = host.replace(/\/+$/, "");

	return isTrusted7TVUrl(host) ? host : null;
}

function add7TVEmote(emote, target = sevenTVEmotes) {
	if (!emote?.name) {
		return;
	}

	let file = get7TVEmoteFile(emote);

	let host = get7TVHostUrl(emote);

	if ((!file || !host) && emote.id && /^[\w-]{1,64}$/.test(String(emote.id))) {
		host = `https://cdn.7tv.app/emote/${encodeURIComponent(String(emote.id))}`;
		file = { name: "4x.webp" };
	}

	if (!file || !host || !/^[\w.-]{1,64}$/.test(String(file.name || ""))) {
		return;
	}

	const flags = get7TVEmoteFlags(emote);

	const listed = emote?.data?.listed ?? emote?.listed ?? true;

	target.set(emote.name, {
		id: emote.id ? String(emote.id) : null,

		name: emote.name,

		url: `${host}/${file.name}`,

		provider: "7TV",

		flags,

		listed: listed !== false,

		zeroWidth:
			Boolean(flags & SEVENTV_EMOTE_FLAGS.ZERO_WIDTH) ||
			Boolean(Number(emote.flags || 0) & 1),
	});
}

async function load7TVGlobalEmotes() {
	try {
		const response = await fetch("https://7tv.io/v3/emote-sets/global");

		if (!response.ok) {
			throw new Error(`7TV global emote error: ${response.status}`);
		}

		const data = await response.json();

		for (const emote of data.emotes || []) {
			add7TVEmote(emote);
			add7TVEmote(emote, sevenTVGlobalEmotes);
		}

		console.log(`Loaded 7TV emotes.`);
	} catch (error) {
		console.error("7TV global emote error:", error);
	}
}

let sevenTVChannelNames = new Set();

async function load7TVEmotes() {
	if (!TWITCH_USER_ID) {
		return;
	}

	try {
		const userResponse = await fetch(
			`https://7tv.io/v3/users/twitch/${TWITCH_USER_ID}`,
		);

		if (userResponse.status === 404) {
			return;
		}

		if (!userResponse.ok) {
			throw new Error(`7TV user error: ${userResponse.status}`);
		}

		const userData = await userResponse.json();

		const emoteSetId = userData.emote_set?.id;

		if (!emoteSetId) {
			return;
		}

		let setData = userData.emote_set;

		if (!Array.isArray(setData?.emotes) || !setData.emotes.length) {
			const setResponse = await fetch(
				`https://7tv.io/v3/emote-sets/${emoteSetId}`,
			);

			if (!setResponse.ok) {
				throw new Error(`7TV emote set error: ${setResponse.status}`);
			}

			setData = await setResponse.json();
		}

		const names = new Set();

		for (const emote of setData.emotes || []) {
			add7TVEmote(emote);

			if (emote?.name) {
				names.add(emote.name);
			}
		}

		for (const name of sevenTVChannelNames) {
			if (names.has(name)) {
				continue;
			}

			const global = sevenTVGlobalEmotes.get(name);

			if (global) {
				sevenTVEmotes.set(name, global);
			} else {
				sevenTVEmotes.delete(name);
			}
		}

		sevenTVChannelNames = names;

		connectSevenTVEvents(emoteSetId);
	} catch (error) {
		console.error("7TV emote error:", error);
	}
}

function normalizeImageUrl(url) {
	return safeMediaUrl(url);
}

function getFFZImage(emote) {
	return (
		emote.animated?.["4"] ||
		emote.animated?.["2"] ||
		emote.animated?.["1"] ||
		emote.urls?.["4"] ||
		emote.urls?.["2"] ||
		emote.urls?.["1"] ||
		null
	);
}

async function loadFFZEmotes() {
	try {
		const [response, roomResponse] = await Promise.all([
			fetch("https://api.frankerfacez.com/v1/set/global"),
			CHANNEL
				? fetch(
					`https://api.frankerfacez.com/v1/room/${encodeURIComponent(CHANNEL)}`,
				).catch(() => null)
				: null,
		]);

		if (!response.ok) {
			throw new Error(`FFZ global emotes: ${response.status}`);
		}

		const data = await response.json();

		for (const set of Object.values(data.sets || {})) {
			for (const emote of set.emoticons || []) {
				const url = normalizeImageUrl(getFFZImage(emote));

				if (!url) {
					continue;
				}

				ffzEmotes.set(emote.name, {
					id: String(emote.id),

					name: emote.name,

					url,

					width: emote.width,

					height: emote.height,

					modifier: Boolean(emote.modifier),

					modifierFlags: Number(emote.modifier_flags || 0),
				});
			}
		}

		for (const [name, emote] of ffzEmotes) {
			ffzGlobalEmotes.set(name, emote);
		}

		if (roomResponse?.ok) {
			const roomData = await roomResponse.json();

			for (const set of Object.values(roomData.sets || {})) {
				for (const emote of set.emoticons || []) {
					const url = normalizeImageUrl(getFFZImage(emote));

					if (!url) {
						continue;
					}

					ffzEmotes.set(emote.name, {
						id: String(emote.id),

						name: emote.name,

						url,

						width: emote.width,

						height: emote.height,

						modifier: Boolean(emote.modifier),

						modifierFlags: Number(emote.modifier_flags || 0),
					});
				}
			}
		}

		if (!emoteRefreshing) {
			console.log(`Loaded FFZ emotes.`);
		}
	} catch (error) {
		console.error("FFZ emote error:", error);
	}
}

async function loadBTTVEmotes() {
	try {
		const [globalResponse, userResponse] = await Promise.all([
			fetch("https://api.betterttv.net/3/cached/emotes/global"),
			TWITCH_USER_ID
				? fetch(
					`https://api.betterttv.net/3/cached/users/twitch/${TWITCH_USER_ID}`,
				).catch(() => null)
				: null,
		]);

		if (!globalResponse.ok) {
			throw new Error(`BTTV global emotes: ${globalResponse.status}`);
		}

		const globalData = await globalResponse.json();

		for (const emote of Array.isArray(globalData) ? globalData : []) {
			if (!emote?.code || !/^[\w-]{1,64}$/.test(String(emote.id || ""))) {
				continue;
			}

			bttvEmotes.set(emote.code, {
				id: String(emote.id),

				name: emote.code,

				url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
			});
		}

		for (const [name, emote] of bttvEmotes) {
			bttvGlobalEmotes.set(name, emote);
		}

		if (userResponse?.ok) {
			const userData = await userResponse.json();

			const emotes = (userData.channelEmotes || []).concat(
				userData.sharedEmotes || [],
			);

			for (const emote of emotes) {
				if (!emote?.code || !/^[\w-]{1,64}$/.test(String(emote.id || ""))) {
					continue;
				}

				const extension = emote.imageType === "gif" ? "gif" : "png";

				bttvEmotes.set(emote.code, {
					id: String(emote.id),

					name: emote.code,

					url: `https://cdn.betterttv.net/emote/${emote.id}/3x.${extension}`,
				});
			}
		}

		if (!emoteRefreshing) {
			console.log(`Loaded BTTV emotes.`);
		}
	} catch (error) {
		console.error("BTTV emote error:", error);
	}
}

function colorToCss(color) {
	if (!color) {
		return "transparent";
	}

	const r = Math.max(0, Math.min(255, Number(color.r ?? 0)));

	const g = Math.max(0, Math.min(255, Number(color.g ?? 0)));

	const b = Math.max(0, Math.min(255, Number(color.b ?? 0)));

	let alpha = Number(color.a ?? 255);

	if (alpha > 1) {
		alpha /= 255;
	}

	alpha = Math.max(0, Math.min(1, alpha));

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createPaintDropShadowFilter(paint) {
	const shadows = paint?.data?.shadows || [];

	if (Array.isArray(shadows) && shadows.length) {
		const filters = [];

		for (const shadow of shadows) {
			if (!shadow) {
				continue;
			}

			const color = colorToCss(shadow.color);

			const offsetX = Number(shadow.offsetX ?? 0) * 2;

			const offsetY = Number(shadow.offsetY ?? 0) * 2;

			const blur = Math.max(0, Number(shadow.blur ?? 0) * 2);

			filters.push(
				`drop-shadow(` +
				`${offsetX}px ` +
				`${offsetY}px ` +
				`${blur}px ` +
				`${color}` +
				`)`,
			);
		}

		if (filters.length) {
			return filters.join(" ");
		}
	}
	return null;
}

function loadPaintImage(url) {
	return new Promise((resolve) => {
		if (!safeMediaUrl(url)) {
			resolve(null);
			return;
		}

		const img = new Image();

		img.onload = () => {
			resolve(url);
		};

		img.onerror = () => {
			resolve(null);
		};

		img.decoding = "async";
		img.loading = "eager";

		img.src = url;
	});
}

const paintLayerUrlCache = new Map();

async function getWorking7TVPaintLayerUrl(paint, layer) {
	const urls = get7TVPaintLayerUrls(paint, layer);

	if (!urls.length) {
		return null;
	}

	const key = `${paint.id}:${layer.id}`;

	if (!paintLayerUrlCache.has(key)) {
		const pending = pickFirstLoaded(urls, loadPaintImage, 6).then((url) => {
			if (!url) {
				paintLayerUrlCache.delete(key);
			}

			return url;
		});

		setBoundedCache(paintLayerUrlCache, key, pending, 500);
	}

	return paintLayerUrlCache.get(key);
}

async function applyPaint(element, paint) {
	if (!element || !paint) {
		return;
	}

	const layers = paint?.data?.layers || [];

	if (!Array.isArray(layers) || !layers.length) {
		return;
	}

	const paintSeq = (element._paintSeq = (element._paintSeq || 0) + 1);

	const backgrounds = [];

	for (const layer of layers) {
		const type = layer?.ty;

		if (!type) {
			continue;
		}

		let background = null;

		if (type.__typename === "PaintLayerTypeSingleColor") {
			if (!type.color) {
				continue;
			}

			background = colorToCss(type.color);
		} else if (type.__typename === "PaintLayerTypeLinearGradient") {
			const stops = (type.stops || [])
				.map((stop) => {
					if (!stop?.color) {
						return null;
					}

					return (
						`${colorToCss(stop.color)} ` + `${Number(stop.at ?? 0) * 100}%`
					);
				})
				.filter(Boolean)
				.join(", ");

			if (!stops) {
				continue;
			}

			let angle = Number(type.angle ?? 0);

			if (!Number.isFinite(angle)) {
				angle = 0;
			}

			background =
				`${type.repeating ? "repeating-" : ""}` +
				`linear-gradient(` +
				`${angle}deg, ` +
				`${stops}` +
				`)`;
		} else if (type.__typename === "PaintLayerTypeRadialGradient") {
			const stops = (type.stops || [])
				.map((stop) => {
					if (!stop?.color) {
						return null;
					}

					return (
						`${colorToCss(stop.color)} ` + `${Number(stop.at ?? 0) * 100}%`
					);
				})
				.filter(Boolean)
				.join(", ");

			if (!stops) {
				continue;
			}

			const shape = type.shape === "ellipse" ? "ellipse" : "circle";

			background =
				`${type.repeating ? "repeating-" : ""}` +
				`radial-gradient(` +
				`${shape}, ` +
				`${stops}` +
				`)`;
		} else if (type.__typename === "PaintLayerTypeImage") {
			const animatedUrl = await getWorking7TVPaintLayerUrl(paint, layer);

			if (!animatedUrl) {
				background = cssUrl(type.images?.[0]?.url);

				if (!background) {
					continue;
				}
			} else {
				background = cssUrl(animatedUrl);

				if (!background) {
					continue;
				}
			}
		}

		if (background) {
			backgrounds.push({
				background,

				opacity: Number(layer.opacity ?? 1),
			});
		}
	}

	if (element._paintSeq !== paintSeq || !backgrounds.length) {
		return;
	}

	const imageLayers = backgrounds.map((layer) => layer.background).reverse();

	element.classList.remove("seven-tv-painted");

	element.style.backgroundImage = "";

	element.style.backgroundColor = "";

	element.style.filter = "";

	element.style.textShadow = "none";

	element.classList.add("seven-tv-painted");

	element.style.display = "inline-block";

	element.style.position = "relative";

	element.style.backgroundImage = imageLayers.join(", ");

	element.style.backgroundSize = imageLayers
		.map((_, index) => {
			const original = backgrounds[backgrounds.length - 1 - index];

			return original.background.startsWith("url(") ? "cover" : "100% 100%";
		})
		.join(", ");

	element.style.backgroundPosition = imageLayers
		.map(() => "center center")
		.join(", ");

	element.style.backgroundRepeat = imageLayers
		.map(() => "no-repeat")
		.join(", ");

	element.style.backgroundClip = "text";

	element.style.webkitBackgroundClip = "text";

	element.style.color = "transparent";

	element.style.webkitTextFillColor = "transparent";

	const shadowFilter = createPaintDropShadowFilter(paint);

	if (shadowFilter === "__NORMAL_USERNAME_SHADOW__") {
		element.style.filter = "none";
		element.style.textShadow = "1px 1px 2px rgba(0, 0, 0, 0.85)";
	} else if (shadowFilter && shadowFilter !== "none") {
		element.style.filter = shadowFilter;
		element.style.textShadow = "none";
	}

	element.style.backgroundOrigin = "border-box";

	element.style.backgroundAttachment = "scroll";

	void element.offsetWidth;

	element.style.willChange = "background-image";
}

const sevenTVStyleCache = new Map();
const sevenTVStylePending = new Map();

function build7TVStyleQuery(gqlPlatform) {
	return `
		query GetUserStyle($platformId: String!) {
			users {
				userByConnection(
					platform: ${gqlPlatform}
					platformId: $platformId
				) {
					style {
						activeBadge {
							id
							name
						}
						activePaint {
							id
							name
							data {
								layers {
									id
									opacity
									ty {
										__typename
										... on PaintLayerTypeSingleColor {
											color { r g b a hex }
										}
										... on PaintLayerTypeLinearGradient {
											angle
											repeating
											stops {
												at
												color { r g b a hex }
											}
										}
										... on PaintLayerTypeRadialGradient {
											shape
											repeating
											stops {
												at
												color { r g b a hex }
											}
										}
										... on PaintLayerTypeImage {
											images {
												url
												width
												height
											}
										}
									}
								}
								shadows {
									blur
									offsetX
									offsetY
									color { r g b a hex }
								}
							}
						}
					}
				}
			}
		}
	`;
}

const SEVENTV_STYLE_CACHE_LIMIT = 2000;
const SEVENTV_STYLE_TTL_MS = 3 * 60 * 1000;
const SEVENTV_STYLE_EMPTY_TTL_MS = 60 * 1000;

function isSevenTVStyleFresh(entry) {
	if (!entry) {
		return false;
	}

	if (entry.pinned) {
		return true;
	}

	const ttl = entry.paint || entry.badge
		? SEVENTV_STYLE_TTL_MS
		: SEVENTV_STYLE_EMPTY_TTL_MS;

	return Date.now() - (entry.t || 0) < ttl;
}

function getSevenTVStyleKey(userId, platform = "twitch") {
	const id = String(userId);

	return platform === "twitch" ? id : `${platform}:${id}`;
}

function isSevenTVStyleCached(userId, platform = "twitch") {
	if (!userId || (platform !== "twitch" && platform !== "kick")) {
		return true;
	}

	return isSevenTVStyleFresh(
		sevenTVStyleCache.get(getSevenTVStyleKey(userId, platform)),
	);
}

function pinSevenTVStyle(userId, platform = "twitch") {
	const entry = sevenTVStyleCache.get(getSevenTVStyleKey(userId, platform));

	if (entry) {
		entry.pinned = true;
	}
}

function get7TVStyle(userId, platform = "twitch", force = false) {
	const empty = { paint: null, badge: null };

	if (!userId || (platform !== "twitch" && platform !== "kick")) {
		return Promise.resolve(empty);
	}

	const id = String(userId);
	const key = getSevenTVStyleKey(id, platform);

	const cached = sevenTVStyleCache.get(key);

	if (!force && isSevenTVStyleFresh(cached)) {
		return Promise.resolve(cached);
	}

	if (sevenTVStylePending.has(key)) {
		return sevenTVStylePending.get(key);
	}

	const gqlPlatform = platform === "kick" ? "KICK" : "TWITCH";

	const promise = (async () => {
		try {
			const response = await fetch("https://api.7tv.app/v4/gql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: build7TVStyleQuery(gqlPlatform),
					variables: {
						platformId: id,
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`7TV GraphQL HTTP error: ${response.status}`);
			}

			const result = await response.json();

			if (result.errors) {
				console.error("7TV style GraphQL error:", result.errors);
			}

			const style = result.data?.users?.userByConnection?.style;
			const paint = style?.activePaint || null;

			if (paint) {
				paint.repeat = Boolean(
					paint.repeat ||
					paint.data?.layers?.some((layer) =>
						Boolean(layer?.ty?.repeating),
					),
				);
			}

			const resolved = {
				paint,
				badge: style?.activeBadge || null,
				t: Date.now(),
			};

			setBoundedCache(sevenTVStyleCache, key, resolved, SEVENTV_STYLE_CACHE_LIMIT);

			return resolved;
		} catch (error) {
			console.error("7TV style error:", error);

			return cached || empty;
		}
	})().finally(() => {
		sevenTVStylePending.delete(key);
	});

	sevenTVStylePending.set(key, promise);

	return promise;
}

async function get7TVPaint(userId, platform = "twitch") {
	const style = await get7TVStyle(userId, platform);

	return style.paint;
}

const PAINT_STYLE_PROPERTIES = [
	"backgroundImage",
	"backgroundSize",
	"backgroundPosition",
	"backgroundRepeat",
	"backgroundClip",
	"webkitBackgroundClip",
	"backgroundOrigin",
	"backgroundAttachment",
	"filter",
	"textShadow",
	"display",
	"position",
	"willChange",
];

function clearPaint(element, color) {
	if (!element) {
		return;
	}

	element._paintSeq = (element._paintSeq || 0) + 1;

	if (!element.classList.contains("seven-tv-painted")) {
		return;
	}

	element.classList.remove("seven-tv-painted");

	for (const property of PAINT_STYLE_PROPERTIES) {
		element.style[property] = "";
	}

	if (color) {
		element.style.color = color;
		element.style.webkitTextFillColor = color;
	}
}

let paintPlaceholderStyleReady = false;

function ensurePaintPlaceholderStyle() {
	if (paintPlaceholderStyleReady) {
		return;
	}

	paintPlaceholderStyleReady = true;

	const style = document.createElement("style");

	style.textContent = `
		.paint-loading {
			background-image: linear-gradient(90deg, var(--paint-base, currentColor) 0%, rgba(255, 255, 255, 0.95) 50%, var(--paint-base, currentColor) 100%) !important;
			background-size: 200% 100% !important;
			-webkit-background-clip: text !important;
			background-clip: text !important;
			color: transparent !important;
			-webkit-text-fill-color: transparent !important;
			animation: paint-loading-sweep 1.1s linear infinite;
		}

		@keyframes paint-loading-sweep {
			from { background-position: 200% 0; }
			to { background-position: -200% 0; }
		}
	`;

	document.head.appendChild(style);
}

function setPaintPlaceholder(element, enabled, color) {
	if (!element) {
		return;
	}

	if (enabled) {
		ensurePaintPlaceholderStyle();

		element.style.setProperty("--paint-base", color || "#ffffff");
		element.classList.add("paint-loading");

		return;
	}

	element.classList.remove("paint-loading");
	element.style.removeProperty("--paint-base");
}

async function applyMessagePaint(message, usePlaceholder = true) {
	const context = message?._cosmeticContext;

	if (!context) {
		return;
	}

	const token = (context.paintToken = (context.paintToken || 0) + 1);

	const targets = [context.usernameElement];

	if (context.colonElement) {
		targets.push(context.colonElement);
	}

	if (context.actionText) {
		targets.push(context.actionText);
	}

	const placeholderTargets = targets.filter(
		(element) => element !== context.actionText,
	);

	if (usePlaceholder && !isSevenTVStyleCached(context.userId, context.platform)) {
		for (const element of placeholderTargets) {
			setPaintPlaceholder(element, true, context.usernameColor);
		}
	}

	let paint = null;

	try {
		paint = await get7TVPaint(context.userId, context.platform);
	} catch (error) {
		console.error("Message paint error:", error);
	}

	for (const element of placeholderTargets) {
		setPaintPlaceholder(element, false);
	}

	if (token !== context.paintToken) {
		return;
	}

	if (!paint) {
		for (const element of targets) {
			clearPaint(element, context.usernameColor);
		}

		return;
	}

	await Promise.all(targets.map((element) => applyPaint(element, paint)));
}

function getUserMessages(userId, platform = "twitch") {
	const key = getSevenTVStyleKey(userId, platform);

	return (
		userMessageElements.get(key) ||
		userMessageElements.get(Number(key)) ||
		new Set()
	);
}

function applyUserCosmetics(userId, platform = "twitch") {
	for (const message of getUserMessages(userId, platform)) {
		applyMessagePaint(message, false);

		if (message._badgeContext) {
			refreshMessageBadges(message);
		}
	}
}

function getSevenTVStyleSignature(entry) {
	return `${entry?.paint?.id || ""}|${entry?.badge?.id || ""}`;
}

async function refresh7TVUserStyle(userId, platform = "twitch") {
	const key = getSevenTVStyleKey(userId, platform);

	const before = getSevenTVStyleSignature(sevenTVStyleCache.get(key));

	const style = await get7TVStyle(userId, platform, true);

	return before !== getSevenTVStyleSignature(style);
}

const pendingCosmeticRefreshes = new Map();

function schedule7TVUserCosmeticRefresh(userId, platform = "twitch") {
	const key = getSevenTVStyleKey(userId, platform);

	if (pendingCosmeticRefreshes.has(key)) {
		return;
	}

	pendingCosmeticRefreshes.set(
		key,
		setTimeout(async () => {
			pendingCosmeticRefreshes.delete(key);

			if (!getUserMessages(userId, platform).size) {
				sevenTVStyleCache.delete(key);
				sevenTVBadges.delete(key);

				return;
			}

			try {
				if (await refresh7TVUserStyle(userId, platform)) {
					applyUserCosmetics(userId, platform);
				}
			} catch (error) {
				console.error("Cosmetic refresh error:", error);
			}
		}, 400),
	);
}

const COSMETIC_REFRESH_MS = 30 * 1000;
const COSMETIC_REFRESH_BATCH = 15;
const COSMETIC_BULK_COOLDOWN_MS = 10 * 1000;

let cosmeticRefreshTimer = null;
let cosmeticRefreshCursor = 0;
let cosmeticBulkTimer = null;
let lastCosmeticBulkAt = 0;

function collectVisibleCosmeticUsers() {
	const users = [];

	for (const messages of userMessageElements.values()) {
		for (const message of messages) {
			const context = message._cosmeticContext;

			if (context && message.isConnected) {
				users.push({ userId: context.userId, platform: context.platform });

				break;
			}
		}
	}

	return users;
}

async function refreshVisibleCosmetics(limit = COSMETIC_REFRESH_BATCH) {
	if (document.hidden) {
		return;
	}

	const users = collectVisibleCosmeticUsers();

	if (!users.length) {
		return;
	}

	const start = cosmeticRefreshCursor % users.length;

	const batch = users.slice(start).concat(users.slice(0, start)).slice(0, limit);

	cosmeticRefreshCursor += batch.length;

	for (const user of batch) {
		try {
			if (await refresh7TVUserStyle(user.userId, user.platform)) {
				applyUserCosmetics(user.userId, user.platform);
			}
		} catch (error) {
			console.error("Cosmetic refresh error:", error);
		}
	}
}

function scheduleVisibleCosmeticRefresh() {
	if (cosmeticBulkTimer) {
		return;
	}

	const wait = Math.max(
		1500,
		COSMETIC_BULK_COOLDOWN_MS - (Date.now() - lastCosmeticBulkAt),
	);

	cosmeticBulkTimer = setTimeout(() => {
		cosmeticBulkTimer = null;
		lastCosmeticBulkAt = Date.now();

		refreshVisibleCosmetics(25);
	}, wait);
}

function startCosmeticRefreshLoop() {
	if (cosmeticRefreshTimer) {
		return;
	}

	cosmeticRefreshTimer = setInterval(refreshVisibleCosmetics, COSMETIC_REFRESH_MS);
}

const EMOTE_REFRESH_MS = 60 * 1000;

let emoteRefreshTimer = null;
let emoteRefreshing = false;
let lastEmoteRefreshAt = 0;

async function refreshChannelEmotes() {
	if (emoteRefreshing || Date.now() - lastEmoteRefreshAt < 15000) {
		return;
	}

	lastEmoteRefreshAt = Date.now();

	emoteRefreshing = true;
	window.mchatLiveRefresh = true;

	try {
		await Promise.allSettled([
			TWITCH_USER_ID ? load7TVEmotes() : null,
			CHANNEL ? loadBTTVEmotes() : null,
			CHANNEL ? loadFFZEmotes() : null,
			KICK_USER_ID ? load7TVKickEmotes() : null,
		]);
	} finally {
		emoteRefreshing = false;
		window.mchatLiveRefresh = false;
	}
}

function startEmoteRefreshLoop() {
	if (emoteRefreshTimer) {
		return;
	}

	emoteRefreshTimer = setInterval(refreshChannelEmotes, EMOTE_REFRESH_MS);

	startBadgeRefreshLoop();
	startCosmeticRefreshLoop();

	setTimeout(refreshChannelEmotes, 3000);

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) {
			refreshChannelEmotes();
		}
	});
}