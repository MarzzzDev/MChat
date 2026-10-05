const PLATFORM_PROXY_URL = "https://dark-sky-7185.marseceva.workers.dev/";

function getPlatformProxy() {
	const value = String(params.get("proxy") || PLATFORM_PROXY_URL || "").trim();

	return value.replace(/\/+$/, "");
}

function proxiedUrl(target) {
	return `${getPlatformProxy()}/?u=${encodeURIComponent(target)}`;
}

async function platformFetch(url, init = {}) {
	if (!getPlatformProxy()) {
		return fetch(url, init);
	}

	return fetch(proxiedUrl(url), init);
}

function removePlatformElement(element) {
	element.remove();

	const messageId = element.dataset.messageId;

	if (messageId) {
		messageElements.delete(messageId);
	}

	for (const [key, set] of userMessageElements) {
		if (set.delete(element) && set.size === 0) {
			userMessageElements.delete(key);
		}
	}
}

function removePlatformMessage(messageId) {
	if (!messageId) {
		return;
	}

	const element = messageElements.get(String(messageId));

	if (element) {
		removePlatformElement(element);
	}
}

function removePlatformUserMessages(platform, userId) {
	if (userId == null) {
		return;
	}

	const set = userMessageElements.get(`${platform}:${userId}`);

	if (!set) {
		return;
	}

	for (const element of [...set]) {
		removePlatformElement(element);
	}
}

function clearPlatformMessages(platform) {
	const chat = document.getElementById("chat");

	if (!chat) {
		return;
	}

	for (const element of chat.querySelectorAll(
		`.message[data-platform="${platform}"]`,
	)) {
		removePlatformElement(element);
	}
}

function letterBadgeIcon(background, label, fontSize = 20) {
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
		`<rect width="32" height="32" rx="6" fill="${background}"/>` +
		`<text x="16" y="${16 + fontSize * 0.36}" font-size="${fontSize}" ` +
		`font-weight="700" text-anchor="middle" fill="#fff" ` +
		`font-family="Arial,sans-serif">${label}</text></svg>`;

	return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function checkBadgeIcon(background) {
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
		`<rect width="32" height="32" rx="16" fill="${background}"/>` +
		`<path d="M9 17l5 5 9-11" stroke="#fff" stroke-width="3.5" fill="none" ` +
		`stroke-linecap="round" stroke-linejoin="round"/></svg>`;

	return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function glyphBadgeIcon(background, shapes, radius = 6) {
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
		`<rect width="32" height="32" rx="${radius}" fill="${background}"/>` +
		`<g fill="#fff">${shapes}</g></svg>`;

	return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function createPlatformBadges(tags) {
	const container = document.createElement("span");

	container.className = "badges platform-badges";

	for (const badge of tags["platform-badges"] || []) {
		const img = createBadge(badge.url, badge.title);

		if (img) {
			img.alt = badge.title || "";

			if (badge.fallback) {
				img.addEventListener(
					"error",
					() => {
						img.src = badge.fallback;
					},
					{ once: true },
				);
			}

			container.appendChild(img);
		}
	}

	return container;
}

function isCommandMessage(text) {
	return String(text || "")
		.trim()
		.startsWith("!");
}

function emitPlatformMessage({
	platform,
	username,
	color,
	userId,
	messageId,
	segments,
	badges = [],
	extraTags = {},
}) {
	const text = segments
		.map((segment) => (segment.type === "emote" ? segment.name : segment.text))
		.join("");

	const tags = {
		platform,
		segments,
		emotes: "",
		gifs: "",
		badges: "",
		"platform-badges": badges,
		"display-name": username,
		"user-id": userId,
		"is-action": false,
		"custom-reward-id": "",
		...extraTags,
	};

	Promise.resolve(
		onMsg(username, text, color, userId, tags, null, messageId),
	).catch((error) => console.error(`${platform} message rendering error:`, error));
}