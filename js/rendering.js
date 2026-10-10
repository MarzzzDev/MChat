const knownChatters = new Map();

const CHROME_MAJOR = Number(
	(navigator.userAgent.match(/Chrome\/(\d+)/) || [])[1] || 0,
);
const STROKE_VIA_SHADOW = CHROME_MAJOR > 0 && CHROME_MAJOR < 127;
let appliedStrokeKey = null;

function buildStrokeRing(radius, color) {
	const step = Math.max(0.1, 1 / radius);
	const layers = [];

	for (let angle = 0; angle < Math.PI * 2; angle += step) {
		const x = (Math.cos(angle) * radius).toFixed(3);
		const y = (Math.sin(angle) * radius).toFixed(3);

		layers.push(`${x}px ${y}px 0 ${color}`);
	}

	return layers.join(", ");
}

function applyStrokeMode() {
	if (!STROKE_VIA_SHADOW) {
		return;
	}

	const rootStyle = getComputedStyle(document.documentElement);
	const width = parseFloat(rootStyle.getPropertyValue("--stroke-width"));
	const color = rootStyle.getPropertyValue("--stroke-color").trim() || "black";
	const key = `${width}|${color}`;

	if (key === appliedStrokeKey) {
		return;
	}

	appliedStrokeKey = key;

	document.body.classList.add("stroke-shadow-mode");

	if (!(width > 0)) {
		document.documentElement.style.setProperty(
			"--stroke-shadow",
			"0 0 0 transparent",
		);
		return;
	}

	document.documentElement.style.setProperty(
		"--stroke-shadow",
		buildStrokeRing(width, color),
	);
}

window.applyStrokeMode = applyStrokeMode;

const MIN_NAME_BRIGHTNESS = 100;

const TWITCH_DEFAULT_COLORS = [
	"#FF0000",
	"#7c5cfb",
	"#008000",
	"#B22222",
	"#FF7F50",
	"#9ACD32",
	"#FF4500",
	"#2E8B57",
	"#DAA520",
	"#D2691E",
	"#5F9EA0",
	"#1E90FF",
	"#FF69B4",
	"#8A2BE2",
	"#	",
];

const BTTV_MODIFIERS = new Set([
	"w!",
	"h!",
	"v!",
	"z!",
	"c!",
	"l!",
	"r!",
	"p!",
	"s!",
]);

function registerChatter(user, color, userId, platform = "twitch") {
	if (!user) {
		return;
	}

	knownChatters.set(String(user).toLowerCase(), {
		name: user,
		color,
		userId,
		platform,
	});
}

function createMention(chatter, prefix = "") {
	const login = String(chatter.name).toLowerCase();
	const color = getTwitchDisplayColor(chatter.color, login);

	const mention = document.createElement("span");
	mention.className = "mention";
	mention.textContent = prefix + chatter.name;
	mention.style.color = color;
	mention.style.webkitTextFillColor = color;

	if (chatter.userId) {
		Promise.resolve(get7TVPaint(chatter.userId, chatter.platform))
			.then((paint) => {
				if (paint) {
					applyPaint(mention, paint);
				}
			})
			.catch((error) => console.error("Mention paint error:", error));
	}

	return mention;
}

function createEmote(url, alt) {
	const emote = document.createElement("img");

	emote.className = "emote";

	emote.src = url;

	emote.alt = alt;

	emote.title = alt;

	emote.loading = "eager";

	emote.decoding = "async";

	emote.draggable = false;

	return emote;
}

function renderTwemoji(container) {
	if (!container) {
		return;
	}

	loadTwemoji()
		.then((twemoji) => {
			twemoji.parse(container, {
				folder: "svg",

				ext: ".svg",

				base: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/",
			});

			const emojis = container.querySelectorAll("img.emoji");

			for (const emoji of emojis) {
				emoji.classList.add("twemoji");

				emoji.draggable = false;

				emoji.loading = "eager";

				emoji.decoding = "async";

				emoji.style.width = "1.2em";

				emoji.style.height = "1.2em";

				emoji.style.display = "inline-block";

				emoji.style.verticalAlign = "middle";

				emoji.style.margin = "0 0.05em";
			}
		})
		.catch((error) => {
			console.error("Twemoji error:", error);
		});
}

function applyFFZEffects(emote, effects) {
	if (!emote || !effects?.length) {
		return;
	}

	let scaleX = Number(emote.dataset.ffzScaleX || 1);

	let scaleY = Number(emote.dataset.ffzScaleY || 1);

	let rotate = Number(emote.dataset.ffzRotate || 0);

	const existingEffects = emote.dataset.ffzEffects
		? emote.dataset.ffzEffects.split(",").filter(Boolean)
		: [];

	for (const effect of effects) {
		switch (effect) {
			case "flipX":
				scaleX *= -1;
				break;

			case "flipY":
				scaleY *= -1;
				break;

			case "growX":
				scaleX *= 2;
				break;

			case "shrinkX":
				scaleX *= 0.5;
				break;
		}
	}

	emote.dataset.ffzScaleX = String(scaleX);

	emote.dataset.ffzScaleY = String(scaleY);

	emote.dataset.ffzRotate = String(rotate);

	const mergedEffects = Array.from(new Set([...existingEffects, ...effects]));

	emote.dataset.ffzEffects = mergedEffects.join(",");

	emote.classList.add("ffz-effect-transform");

	emote.style.setProperty("--ffz-scale-x", String(scaleX));

	emote.style.setProperty("--ffz-scale-y", String(scaleY));

	emote.style.setProperty("--ffz-rotate", `${rotate}deg`);

	for (const effect of effects) {
		switch (effect) {
			case "rainbow":
				emote.classList.add("ffz-effect-rainbow");
				break;

			case "hyperRed":
				emote.classList.add("ffz-effect-hyper-red");
				break;

			case "shake":
				emote.classList.add("ffz-effect-shake");
				break;

			case "cursed":
				emote.classList.add("ffz-effect-cursed");
				break;

			case "jam":
				emote.classList.add("ffz-effect-jam");
				break;

			case "bounce":
				emote.classList.add("ffz-effect-bounce");
				break;

			case "slide":
				emote.classList.add("ffz-effect-slide");
				break;

			case "appear":
				emote.classList.add("ffz-effect-appear");
				break;

			case "leave":
				emote.classList.add("ffz-effect-leave");
				break;

			case "rotate":
				emote.classList.add("ffz-effect-rotate");
				break;

			case "photocopy":
				emote.classList.add("ffz-effect-photocopy");
				break;
		}
	}
}

function applyFFZEffect(emote, effectName) {
	if (!emote || !effectName) {
		return false;
	}

	const effectData = ffzEffects.get(effectName);

	if (!effectData?.effects?.length) {
		return false;
	}

	applyFFZEffects(emote, effectData.effects);

	return true;
}

function applyFFZEffectToPrevious(container, effectName) {
	const effectData = ffzEffects.get(effectName);

	if (!effectData?.effects?.length) {
		return false;
	}

	const previous = getPreviousEmote(container);

	if (!previous) {
		return false;
	}

	return applyFFZEffect(previous, effectName);
}

function getFFZModifierEffects(emote) {
	if (!emote) {
		return [];
	}

	const effects = [];

	const flags = Number(emote.modifierFlags || 0);

	if (flags & FFZ_EFFECT_FLAGS.GROW_X) {
		effects.push("growX");
	}

	if (flags & FFZ_EFFECT_FLAGS.RAINBOW) {
		effects.push("rainbow");
	}

	if (flags & FFZ_EFFECT_FLAGS.HYPER_RED) {
		effects.push("hyperRed");
	}

	if (flags & FFZ_EFFECT_FLAGS.HYPER_SHAKE) {
		effects.push("shake");
	}

	if (flags & FFZ_EFFECT_FLAGS.CURSED) {
		effects.push("cursed");
	}

	if (flags & FFZ_EFFECT_FLAGS.JAM) {
		effects.push("jam");
	}

	if (flags & FFZ_EFFECT_FLAGS.BOUNCE) {
		effects.push("bounce");
	}

	return effects;
}

function findGlobalThirdPartyEmote(word) {
	const seven = sevenTVGlobalEmotes.get(word);

	if (seven && (showUnlisted7TV || seven.listed !== false)) {
		return {
			...seven,

			provider: "7TV",
		};
	}

	if (bttvGlobalEmotes.has(word)) {
		return {
			...bttvGlobalEmotes.get(word),

			provider: "BTTV",
		};
	}

	if (ffzGlobalEmotes.has(word)) {
		const emote = ffzGlobalEmotes.get(word);

		return {
			...emote,

			provider: "FFZ",

			modifier: Boolean(emote.modifier),

			modifierFlags: Number(emote.modifierFlags || 0),

			effects: getFFZModifierEffects(emote),
		};
	}

	return null;
}

function findThirdPartyEmote(word, username = null, platform = "twitch") {
	if (platform === "youtube") {
		if (selectedChannel) {
			const twitchChannelEmote = sevenTVEmotes.get(word);

			if (
				twitchChannelEmote &&
				(showUnlisted7TV || twitchChannelEmote.listed !== false)
			) {
				return {
					...twitchChannelEmote,

					provider: "7TV",
				};
			}
		}

		if (selectedKick) {
			const kickChannelEmote = sevenTVKickEmotes.get(word);

			if (
				kickChannelEmote &&
				(showUnlisted7TV || kickChannelEmote.listed !== false)
			) {
				return {
					...kickChannelEmote,

					provider: "7TV",
				};
			}
		}

		if (selectedChannel) {
			if (bttvEmotes.has(word)) {
				return {
					...bttvEmotes.get(word),

					provider: "BTTV",
				};
			}

			if (ffzEmotes.has(word)) {
				const emote = ffzEmotes.get(word);

				return {
					...emote,

					provider: "FFZ",

					modifier: Boolean(emote.modifier),

					modifierFlags: Number(emote.modifierFlags || 0),

					effects: getFFZModifierEffects(emote),
				};
			}
		}

		return findGlobalThirdPartyEmote(word);
	}

	const personalEmotes = get7TVPersonalEmotesForUser(username);

	if (personalEmotes.has(word)) {
		const personal = personalEmotes.get(word);

		if (!showUnlisted7TV && personal.listed === false) {
			return null;
		}

		return {
			id: personal.id,

			name: personal.name,

			url: personal.image,

			provider: "7TV",

			personal: true,

			listed: personal.listed,

			zeroWidth: personal.zeroWidth,
		};
	}

	if (platform === "kick") {
		const emote = sevenTVKickEmotes.get(word);

		if (emote && (showUnlisted7TV || emote.listed !== false)) {
			return {
				...emote,

				provider: "7TV",
			};
		}

		return findGlobalThirdPartyEmote(word);
	}

	if (sevenTVEmotes.has(word)) {
		const emote = sevenTVEmotes.get(word);

		if (!showUnlisted7TV && emote.listed === false) {
			return null;
		}

		return {
			...emote,
			provider: "7TV",
		};
	}

	if (bttvEmotes.has(word)) {
		return {
			...bttvEmotes.get(word),

			provider: "BTTV",
		};
	}

	if (ffzEmotes.has(word)) {
		const emote = ffzEmotes.get(word);

		return {
			...emote,

			provider: "FFZ",

			modifier: Boolean(emote.modifier),

			modifierFlags: Number(emote.modifierFlags || 0),

			effects: getFFZModifierEffects(emote),
		};
	}

	return null;
}

function getPreviousEmote(container) {
	let previous = container.lastElementChild;

	while (previous) {
		if (previous.classList.contains("emote-overlay-target")) {
			const base = previous.querySelector(
				":scope > .emote:not(.seven-tv-zero-width)",
			);

			if (base) {
				return base;
			}
		}

		if (
			previous.classList.contains("emote") &&
			!previous.classList.contains("seven-tv-zero-width")
		) {
			return previous;
		}

		previous = previous.previousElementSibling;
	}

	return null;
}

function getPreviousOverlayTarget(container) {
	const previous = container.lastElementChild;

	if (previous?.classList.contains("emote-overlay-target")) {
		return previous;
	}

	return null;
}

function create7TVOverlay(container, url, alt) {
	if (!url) {
		return false;
	}

	let target = getPreviousOverlayTarget(container);

	if (!target) {
		const previous = getPreviousEmote(container);

		if (!previous) {
			return false;
		}

		target = document.createElement("span");

		target.className = "emote-overlay-target";

		previous.replaceWith(target);

		target.appendChild(previous);
	}

	const overlay = createEmote(url, alt);

	overlay.classList.add("seven-tv-zero-width");

	overlay.setAttribute("aria-hidden", "true");

	target.appendChild(overlay);

	return true;
}

function widenEmote(emote, zero = false) {
	const apply = () => {
		if (!emote.naturalWidth || !emote.naturalHeight) {
			return;
		}

		const half = (65 * emote.naturalWidth) / emote.naturalHeight / 2;

		emote.style.marginLeft = `${(zero ? 0 : 3) + half}px`;
		emote.style.marginRight = `${3 + half}px`;
	};

	if (emote.complete && emote.naturalWidth) {
		apply();
	} else {
		emote.addEventListener("load", apply, { once: true });
	}
}

function removeTrailingWhitespace(container) {
	const last = container.lastChild;

	if (last && last.nodeType === Node.TEXT_NODE && !last.textContent.trim()) {
		last.remove();
	}
}

function applyBTTVModifiers(container, emote, modifiers) {
	let scaleX = Number(emote.dataset.ffzScaleX || 1);
	let scaleY = Number(emote.dataset.ffzScaleY || 1);
	let rotate = Number(emote.dataset.ffzRotate || 0);
	let transformed = false;
	let wide = false;

	for (const modifier of modifiers) {
		switch (modifier) {
			case "h!":
				scaleX *= -1;
				transformed = true;
				break;

			case "v!":
				scaleY *= -1;
				transformed = true;
				break;

			case "l!":
				rotate -= 90;
				transformed = true;
				break;

			case "r!":
				rotate += 90;
				transformed = true;
				break;

			case "w!":
				scaleX *= 2;
				transformed = true;
				wide = true;
				break;

			case "z!":
				removeTrailingWhitespace(container);
				emote.classList.add("bttv-effect-zero");
				break;

			case "c!":
				emote.classList.add("bttv-effect-cursed");
				break;

			case "p!":
				emote.classList.add("bttv-effect-party");
				break;

			case "s!":
				emote.classList.add("bttv-effect-shake");
				break;
		}
	}

	if (transformed) {
		emote.dataset.ffzScaleX = String(scaleX);
		emote.dataset.ffzScaleY = String(scaleY);
		emote.dataset.ffzRotate = String(rotate);

		emote.classList.add("ffz-effect-transform");
		emote.style.setProperty("--ffz-scale-x", String(scaleX));
		emote.style.setProperty("--ffz-scale-y", String(scaleY));
		emote.style.setProperty("--ffz-rotate", `${rotate}deg`);
	}

	if (wide) {
		widenEmote(emote, modifiers.includes("z!"));
	}
}

function renderExternalText(container, value, username = null, platform = "twitch") {
	const parts = value.split(/(\s+)/);

	let pendingModifiers = [];
	let pendingNodes = [];

	const flushPending = () => {
		for (const node of pendingNodes) {
			container.appendChild(node);
		}

		pendingModifiers = [];
		pendingNodes = [];
	};

	for (const part of parts) {
		if (!part) {
			continue;
		}

		if (pendingModifiers.length && /^\s+$/.test(part)) {
			pendingNodes.push(document.createTextNode(part));
			continue;
		}

		if (BTTV_MODIFIERS.has(part)) {
			pendingModifiers.push(part);
			pendingNodes.push(document.createTextNode(part));
			continue;
		}

		const external = findThirdPartyEmote(part, username, platform);

		const isPlainEmote =
			external &&
			!(external.provider === "7TV" && external.zeroWidth) &&
			!(external.provider === "FFZ" && external.modifier);

		if (pendingModifiers.length && !isPlainEmote) {
			flushPending();
		}

		if (ffzEffects.has(part)) {
			const applied = applyFFZEffectToPrevious(container, part);

			if (!applied) {
				container.appendChild(document.createTextNode(part));
			}

			continue;
		}

		if (external) {
			if (external.provider === "7TV" && external.zeroWidth) {
				const applied = create7TVOverlay(
					container,
					external.url,
					external.name,
				);

				if (!applied) {
					container.appendChild(createEmote(external.url, external.name));
				}

				continue;
			}

			const emote = createEmote(external.url, external.name);

			if (external.provider === "FFZ" && external.modifier) {
				const effects = getFFZModifierEffects(external);

				if (effects.length) {
					const applied = applyEffectsToPreviousEmote(container, effects);

					if (!applied) {
						container.appendChild(emote);
					}

					continue;
				}
			}

			if (pendingModifiers.length) {
				applyBTTVModifiers(container, emote, pendingModifiers);
				pendingModifiers = [];
				pendingNodes = [];
			}

			container.appendChild(emote);

			continue;
		}

		if (cheerRenderingActive) {
			const cheer = parseCheermote(part);

			if (cheer) {
				container.appendChild(createCheermote(cheer, part));

				continue;
			}
		}

		if (highlightsEnabled) {
			try {
				const mentionMatch = part.match(/^(@?)(\w{2,25})(\W*)$/);

				if (mentionMatch) {
					const [, prefix, name, trailing] = mentionMatch;

					const chatter = knownChatters.get(name.toLowerCase());

					const isEmote =
						!prefix && findThirdPartyEmote(name, username, platform);

					if (chatter && !isEmote) {
						container.appendChild(createMention(chatter, prefix));

						if (trailing) {
							container.appendChild(document.createTextNode(trailing));
						}

						continue;
					}
				}
			} catch (error) {
				console.error("Mention error:", error);
			}
		}

		container.appendChild(document.createTextNode(part));
	}

	flushPending();
}

function parseTwitchEmoteRanges(tags) {
	const result = [];

	if (!tags.emotes) {
		return result;
	}

	for (const group of tags.emotes.split("/")) {
		const separator = group.indexOf(":");

		if (separator === -1) {
			continue;
		}

		const id = group.substring(0, separator);

		const ranges = group.substring(separator + 1);

		for (const range of ranges.split(",")) {
			const dash = range.indexOf("-");

			if (dash === -1) {
				continue;
			}

			const start = Number(range.substring(0, dash));

			const end = Number(range.substring(dash + 1));

			if (Number.isNaN(start) || Number.isNaN(end)) {
				continue;
			}

			result.push({
				start,
				end,
				id,
			});
		}
	}

	result.sort((a, b) => a.start - b.start);

	return result;
}

function parseTwitchGifRanges(tags) {
	const result = [];

	if (!gifsEnabled || !tags.gifs) {
		return result;
	}

	for (const entry of String(tags.gifs).split(",")) {
		if (!entry) {
			continue;
		}

		const firstPipe = entry.indexOf("|");

		if (firstPipe === -1) {
			continue;
		}

		const secondPipe = entry.indexOf("|", firstPipe + 1);

		if (secondPipe === -1) {
			continue;
		}

		const rangeText = entry.substring(0, firstPipe);

		const gifId = entry.substring(firstPipe + 1, secondPipe);

		const gifUrl = entry.substring(secondPipe + 1);

		const dash = rangeText.indexOf("-");

		if (dash === -1 || !gifUrl) {
			continue;
		}

		const start = Number(rangeText.substring(0, dash));

		const end = Number(rangeText.substring(dash + 1));

		if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
			continue;
		}

		result.push({
			start,
			end,
			id: gifId,
			url: gifUrl,
			type: "gif",
		});
	}

	result.sort((a, b) => a.start - b.start || a.end - b.end);

	return result;
}

function createTwitchGif(url, alt = "Twitch GIF") {
	if (!url) {
		return null;
	}

	const gif = createEmote(url, alt);

	gif.classList.add("twitch-gif", "twitch-gif-large");

	gif.dataset.twitchGif = "true";

	gif.setAttribute("role", "img");

	gif.addEventListener("error", () => {
		const fallback = document.createTextNode(alt);

		gif.replaceWith(fallback);
	});

	return gif;
}

function applyEffectsToPreviousEmote(container, effects) {
	const previous = getPreviousEmote(container);

	if (!previous) {
		return false;
	}

	applyFFZEffects(previous, effects);

	return true;
}

let cheerRenderingActive = false;

const CHEER_PREFIXES = new Set([
	"cheer",
	"bibblethump",
	"cheerwhal",
	"corgo",
	"uni",
	"showlove",
	"party",
	"seemsgood",
	"pride",
	"kappa",
	"frankerz",
	"heyguys",
	"dansgame",
	"elegiggle",
	"trihard",
	"kreygasm",
	"4head",
	"swiftrage",
	"notlikethis",
	"failfish",
	"vohiyo",
	"pjsalt",
	"mrdestructoid",
	"bday",
	"ripcheer",
	"shamrock",
	"streamlabs",
	"muxy",
	"holidaycheer",
	"goal",
	"anon",
	"charity",
]);

const CHEER_TIERS = [
	{ id: 100000, color: "#ffb31a" },
	{ id: 10000, color: "#f43021" },
	{ id: 5000, color: "#0099fe" },
	{ id: 1000, color: "#1db2a5" },
	{ id: 100, color: "#9c3ee8" },
	{ id: 1, color: "#979797" },
];

function parseCheermote(word) {
	const match = /^([A-Za-z0-9]*?[A-Za-z])(\d{1,7})$/.exec(word);

	if (!match) {
		return null;
	}

	const prefix = match[1].toLowerCase();

	if (!CHEER_PREFIXES.has(prefix)) {
		return null;
	}

	const amount = Number(match[2]);

	if (!(amount > 0)) {
		return null;
	}

	const tier = CHEER_TIERS.find((entry) => amount >= entry.id);

	return { prefix, amount, tier };
}

function createCheermote(info, word) {
	const wrapper = document.createElement("span");

	wrapper.className = "cheer";

	const url =
		`https://d3aqoihi2n8ty8.cloudfront.net/actions/` +
		`${info.prefix}/dark/animated/${info.tier.id}/4.gif`;

	const emote = createEmote(url, word);

	emote.addEventListener(
		"error",
		() => {
			wrapper.replaceWith(document.createTextNode(word));
		},
		{ once: true },
	);

	const amount = document.createElement("span");

	amount.className = "cheer-amount";

	amount.style.color = info.tier.color;

	amount.textContent = String(info.amount);

	wrapper.append(emote, amount);

	return wrapper;
}

function renderMessageText(text, tags, username = null) {
	cheerRenderingActive = cheersEnabled && Number(tags?.bits) > 0;

	try {
		return renderMessageTextInner(text, tags, username);
	} finally {
		cheerRenderingActive = false;
	}
}

function renderMessageTextInner(text, tags, username = null) {
	const container = document.createElement("span");

	container.className = "text";

	if (Array.isArray(tags.segments)) {
		const platform = tags.platform || "twitch";

		for (const segment of tags.segments) {
			if (segment.type === "emote" && segment.url) {
				container.appendChild(createEmote(segment.url, segment.name || ""));
			} else if (segment.text) {
				renderExternalText(container, segment.text, username, platform);
			}
		}

		renderTwemoji(container);

		return container;
	}

	const twitchRanges = parseTwitchEmoteRanges(tags);

	const gifRanges = parseTwitchGifRanges(tags);

	const mediaRanges = [
		...twitchRanges.map((range) => ({
			...range,
			type: "emote",
		})),
		...gifRanges,
	].sort((a, b) => a.start - b.start || a.end - b.end);

	if (!mediaRanges.length) {
		renderExternalText(container, text, username);

		renderTwemoji(container);

		return container;
	}

	let cursor = 0;

	for (const range of mediaRanges) {
		if (range.start < cursor) {
			continue;
		}

		if (range.start > cursor) {
			renderExternalText(
				container,
				text.substring(cursor, range.start),
				username,
			);
		}

		if (range.type === "gif") {
			container.classList.add("has-twitch-gif");
			const altText =
				text.substring(range.start, range.end + 1) || "Twitch GIF";

			const gif = createTwitchGif(range.url, altText);

			if (gif) {
				if (range.id) {
					gif.dataset.twitchGifId = String(range.id);
				}

				container.appendChild(gif);
			} else {
				container.appendChild(
					document.createTextNode(text.substring(range.start, range.end + 1)),
				);
			}

			cursor = range.end + 1;

			continue;
		}

		const twitchEmote = twitchEmotes.get(String(range.id));

		const url =
			twitchEmote?.url ||
			`https://static-cdn.jtvnw.net/` +
			`emoticons/v2/${range.id}` +
			`/default/dark/3.0`;

		const name =
			twitchEmote?.name || text.substring(range.start, range.end + 1);

		const emote = createEmote(url, name);

		if (twitchEmote?.animated) {
			emote.dataset.twitchAnimated = "true";
		}

		container.appendChild(emote);

		cursor = range.end + 1;
	}

	if (cursor < text.length) {
		renderExternalText(container, text.substring(cursor), username);
	}

	renderTwemoji(container);

	return container;
}

function getReplyInfo(tags, msg) {
	const replyUsername = tags["reply-parent-display-name"] || null;

	if (!replyUsername) {
		let cleanMessage = msg.trim();

		if (tags["is-action"]) {
			cleanMessage = cleanMessage
				.replace(/^\x01?ACTION /, "")
				.replace(/\x01$/, "");
		}

		return { username: null, message: cleanMessage };
	}

	let cleanMessage = msg.trim();
	const escapedUsername = replyUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const replyPrefix = new RegExp(
		`^\\x01?ACTION\\s+@${escapedUsername}\\s*`,
		"i",
	);

	cleanMessage = cleanMessage.replace(replyPrefix, "").replace(/\x01$/, "");

	return { username: replyUsername, message: cleanMessage };
}

function getTwitchDisplayColor(color, login) {
	if (typeof color === "string" && color) {
		let hex = color.trim();

		if (!hex.startsWith("#")) {
			hex = `#${hex}`;
		}

		if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);

			const brightnessOf = (value) => {
				const vr = parseInt(value.slice(1, 3), 16);
				const vg = parseInt(value.slice(3, 5), 16);
				const vb = parseInt(value.slice(5, 7), 16);

				return (vr * 299 + vg * 587 + vb * 114) / 1000;
			};

			if (brightnessOf(hex) >= MIN_NAME_BRIGHTNESS) {
				return hex;
			}

			for (let amount = 5; amount <= 60; amount += 5) {
				const lightened = lightenColor(hex, amount);

				if (brightnessOf(lightened) >= MIN_NAME_BRIGHTNESS) {
					return lightened;
				}
			}

			return lightenColor(hex, 60);
		}
	}

	const nick = String(login || "").toLowerCase();

	if (!nick.length) {
		return TWITCH_DEFAULT_COLORS[0];
	}

	const index =
		(nick.charCodeAt(0) + nick.charCodeAt(nick.length - 1)) %
		TWITCH_DEFAULT_COLORS.length;

	return TWITCH_DEFAULT_COLORS[index];
}

function lightenColor(hex, amount) {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h, s;
	const l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;

		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	const newL = Math.min(1, l + amount / 100);

	return hslToHex(h, s, newL);
}

function hslToHex(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	const toHex = (x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

let lastRepeat = null;

function isMessageHidden(user, msg, tags = {}) {
    if (botFilterUsers.length) {
        const names = [user, tags.login, tags["display-name"]]
            .filter(Boolean)
            .map((name) => String(name).toLowerCase());

        if (names.some((name) => botFilterUsers.includes(name))) {
            return true;
        }
    }

    if (messageFilters.length) {
        const text = String(msg || "");

        if (
            messageFilters.some((word) => {
                const filter = String(word || "").trim();

                if (!filter) {
                    return false;
                }

                const escaped = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                return new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "i").test(text);
            })
        ) {
            return true;
        }
    }

    return false;
}
function getRepeatKey(replyInfo, tags) {
	if (
		tags["hl-kind"] ||
		tags["custom-reward-id"] ||
		tags["msg-id"] === "highlighted-message" ||
		String(tags["first-msg"]) === "1" ||
		Number(tags.bits) > 0 ||
		tags.gifs ||
		tags["reply-parent-display-name"]
	) {
		return null;
	}

	const key = String(replyInfo.message || "")
		.trim()
		.replace(/\s+/g, " ")
		.toLowerCase();

	return key || null;
}

function setRepeatBadge(element, count, animate = true) {
	let badge = element.querySelector(":scope > .msg-count");

	if (!badge) {
		badge = document.createElement("span");

		badge.className = "msg-count";

		element.appendChild(badge);
	}

	badge.textContent = `x${count}`;

	if (animate) {
		badge.classList.remove("msg-count-pop");

		void badge.offsetWidth;

		badge.classList.add("msg-count-pop");
	}
}

function bumpRepeat(state, previewEntry) {
	state.count += 1;

	setRepeatBadge(state.element, state.count);

	if (state.entry) {
		state.entry.count = state.count;
		state.entry.createdAt = Date.now();

		schedulePreviewFade(state.entry);

		if (previewEntry && previewEntry !== state.entry) {
			const index = previewMessageCache.indexOf(previewEntry);

			if (index !== -1) {
				previewMessageCache.splice(index, 1);
			}
		}

		return;
	}

	scheduleMessageFade(
		state.element,
		state.element.dataset.userKey || null,
	);
}

function placeInChat(chat, element) {
	while (chat.querySelectorAll(":scope > .message").length >= 100) {
		const oldest = newestTopEnabled
			? chat.lastElementChild
			: chat.firstElementChild;

		if (!oldest) {
			break;
		}

		clearTimeout(oldest._fadeTimer);
		clearTimeout(oldest._removeTimer);
		removePlatformElement(oldest);
	}

	if (newestTopEnabled && chat.firstChild) {
		chat.insertBefore(element, chat.firstChild);
	} else {
		chat.appendChild(element);
	}
}

function registerMessageId(message, messageId) {
	if (!messageId) {
		return;
	}

	const id = String(messageId);
	message._messageIds ??= new Set();
	message._messageIds.add(id);
	messageElements.set(id, message);
}

function unregisterMessageIds(message) {
	for (const id of message._messageIds || []) {
		if (messageElements.get(id) === message) {
			messageElements.delete(id);
		}
	}

	message._messageIds?.clear();
}

function scrollPreviewToLatest(previewChat) {
	previewChat.scrollTop = newestTopEnabled ? 0 : previewChat.scrollHeight;
}

	function scheduleMessageFade(message, userKey) {
	clearTimeout(message._fadeTimer);
	clearTimeout(message._removeTimer);

	message.style.animation = "";

	if (fade === false) {
		return;
	}

	message._fadeTimer = setTimeout(
		() => {
			message.style.animation = "messageFadeOut 1s ease-in forwards";

			message._removeTimer = setTimeout(() => {
				message.remove();
				unregisterMessageIds(message);

				if (userKey && userMessageElements.has(userKey)) {
					userMessageElements.get(userKey).delete(message);

					if (userMessageElements.get(userKey).size === 0) {
						userMessageElements.delete(userKey);
					}
				}
			}, 1000);
		},
		Math.max(0, fade * 1000 - 1000),
	);
}

const previewMessageCache = [];
const PREVIEW_CACHE_LIMIT = 12;
const PREVIEW_FADE_OUT_MS = 1000;

function removePreviewEntry(entry) {
	clearTimeout(entry.fadeTimer);
	clearTimeout(entry.removeTimer);

	const index = previewMessageCache.indexOf(entry);

	if (index !== -1) {
		previewMessageCache.splice(index, 1);
	}

	const element = entry.element;
	entry.element = null;

	if (!element) {
		return;
	}

	element.remove();

	const set = userMessageElements.get(entry.userId);

	if (set) {
		set.delete(element);

		if (set.size === 0) {
			userMessageElements.delete(entry.userId);
		}
	}
}

function schedulePreviewFade(entry) {
	clearTimeout(entry.fadeTimer);
	clearTimeout(entry.removeTimer);

	const element = entry.element;

	if (!element) {
		return;
	}

	element.style.animation = "";

	if (fade === false) {
		return;
	}

	const life = entry.createdAt + fade * 1000 - Date.now();

	if (life <= 0) {
		removePreviewEntry(entry);
		return;
	}

	entry.fadeTimer = setTimeout(
		() => {
			const left = Math.max(0, entry.createdAt + fade * 1000 - Date.now());

			const duration = Math.min(left, PREVIEW_FADE_OUT_MS);
			const offset = PREVIEW_FADE_OUT_MS - duration;

			element.style.animation = `messageFadeOut ${PREVIEW_FADE_OUT_MS}ms ease-in ${-offset}ms forwards`;

			entry.removeTimer = setTimeout(() => {
				removePreviewEntry(entry);
			}, duration);
		},
		Math.max(0, life - PREVIEW_FADE_OUT_MS),
	);
}

function reschedulePreviewFades() {
	for (const entry of [...previewMessageCache]) {
		schedulePreviewFade(entry);
	}
}

function addPreviewMessage(user, msg, usernameColor, userId, tags = {}) {
	const previewChat = document.getElementById("chat");

	if (!previewChat) {
		return;
	}

	const entry = {
		user,
		msg,
		usernameColor,
		userId,
		tags,
		createdAt: Date.now(),
		element: null,
		fadeTimer: null,
		removeTimer: null,
	};

	previewMessageCache.push(entry);

	while (previewMessageCache.length > PREVIEW_CACHE_LIMIT) {
		removePreviewEntry(previewMessageCache[0]);
	}

	const result = onMsg(
		user,
		msg,
		usernameColor,
		userId,
		tags,
		previewChat,
		null,
		entry,
	);

	requestAnimationFrame(() => {
		scrollPreviewToLatest(previewChat);
	});

	return result;
}

function rerenderPreviewChat() {
	const previewChat = document.getElementById("chat");

	if (!previewChat) {
		return;
	}

	for (const entry of previewMessageCache) {
		clearTimeout(entry.fadeTimer);
		clearTimeout(entry.removeTimer);
		entry.element = null;
	}

	previewChat.innerHTML = "";
	messageElements.clear();
	userMessageElements.clear();
	lastRepeat = null;

	const now = Date.now();

	for (const entry of [...previewMessageCache]) {
		if (fade !== false && now - entry.createdAt >= fade * 1000) {
			removePreviewEntry(entry);
			continue;
		}

		if (entry.user === "JamiMeow" && !botsEnabled) {
			continue;
		}

		onMsg(
			entry.user,
			entry.msg,
			entry.usernameColor,
			entry.userId,
			entry.tags,
			previewChat,
			null,
			entry,
		);
	}

	requestAnimationFrame(() => {
		scrollPreviewToLatest(previewChat);
	});
}

window.addPreviewMessage = addPreviewMessage;
window.rerenderPreviewChat = rerenderPreviewChat;
window.reschedulePreviewFades = reschedulePreviewFades;


async function onMsg(
	user,
	msg,
	usernameColor,
	userId,
	tags,
	targetChat = null,
	messageId = null,
	previewEntry = null,
) {
	const chat = targetChat || document.getElementById("chat");

	if (!chat) {
		return;
	}

	applyStrokeMode();

	const platform = tags.platform || "twitch";
	const userKey =
		userId == null ? null : platform === "twitch" ? userId : `${platform}:${userId}`;

	if (isMessageHidden(user, msg, tags)) {
		return;
	}

	registerChatter(user, usernameColor, userId, platform);

	const replyInfo = getReplyInfo(tags, msg);
	const repeatKey = collapseEnabled ? getRepeatKey(replyInfo, tags) : null;

	if (
		repeatKey &&
		lastRepeat &&
		lastRepeat.key === repeatKey &&
		lastRepeat.element.isConnected &&
		lastRepeat.element.parentNode === chat
	) {
		registerMessageId(lastRepeat.element, messageId);
		bumpRepeat(lastRepeat, previewEntry);
		return;
	}

	const message = document.createElement("div");
	message.className = "message";
	message.dataset.platform = platform;

	if (wrapEnabled) {
		message.classList.add("wrap-message");
	}

	message.style.setProperty("--user-color", usernameColor);

	const badges = badgesEnabled
		? platform === "twitch"
			? createTwitchBadges(tags)
			: createPlatformBadges(tags)
		: document.createElement("span");

	const ffzRoomBadge = platform === "twitch" ? createFFZRoomBadge(tags) : null;

	if (ffzRoomBadge) {
		const twitchBadge = badges.querySelector(
			`.badge[data-badge-type="${ffzRoomBadge.type}"]`,
		);

		if (twitchBadge) {
			twitchBadge.replaceWith(ffzRoomBadge.img);
		} else {
			badges.appendChild(ffzRoomBadge.img);
		}
	}

	badges.classList.add("message-badges");

	const authorGroup = document.createElement("span");
	authorGroup.className = "message-author";

	const usernameElement = document.createElement("span");
	usernameElement.className = "username";
	usernameElement.textContent = user + (tags["is-action"] ? "\u00A0" : ":\u00A0");
	usernameElement.style.color = usernameColor;
	usernameElement.style.webkitTextFillColor = usernameColor;

	const text = renderMessageText(replyInfo.message, tags, user);

	if (tags["is-action"]) {
		if (userId) {
			get7TVPaint(userId, platform).then((paint) => {
				if (paint) {
					applyPaint(text, paint);
				} else {
					text.style.color = usernameColor;
					text.style.webkitTextFillColor = usernameColor;
				}
			});
		} else {
			text.style.color = usernameColor;
			text.style.webkitTextFillColor = usernameColor;
		}
	}

	const indicatorPlatform = tags["preview-platform"] || platform;

	if (platformIndicatorEnabled && !previewEntry && isMultiChat()) {
		const indicator = createPlatformIndicator(platform);

		if (indicator) {
			message.appendChild(indicator);
		}
	}

	authorGroup.appendChild(badges);
	authorGroup.appendChild(usernameElement);

	message.appendChild(authorGroup);
	message.appendChild(text);

	applyMessageHighlights(message, tags, user);
	placeInChat(chat, message);

	if (typeof applyMessageAlignment === "function") {
		applyMessageAlignment(message);
	}

	if (messageId) {
		message.dataset.messageId = messageId;
		registerMessageId(message, messageId);
	}

	if (userId) {
		if (!userMessageElements.has(userKey)) {
			userMessageElements.set(userKey, new Set());
		}

		userMessageElements.get(userKey).add(message);

		get7TVPaint(userId, platform).then((paint) => {
			if (paint) {
				applyPaint(usernameElement, paint);
			}
		});

		if (badgesEnabled && platform === "twitch") {
			createExternalBadges(userId, tags).then((externalBadges) => {
				if (externalBadges.children.length > 0) {
					externalBadges.classList.add("message-badges");
					authorGroup.insertBefore(externalBadges, usernameElement);
				}
			});
		}

		if (badgesEnabled && platform === "kick") {
			create7TVBadges(userId, "kick").then((sevenTVBadgeContainer) => {
				if (sevenTVBadgeContainer.children.length > 0) {
					sevenTVBadgeContainer.classList.add("message-badges");
					authorGroup.insertBefore(sevenTVBadgeContainer, usernameElement);
				}
			});
		}
	}

	if (userKey) {
		message.dataset.userKey = userKey;
	}

	if (repeatKey) {
		const count = previewEntry?.count > 1 ? previewEntry.count : 1;

		lastRepeat = {
			key: repeatKey,
			element: message,
			count,
			entry: previewEntry,
		};

		if (count > 1) {
			setRepeatBadge(message, count, false);
		}
	} else {
		lastRepeat = null;
	}

	if (previewEntry) {
		previewEntry.element = message;
		schedulePreviewFade(previewEntry);
	} else {
		scheduleMessageFade(message, userKey);
	}
}
