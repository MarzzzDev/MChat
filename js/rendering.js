function createEmote(
    url,
    alt
) {
    const emote =
        document.createElement("img");

    emote.className =
        "emote";

    emote.src =
        url;

    emote.alt =
        alt;

    emote.title =
        alt;

    emote.loading =
        "eager";

    emote.decoding =
        "async";

    emote.draggable =
        false;

    return emote;
}

function renderTwemoji(container) {
    if (!container) {
        return;
    }

    loadTwemoji()
        .then(twemoji => {
            twemoji.parse(
                container,
                {
                    folder: "svg",

                    ext: ".svg",

                    base:
                        "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/"
                }
            );

            const emojis =
                container.querySelectorAll(
                    "img.emoji"
                );

            for (
                const emoji
                of emojis
            ) {
                emoji.classList.add(
                    "twemoji"
                );

                emoji.draggable =
                    false;

                emoji.loading =
                    "eager";

                emoji.decoding =
                    "async";

                emoji.style.width =
                    "1.2em";

                emoji.style.height =
                    "1.2em";

                emoji.style.display =
                    "inline-block";

                emoji.style.verticalAlign =
                    "-0.2em";

                emoji.style.margin =
                    "0 0.05em";
            }
        })
        .catch(error => {
            console.error(
                "Twemoji error:",
                error
            );
        });
}

function applyFFZEffects(
    emote,
    effects
) {
    if (
        !emote ||
        !effects?.length
    ) {
        return;
    }

    let scaleX =
        Number(
            emote.dataset.ffzScaleX ||
            1
        );

    let scaleY =
        Number(
            emote.dataset.ffzScaleY ||
            1
        );

    let rotate =
        Number(
            emote.dataset.ffzRotate ||
            0
        );

    const existingEffects =
        emote.dataset.ffzEffects
            ? emote.dataset.ffzEffects
                .split(",")
                .filter(Boolean)
            : [];

    for (
        const effect
        of effects
    ) {
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

    emote.dataset.ffzScaleX =
        String(scaleX);

    emote.dataset.ffzScaleY =
        String(scaleY);

    emote.dataset.ffzRotate =
        String(rotate);

    const mergedEffects =
        Array.from(
            new Set([
                ...existingEffects,
                ...effects
            ])
        );

    emote.dataset.ffzEffects =
        mergedEffects.join(",");

    emote.classList.add(
        "ffz-effect-transform"
    );

    emote.style.setProperty(
        "--ffz-scale-x",
        String(scaleX)
    );

    emote.style.setProperty(
        "--ffz-scale-y",
        String(scaleY)
    );

    emote.style.setProperty(
        "--ffz-rotate",
        `${rotate}deg`
    );

    for (
        const effect
        of effects
    ) {
        switch (effect) {
            case "rainbow":
                emote.classList.add(
                    "ffz-effect-rainbow"
                );
                break;

            case "hyperRed":
                emote.classList.add(
                    "ffz-effect-hyper-red"
                );
                break;

            case "shake":
                emote.classList.add(
                    "ffz-effect-shake"
                );
                break;

            case "cursed":
                emote.classList.add(
                    "ffz-effect-cursed"
                );
                break;

            case "jam":
                emote.classList.add(
                    "ffz-effect-jam"
                );
                break;

            case "bounce":
                emote.classList.add(
                    "ffz-effect-bounce"
                );
                break;

            case "slide":
                emote.classList.add(
                    "ffz-effect-slide"
                );
                break;

            case "appear":
                emote.classList.add(
                    "ffz-effect-appear"
                );
                break;

            case "leave":
                emote.classList.add(
                    "ffz-effect-leave"
                );
                break;

            case "rotate":
                emote.classList.add(
                    "ffz-effect-rotate"
                );
                break;

            case "photocopy":
                emote.classList.add(
                    "ffz-effect-photocopy"
                );
                break;
        }
    }
}

function applyFFZEffect(
    emote,
    effectName
) {
    if (
        !emote ||
        !effectName
    ) {
        return false;
    }

    const effectData =
        ffzEffects.get(
            effectName
        );

    if (
        !effectData?.effects?.length
    ) {
        return false;
    }

    applyFFZEffects(
        emote,
        effectData.effects
    );

    return true;
}

function applyFFZEffectToPrevious(
    container,
    effectName
) {
    const effectData =
        ffzEffects.get(
            effectName
        );

    if (
        !effectData?.effects?.length
    ) {
        return false;
    }

    const previous =
        getPreviousEmote(
            container
        );

    if (!previous) {
        return false;
    }

    return applyFFZEffect(
        previous,
        effectName
    );
}

function getFFZModifierEffects(
    emote
) {
    if (!emote) {
        return [];
    }

    const effects = [];

    const flags =
        Number(
            emote.modifierFlags || 0
        );

    if (
        flags &
        FFZ_EFFECT_FLAGS.GROW_X
    ) {
        effects.push(
            "growX"
        );
    }

    if (
        flags &
        FFZ_EFFECT_FLAGS.RAINBOW
    ) {
        effects.push(
            "rainbow"
        );
    }

    if (
        flags &
        FFZ_EFFECT_FLAGS.HYPER_RED
    ) {
        effects.push(
            "hyperRed"
        );
    }

    if (
        flags &
        FFZ_EFFECT_FLAGS.HYPER_SHAKE
    ) {
        effects.push(
            "shake"
        );
    }

    if (
        flags &
        FFZ_EFFECT_FLAGS.CURSED
    ) {
        effects.push(
            "cursed"
        );
    }

    if (
        flags &
        FFZ_EFFECT_FLAGS.JAM
    ) {
        effects.push(
            "jam"
        );
    }

    if (
        flags &
        FFZ_EFFECT_FLAGS.BOUNCE
    ) {
        effects.push(
            "bounce"
        );
    }

    return effects;
}

function findThirdPartyEmote(
    word,
    username = null
) {
    const personalEmotes =
        get7TVPersonalEmotesForUser(
            username
        );

    if (
        personalEmotes.has(
            word
        )
    ) {
        const personal =
            personalEmotes.get(
                word
            );

        if (
            !showUnlisted7TV &&
            personal.listed === false
        ) {
            return null;
        }

        return {
            id:
                personal.id,

            name:
                personal.name,

            url:
                personal.image,

            provider:
                "7TV",

            personal:
                true,

            listed:
                personal.listed,

            zeroWidth:
                personal.zeroWidth
        };
    }

    if (
        sevenTVEmotes.has(
            word
        )
    ) {
        const emote =
            sevenTVEmotes.get(
                word
            );

        if (
            !showUnlisted7TV &&
            emote.listed === false
        ) {
            return null;
        }

        return {
            ...emote,
            provider:
                "7TV"
        };
    }

    if (
        bttvEmotes.has(
            word
        )
    ) {
        return {
            ...bttvEmotes.get(
                word
            ),

            provider:
                "BTTV"
        };
    }

    if (
        ffzEmotes.has(
            word
        )
    ) {
        const emote =
            ffzEmotes.get(
                word
            );

        return {
            ...emote,

            provider:
                "FFZ",

            modifier:
                Boolean(
                    emote.modifier
                ),

            modifierFlags:
                Number(
                    emote.modifierFlags ||
                    0
                ),

            effects:
                getFFZModifierEffects(
                    emote
                )
        };
    }

    return null;
}

function getPreviousEmote(
    container
) {
    let previous =
        container.lastElementChild;

    while (previous) {
        if (
            previous.classList.contains(
                "emote-overlay-target"
            )
        ) {
            const base =
                previous.querySelector(
                    ":scope > .emote:not(.seven-tv-zero-width)"
                );

            if (base) {
                return base;
            }
        }

        if (
            previous.classList.contains(
                "emote"
            ) &&
            !previous.classList.contains(
                "seven-tv-zero-width"
            )
        ) {
            return previous;
        }

        previous =
            previous.previousElementSibling;
    }

    return null;
}

function getPreviousOverlayTarget(
    container
) {
    const previous =
        container.lastElementChild;

    if (
        previous?.classList.contains(
            "emote-overlay-target"
        )
    ) {
        return previous;
    }

    return null;
}

function create7TVOverlay(
    container,
    url,
    alt
) {
    if (!url) {
        return false;
    }

    let target =
        getPreviousOverlayTarget(
            container
        );

    if (!target) {
        const previous =
            getPreviousEmote(
                container
            );

        if (!previous) {
            return false;
        }

        target =
            document.createElement(
                "span"
            );

        target.className =
            "emote-overlay-target";

        previous.replaceWith(
            target
        );

        target.appendChild(
            previous
        );
    }

    const overlay =
        createEmote(
            url,
            alt
        );

    overlay.classList.add(
        "seven-tv-zero-width"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    target.appendChild(
        overlay
    );

    return true;
}

function renderExternalText(
    container,
    value,
    username = null
) {
    const parts =
        value.split(
            /(\s+)/
        );

    for (
        const part
        of parts
    ) {
        if (!part) {
            continue;
        }

        if (
            ffzEffects.has(
                part
            )
        ) {
            const applied =
                applyFFZEffectToPrevious(
                    container,
                    part
                );

            if (!applied) {
                container.appendChild(
                    document.createTextNode(
                        part
                    )
                );
            }

            continue;
        }

        const external =
            findThirdPartyEmote(
                part,
                username
            );

        if (external) {
            if (
                external.provider ===
                    "7TV" &&
                external.zeroWidth
            ) {
                const applied =
                    create7TVOverlay(
                        container,
                        external.url,
                        external.name
                    );

                if (!applied) {
                    container.appendChild(
                        createEmote(
                            external.url,
                            external.name
                        )
                    );
                }

                continue;
            }

            const emote =
                createEmote(
                    external.url,
                    external.name
                );

            if (
                external.provider ===
                    "FFZ" &&
                external.modifier
            ) {
                const effects =
                    getFFZModifierEffects(
                        external
                    );

                if (effects.length) {
                    const applied =
                        applyEffectsToPreviousEmote(
                            container,
                            effects
                        );

                    if (!applied) {
                        container.appendChild(
                            emote
                        );
                    }

                    continue;
                }
            }

            container.appendChild(
                emote
            );

            continue;
        }

        container.appendChild(
            document.createTextNode(
                part
            )
        );
    }
}

function parseTwitchEmoteRanges(
    tags
) {
    const result = [];

    if (!tags.emotes) {
        return result;
    }

    for (
        const group
        of tags.emotes.split("/")
    ) {
        const separator =
            group.indexOf(":");

        if (separator === -1) {
            continue;
        }

        const id =
            group.substring(
                0,
                separator
            );

        const ranges =
            group.substring(
                separator + 1
            );

        for (
            const range
            of ranges.split(",")
        ) {
            const dash =
                range.indexOf("-");

            if (dash === -1) {
                continue;
            }

            const start =
                Number(
                    range.substring(
                        0,
                        dash
                    )
                );

            const end =
                Number(
                    range.substring(
                        dash + 1
                    )
                );

            if (
                Number.isNaN(start) ||
                Number.isNaN(end)
            ) {
                continue;
            }

            result.push({
                start,
                end,
                id
            });
        }
    }

    result.sort(
        (a, b) =>
            a.start - b.start
    );

    return result;
}

function parseTwitchGifRanges(
    tags
) {
    const result = [];

    if (!gifsEnabled || !tags.gifs) {
        return result;
    }

    for (
        const entry
        of String(tags.gifs)
            .split(",")
    ) {
        if (!entry) {
            continue;
        }

        const firstPipe =
            entry.indexOf("|");

        if (firstPipe === -1) {
            continue;
        }

        const secondPipe =
            entry.indexOf(
                "|",
                firstPipe + 1
            );

        if (secondPipe === -1) {
            continue;
        }

        const rangeText =
            entry.substring(
                0,
                firstPipe
            );

        const gifId =
            entry.substring(
                firstPipe + 1,
                secondPipe
            );

        const gifUrl =
            entry.substring(
                secondPipe + 1
            );

        const dash =
            rangeText.indexOf("-");

        if (
            dash === -1 ||
            !gifUrl
        ) {
            continue;
        }

        const start =
            Number(
                rangeText.substring(
                    0,
                    dash
                )
            );

        const end =
            Number(
                rangeText.substring(
                    dash + 1
                )
            );

        if (
            Number.isNaN(start) ||
            Number.isNaN(end) ||
            end < start
        ) {
            continue;
        }

        result.push({
            start,
            end,
            id: gifId,
            url: gifUrl,
            type: "gif"
        });
    }

    result.sort(
        (a, b) =>
            a.start - b.start ||
            a.end - b.end
    );

    return result;
}

function createTwitchGif(
    url,
    alt = "Twitch GIF"
) {
    if (!url) {
        return null;
    }

    const gif =
        createEmote(
            url,
            alt
        );

    gif.classList.add(
        "twitch-gif",
        "twitch-gif-large"
    );

    gif.dataset.twitchGif =
        "true";

    gif.setAttribute(
        "role",
        "img"
    );

    gif.addEventListener("error", () => {
        const fallback =
            document.createTextNode(alt);

        gif.replaceWith(fallback);
    });

    return gif;
}
function applyEffectsToPreviousEmote(
    container,
    effects
) {
    const previous =
        getPreviousEmote(
            container
        );

    if (!previous) {
        return false;
    }

    applyFFZEffects(
        previous,
        effects
    );

    return true;
}

function renderMessageText(
    text,
    tags,
    username = null
) {
    const container =
        document.createElement(
            "span"
        );

    container.className =
        "text";

    const twitchRanges =
        parseTwitchEmoteRanges(
            tags
        );

    const gifRanges =
        parseTwitchGifRanges(
            tags
        );

    const mediaRanges =
        [
            ...twitchRanges.map(
                range => ({
                    ...range,
                    type: "emote"
                })
            ),
            ...gifRanges
        ]
            .sort(
                (a, b) =>
                    a.start - b.start ||
                    a.end - b.end
            );

    if (!mediaRanges.length) {
        renderExternalText(
            container,
            text,
            username
        );

        renderTwemoji(
            container
        );

        return container;
    }

    let cursor = 0;

    for (
        const range
        of mediaRanges
    ) {
        if (
            range.start < cursor
        ) {
            continue;
        }

        if (
            range.start > cursor
        ) {
            renderExternalText(
                container,
                text.substring(
                    cursor,
                    range.start
                ),
                username
            );
        }

        if (
            range.type === "gif"
        ) {
            const altText =
                text.substring(
                    range.start,
                    range.end + 1
                ) ||
                "Twitch GIF";

            const gif =
                createTwitchGif(
                    range.url,
                    altText
                );

            if (gif) {
                if (range.id) {
                    gif.dataset.twitchGifId =
                        String(range.id);
                }

                const lineBreak =
                    document.createElement('br');

                lineBreak.className =
                    'twitch-gif-break';

                container.appendChild(
                    lineBreak
                );

                container.appendChild(
                    gif
                );
            } else {
                container.appendChild(
                    document.createTextNode(
                        text.substring(
                            range.start,
                            range.end + 1
                        )
                    )
                );
            }

            cursor =
                range.end + 1;

            continue;
        }

        const twitchEmote =
            twitchEmotes.get(
                String(range.id)
            );

        const url =
            twitchEmote?.url ||
            `https://static-cdn.jtvnw.net/` +
            `emoticons/v2/${range.id}` +
            `/default/dark/3.0`;

        const name =
            twitchEmote?.name ||
            text.substring(
                range.start,
                range.end + 1
            );

        const emote =
            createEmote(
                url,
                name
            );

        if (
            twitchEmote?.animated
        ) {
            emote.dataset.twitchAnimated =
                "true";
        }

        container.appendChild(
            emote
        );

        cursor =
            range.end + 1;
    }

    if (
        cursor < text.length
    ) {
        renderExternalText(
            container,
            text.substring(
                cursor
            ),
            username
        );
    }

    renderTwemoji(
        container
    );

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
    const replyPrefix = new RegExp(`^\\x01?ACTION\\s+@${escapedUsername}\\s*`, "i");

    cleanMessage = cleanMessage
        .replace(replyPrefix, "")
        .replace(/\x01$/, "");

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

            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness <= 50) {
                return lightenColor(hex, 30);
            }

            return hex;
        }
    }

    const twitchColors = [
        "#FF0000", // Red
        "#0000FF", // Blue
        "#008000", // Green
        "#B22222", // FireBrick
        "#FF7F50", // Coral
        "#9ACD32", // YellowGreen
        "#FF4500", // OrangeRed
        "#2E8B57", // SeaGreen
        "#DAA520", // GoldenRod
        "#D2691E", // Chocolate
        "#5F9EA0", // CadetBlue
        "#1E90FF", // DodgerBlue
        "#FF69B4", // HotPink
        "#8A2BE2", // BlueViolet
        "#00FF7F"  // SpringGreen
    ];

    const nick = String(login || "").toLowerCase();

    if (!nick.length) {
        return twitchColors[0];
    }

    const index =
        (nick.charCodeAt(0) + nick.charCodeAt(nick.length - 1)) %
        twitchColors.length;

    return twitchColors[index];
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
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
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

    entry.fadeTimer = setTimeout(() => {
        const left = Math.max(
            0,
            entry.createdAt + fade * 1000 - Date.now()
        );

        const duration = Math.min(left, PREVIEW_FADE_OUT_MS);
        const offset = PREVIEW_FADE_OUT_MS - duration;

        element.style.animation =
            `messageFadeOut ${PREVIEW_FADE_OUT_MS}ms ease-in ${-offset}ms forwards`;

        entry.removeTimer = setTimeout(() => {
            removePreviewEntry(entry);
        }, duration);
    }, Math.max(0, life - PREVIEW_FADE_OUT_MS));
}

function reschedulePreviewFades() {
    for (const entry of [...previewMessageCache]) {
        schedulePreviewFade(entry);
    }
}

function addPreviewMessage(
    user,
    msg,
    usernameColor,
    userId,
    tags = {}
) {
    const previewChat =
        document.getElementById("chat");

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
        removeTimer: null
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
        entry
    );

    requestAnimationFrame(() => {
        previewChat.scrollTop =
            previewChat.scrollHeight;
    });

    return result;
}

function rerenderPreviewChat() {
    const previewChat =
        document.getElementById("chat");

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
            entry
        );
    }

    requestAnimationFrame(() => {
        previewChat.scrollTop =
            previewChat.scrollHeight;
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
    previewEntry = null
) {
    const chat =
        targetChat ||
        document.getElementById(
            "chat"
        );

    if (!chat) {
        return;
    }

    const replyInfo =
        getReplyInfo(
            tags,
            msg
        );

    const message =
        document.createElement(
            "div"
        );

    message.className =
        "message";

    if (wrapEnabled) {
        message.classList.add("wrap-message");
    }

    if (
        tags["custom-reward-id"]
    ) {
        message.classList.add(
            "redeem-message"
        );
    }

    message.style.setProperty(
        "--user-color",
        usernameColor
    );
    
    const badges =
        badgesEnabled
            ? createTwitchBadges(tags)
            : document.createElement("span");

    const ffzRoomBadge =
        createFFZRoomBadge(
            tags
        );

    if (ffzRoomBadge) {
        const twitchBadge =
            badges.querySelector(
                `.badge[data-badge-type="${ffzRoomBadge.type}"]`
            );

        if (twitchBadge) {
            twitchBadge.replaceWith(
                ffzRoomBadge.img
            );
        } else {
            badges.appendChild(
                ffzRoomBadge.img
            );
        }
    }


    const usernameElement =
        document.createElement(
            "span"
        );

    usernameElement.className =
        "username";

    usernameElement.textContent =
        user +
        (
            tags["is-action"]
                ? " "
                : ": "
        );

    usernameElement.style.color =
        usernameColor;

    usernameElement.style.webkitTextFillColor =
        usernameColor;


    const text =
        renderMessageText(
            replyInfo.message,
            tags,
            user
        );


    if (
        tags["is-action"]
    ) {
        if (userId) {
            get7TVPaint(
                userId
            )
                .then(paint => {
                    if (paint) {
                        applyPaint(
                            text,
                            paint
                        );
                    } else {
                        text.style.color =
                            usernameColor;

                        text.style.webkitTextFillColor =
                            usernameColor;
                    }
                });
        } else {
            text.style.color =
                usernameColor;

            text.style.webkitTextFillColor =
                usernameColor;
        }
    }

    message.appendChild(
        badges
    );

    message.appendChild(
        usernameElement
    );

    message.appendChild(
        text
    );

    chat.appendChild(
        message
    );

    if (messageId) {
        message.dataset.messageId = messageId;
        messageElements.set(messageId, message);
    }


    if (userId) {
        if (!userMessageElements.has(userId)) {
            userMessageElements.set(userId, new Set());
        }
        userMessageElements.get(userId).add(message);
        get7TVPaint(
            userId
        )
            .then(paint => {
                if (paint) {
                    applyPaint(
                        usernameElement,
                        paint
                    );
                }
            });

        if (badgesEnabled) {
            createExternalBadges(
                userId,
                tags
            )
                .then(externalBadges => {
                    if (
                        externalBadges.children.length >
                        0
                    ) {
                        message.insertBefore(
                            externalBadges,
                            usernameElement
                        );
                    }
                });
            }
    }

    if (previewEntry) {
        previewEntry.element = message;
        schedulePreviewFade(previewEntry);
    } else if (fade !== false) {
        setTimeout(() => {
            message.style.animation =
                "messageFadeOut 1s ease-in forwards";

            setTimeout(() => {
                message.remove();

                if (messageId) {
                    messageElements.delete(messageId);
                }

                if (userId && userMessageElements.has(userId)) {
                    userMessageElements.get(userId).delete(message);

                    if (userMessageElements.get(userId).size === 0) {
                        userMessageElements.delete(userId);
                    }
                }
            }, 1000);

        }, fade * 1000 - 1000);
    }
}

