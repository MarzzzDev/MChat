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

		if (hideLinksEnabled && isLinkToken(part)) {
			if (pendingModifiers.length) {
				flushPending();
			}

			const trailing = part.match(/[),.!?]*$/)[0];

			container.appendChild(document.createTextNode("\u{1F517}" + trailing));

			continue;
		}

		if (pendingModifiers.length && /^\s+$/.test(part)) {
			pendingNodes.push(document.createTextNode(part));
			continue;
		}

		if (platform !== "youtube" && platform !== "tiktok" && BTTV_MODIFIERS.has(part)) {
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

		if (platform !== "youtube" && platform !== "tiktok" && ffzEffects.has(part)) {
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

		if (isLinkToken(part)) {
			const trailing = part.match(/[),.!?]*$/)[0];
			const linkText = trailing ? part.slice(0, -trailing.length) : part;
			const link = document.createElement("span");

			link.className = "chat-link";
			link.textContent = linkText;
			container.appendChild(link);

			if (trailing) {
				container.appendChild(document.createTextNode(trailing));
			}

			continue;
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

	const applySize = () => {
		const w = gif.naturalWidth;
		const h = gif.naturalHeight;

		if (!w || !h) {
			return;
		}

		const ratio = w / h;

		gif.style.setProperty("aspect-ratio", `${w} / ${h}`);
		gif.style.setProperty(
			"width",
			`calc(480px * var(--gif-scale, 1) * ${ratio})`,
			"important",
		);
		gif.style.setProperty("height", "auto", "important");
	};

	gif.addEventListener("load", applySize);

	if (gif.complete) {
		applySize();
	}

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

const EMOJI_STRIP_RE =
	/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Cf}\u{E0000}-\u{E007F}\u200d\ufe0f\u034f\u2800\u3164]/gu;
const EMOJI_TEST_RE = /\p{Extended_Pictographic}/u;

function isEmoteOnlyMessage(container) {
	if (!container || container.querySelector(".twitch-gif, .cheer")) {
		return false;
	}

	const content = container.textContent || "";

	if (content.replace(EMOJI_STRIP_RE, "").trim()) {
		return false;
	}

	return Boolean(
		container.querySelector(".emote, .twemoji") || EMOJI_TEST_RE.test(content),
	);
}

function renderMessageText(text, tags, username = null) {
	cheerRenderingActive = cheersEnabled && Number(tags?.bits) > 0;

	try {
		return renderMessageTextInner(text, tags, username);
	} finally {
		cheerRenderingActive = false;
	}
}

function removeWhitespaceBetweenEmotes(container) {
	if (emoteSpacing !== 0) return;

	const children = Array.from(container.childNodes);
	for (let index = 1; index < children.length - 1; index += 1) {
		const child = children[index];
		if (child.nodeType !== Node.TEXT_NODE || child.textContent.trim()) continue;

		const previous = children[index - 1];
		const next = children[index + 1];
		const emoteSelector = ".emote:not(.seven-tv-zero-width), .twemoji, .emote-overlay-target";
		if (previous.matches?.(emoteSelector) && next.matches?.(emoteSelector)) {
			child.remove();
		}
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
		removeWhitespaceBetweenEmotes(container);

		return container;
	}

	const twitchRanges = parseTwitchEmoteRanges(tags);

	const gifRanges = parseTwitchGifRanges(tags);

	const mediaRanges = twitchRanges.map((range) =>
		Object.assign({}, range, { type: "emote" }),
	);
	for (const gifRange of gifRanges) {
		mediaRanges.push(gifRange);
	}
	mediaRanges.sort((left, right) => left.start - right.start || left.end - right.end);

	if (!mediaRanges.length) {
		renderExternalText(container, text, username);

		renderTwemoji(container);
		removeWhitespaceBetweenEmotes(container);

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
	removeWhitespaceBetweenEmotes(container);

	return container;
}