async function get7TVColor(userId) {
	if (!userId) {
		return null;
	}

	userId = String(userId);

	if (sevenTVColors.has(userId)) {
		return sevenTVColors.get(userId);
	}

	if (sevenTVColorPromises.has(userId)) {
		return sevenTVColorPromises.get(userId);
	}

	const query = `
		query GetUserColor($platformId: String!) {
			users {
				userByConnection(
					platform: TWITCH
					platformId: $platformId
				) {
					style {
						color {
							r
							g
							b
							a
							hex
						}
					}
				}
			}
		}
	`;

	const promise = (async () => {
		try {
			const response = await fetch("https://api.7tv.app/v4/gql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query,
					variables: {
						platformId: userId,
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`7TV color HTTP error: ${response.status}`);
			}

			const result = await response.json();

			if (result.errors) {
				console.error("7TV color GraphQL error:", result.errors);

				sevenTVColors.set(userId, null);

				return null;
			}

			const color = result.data?.users?.userByConnection?.style?.color;

			if (!color) {
				sevenTVColors.set(userId, null);

				return null;
			}

			const cssColor = colorToCss(color);

			sevenTVColors.set(userId, cssColor);

			return cssColor;
		} catch (error) {
			console.error("7TV color error:", error);

			sevenTVColors.set(userId, null);

			return null;
		}
	})();

	sevenTVColorPromises.set(userId, promise);

	try {
		return await promise;
	} finally {
		sevenTVColorPromises.delete(userId);
	}
}

function loadTwemoji() {
	if (window.twemoji) {
		return Promise.resolve(window.twemoji);
	}

	if (twemojiReady) {
		return twemojiReady;
	}

	twemojiReady = new Promise((resolve, reject) => {
		const script = document.createElement("script");

		script.src =
			"https://cdn.jsdelivr.net/npm/twemoji@latest/dist/twemoji.min.js";

		script.onload = () => {
			if (window.twemoji) {
				resolve(window.twemoji);
			} else {
				reject(new Error("Twemoji loaded but was not found."));
			}
		};

		script.onerror = () => {
			reject(new Error("Failed to load Twemoji."));
		};

		document.head.appendChild(script);
	});

	return twemojiReady;
}

function get7TVEmoteFlags(emote) {
	return Number(emote?.data?.flags ?? emote?.flags ?? 0);
}

function is7TVZeroWidth(emote) {
	return Boolean(get7TVEmoteFlags(emote) & SEVENTV_EMOTE_FLAGS.ZERO_WIDTH);
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

	if (!host) {
		return null;
	}

	if (host.startsWith("//")) {
		return `https:${host}`;
	}

	if (!host.startsWith("http")) {
		return `https://${host}`;
	}

	return host;
}

function add7TVEmote(emote, target = sevenTVEmotes) {
	if (!emote?.name) {
		return;
	}

	const file = get7TVEmoteFile(emote);

	const host = get7TVHostUrl(emote);

	if (!file || !host) {
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

		zeroWidth: Boolean(flags & SEVENTV_EMOTE_FLAGS.ZERO_WIDTH),
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

		console.log(`Loaded ${sevenTVEmotes.size} total 7TV emotes.`);
	} catch (error) {
		console.error("7TV global emote error:", error);
	}
}

async function load7TVEmotes() {
	if (!TWITCH_USER_ID) {
		return;
	}

	try {
		const userResponse = await fetch(
			`https://7tv.io/v3/users/twitch/${TWITCH_USER_ID}`,
		);

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

		for (const emote of setData.emotes || []) {
			add7TVEmote(emote);
		}
		connectSevenTVEvents(emoteSetId);
		console.log(`Loaded ${sevenTVEmotes.size} 7TV emotes.`);
	} catch (error) {
		console.error("7TV emote error:", error);
	}
}

function getTwitchEmoteUrl(emote) {
	if (!emote?.id) {
		return null;
	}

	const id = String(emote.id);

	const formats = Array.isArray(emote.format) ? emote.format : [];

	if (formats.includes("animated")) {
		return (
			`https://static-cdn.jtvnw.net/` + `emoticons/v2/${id}/default/dark/3.0`
		);
	}

	return (
		emote.images?.url_4x ||
		emote.images?.url_2x ||
		emote.images?.url_1x ||
		`https://static-cdn.jtvnw.net/` + `emoticons/v2/${id}/default/dark/3.0`
	);
}

function normalizeImageUrl(url) {
	if (!url) {
		return null;
	}

	if (url.startsWith("//")) {
		return `https:${url}`;
	}

	return url;
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

		console.log(`Loaded ${ffzEmotes.size} FFZ emotes.`);
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

		for (const emote of globalData || []) {
			if (!emote.code || !emote.id) {
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

			const emotes = [
				...(userData.channelEmotes || []),
				...(userData.sharedEmotes || []),
			];

			for (const emote of emotes) {
				if (!emote.code || !emote.id) {
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

		console.log(`Loaded ${bttvEmotes.size} BTTV emotes.`);
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

function getPaintFallbackColor(paint) {
	const layers = paint?.data?.layers || [];

	for (const layer of layers) {
		const type = layer?.ty;

		if (!type) {
			continue;
		}

		if (type.__typename === "PaintLayerTypeSingleColor") {
			if (type.color) {
				return colorToCss(type.color);
			}
		}

		if (type.__typename === "PaintLayerTypeLinearGradient") {
			const color = type.stops?.[0]?.color;

			if (color) {
				return colorToCss(color);
			}
		}

		if (type.__typename === "PaintLayerTypeRadialGradient") {
			const color = type.stops?.[0]?.color;

			if (color) {
				return colorToCss(color);
			}
		}
	}

	return "rgba(255, 255, 255, 0.35)";
}

function get7TVPaintLayerUrls(paint, layer) {
	if (!paint?.id || !layer?.id) {
		return [];
	}

	const paintId = encodeURIComponent(String(paint.id));

	const layerId = encodeURIComponent(String(layer.id));

	return [
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

function loadPaintImage(url) {
	return new Promise((resolve) => {
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

async function getWorking7TVPaintLayerUrl(paint, layer) {
	const urls = get7TVPaintLayerUrls(paint, layer);

	for (const url of urls) {
		const workingUrl = await loadPaintImage(url);

		if (workingUrl) {
			return workingUrl;
		}
	}

	return null;
}

async function applyPaint(element, paint) {
	if (!element || !paint) {
		return;
	}

	const layers = paint?.data?.layers || [];

	if (!Array.isArray(layers) || !layers.length) {
		return;
	}

	element.classList.remove("seven-tv-painted");

	element.style.backgroundImage = "";

	element.style.backgroundColor = "";

	element.style.filter = "";

	element.style.textShadow = "none";

	element.style.color = "transparent";

	element.style.webkitTextFillColor = "transparent";

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

			const shape = type.shape || "circle";

			background =
				`${type.repeating ? "repeating-" : ""}` +
				`radial-gradient(` +
				`${shape}, ` +
				`${stops}` +
				`)`;
		} else if (type.__typename === "PaintLayerTypeImage") {
			const animatedUrl = await getWorking7TVPaintLayerUrl(paint, layer);

			if (!animatedUrl) {
				const image = type.images?.[0];

				if (!image?.url) {
					continue;
				}

				background = `url("${image.url}")`;
			} else {
				background = `url("${animatedUrl}")`;
			}
		}

		if (background) {
			backgrounds.push({
				background,

				opacity: Number(layer.opacity ?? 1),
			});
		}
	}

	if (!backgrounds.length) {
		return;
	}

	const imageLayers = backgrounds.map((layer) => layer.background).reverse();

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

function get7TVStyle(userId, platform = "twitch") {
	const empty = { paint: null, badge: null };

	if (!userId || (platform !== "twitch" && platform !== "kick")) {
		return Promise.resolve(empty);
	}

	const id = String(userId);
	const key = platform === "twitch" ? id : `${platform}:${id}`;

	if (sevenTVStyleCache.has(key)) {
		return Promise.resolve(sevenTVStyleCache.get(key));
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
			};

			sevenTVStyleCache.set(key, resolved);

			return resolved;
		} catch (error) {
			console.error("7TV style error:", error);

			return empty;
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