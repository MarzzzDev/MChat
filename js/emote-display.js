const knownChatters = new Map();
const KNOWN_CHATTERS_LIMIT = 5000;

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

function registerChatter(user, color, userId, platform = "twitch", tags = {}) {
	if (!user) {
		return;
	}

	const key = String(user).toLowerCase();
	knownChatters.delete(key);
	knownChatters.set(key, {
		name: user,
		color,
		userId,
		platform,
		badges: tags?.badges || "",
		platformBadges: tags?.["platform-badges"] || null,
	});

	if (knownChatters.size > KNOWN_CHATTERS_LIMIT) {
		knownChatters.delete(knownChatters.keys().next().value);
	}
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

				emoji.style.margin = "0 var(--emote-spacing, 3px)";
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

	const mergedEffects = Array.from(new Set(existingEffects.concat(effects)));

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
		return Object.assign({}, seven, { provider: "7TV" });
	}

	if (bttvGlobalEmotes.has(word)) {
		return Object.assign({}, bttvGlobalEmotes.get(word), { provider: "BTTV" });
	}

	if (ffzGlobalEmotes.has(word)) {
		const emote = ffzGlobalEmotes.get(word);

		return Object.assign({}, emote, {
			provider: "FFZ",
			modifier: Boolean(emote.modifier),
			modifierFlags: Number(emote.modifierFlags || 0),
			effects: getFFZModifierEffects(emote),
		});
	}

	return null;
}

function findThirdPartyEmote(word, username = null, platform = "twitch") {
	if (platform === "youtube") {
		return null;
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
			return Object.assign({}, emote, { provider: "7TV" });
		}

		return findGlobalThirdPartyEmote(word);
	}

	if (sevenTVEmotes.has(word)) {
		const emote = sevenTVEmotes.get(word);

		if (!showUnlisted7TV && emote.listed === false) {
			return null;
		}

		return Object.assign({}, emote, { provider: "7TV" });
	}

	if (bttvEmotes.has(word)) {
		return Object.assign({}, bttvEmotes.get(word), { provider: "BTTV" });
	}

	if (ffzEmotes.has(word)) {
		const emote = ffzEmotes.get(word);

		return Object.assign({}, emote, {
			provider: "FFZ",
			modifier: Boolean(emote.modifier),
			modifierFlags: Number(emote.modifierFlags || 0),
			effects: getFFZModifierEffects(emote),
		});
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
		const spacing = Number(emoteSpacing) || 0;

		emote.style.marginLeft = `${(zero ? 0 : spacing) + half}px`;
		emote.style.marginRight = `${spacing + half}px`;
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
