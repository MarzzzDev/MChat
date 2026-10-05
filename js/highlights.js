const HL_FIRST_MESSAGE_COLOR = "#c832c8";
const HL_FIRST_MESSAGE_LABEL = "First Message";
const HL_REDEEM_COLOR = "rgba(69, 164, 179, 0.75)";
const HL_REDEEM_FALLBACK_LABEL = "Channel Point Redeem";
const HL_REDEEM_BACKGROUND = "rgba(80, 160, 170, 0.35)";
const HL_OPACITY_PERCENT = 10;
const HL_DEFAULT_ACCENT = "#755ebc";

const channelRewards = new Map();

const HL_GIFT_ICON =
  '<svg viewBox="0 0 20 20" fill="currentColor">' +
  '<path fill-rule="evenodd" clip-rule="evenodd" ' +
  'd="M16 6h2v6h-1v6H3v-6H2V6h2V4.793c0-2.507 3.03-3.762 4.803-1.99.131.131.249.275.352.429L10 4.5l.845-1.268a2.81 2.81 0 01.352-.429C12.969 1.031 16 2.286 16 4.793V6zM6 4.793V6h2.596L7.49 4.341A.814.814 0 006 4.793zm8 0V6h-2.596l1.106-1.659a.814.814 0 011.49.451zM16 8v2h-5V8h5zm-1 8v-4h-4v4h4zM9 8v2H4V8h5zm0 4H5v4h4v-4z"></path>' +
  "</svg>";

const HL_MASS_GIFT_IMAGE =
  "https://static-cdn.jtvnw.net/subs-image-assets/gift-illus.png";

function addHighlightStyles() {
  if (document.getElementById("hl-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "hl-style";

  style.textContent = `
        :root {
            --hl-k: 3.85;
            --hl-rem: calc(10px * var(--hl-k));
            --hl-accent: ${HL_DEFAULT_ACCENT};
            --hl-muted: #999;
            --hl-link: #bf94ff;
            --hl-bleed: 18px;
        }

        .message.has-highlight,
        .message.hl-card {
            align-self: stretch;
            width: auto;
            max-width: none;
            margin-left: calc(-1 * var(--hl-bleed));
            margin-right: calc(-1 * var(--hl-bleed));
        }

        .message.has-highlight {
            position: relative;
            box-sizing: border-box;
            margin-top: calc(0.25 * var(--hl-rem));
            margin-bottom: calc(0.25 * var(--hl-rem));
            padding:
                var(--hl-rem)
                calc(0.75 * var(--hl-rem))
                calc(0.5 * var(--hl-rem));
            border: calc(0.25 * var(--hl-rem)) solid var(--hl-color);
            border-top: none;
            border-bottom: none;
            border-radius: 0;
            background-color: var(--hl-dim);
        }

        .message.has-highlight > .hl-label {
            position: absolute;
            top: calc(0.1 * var(--hl-rem));
            right: calc(0.75 * var(--hl-rem));
            color: var(--hl-color);
            font-family: var(--chat-font);
            font-size: calc(0.88 * var(--hl-rem));
            font-weight: 600;
            line-height: 1;
            text-transform: uppercase;
            letter-spacing: normal;
            pointer-events: none;
            -webkit-text-stroke: 0;
        }

        .message.hl-card {
            display: block !important;
            box-sizing: border-box;
            border-radius: 0;
            overflow-wrap: anywhere;
            padding:
                calc(0.5 * var(--hl-rem))
                calc(2 * var(--hl-rem))
                calc(0.5 * var(--hl-rem))
                calc(1.6 * var(--hl-rem));
        }

        .message.hl-card .text {
            font-weight: 600;
        }

        .message.hl-card .hl-bold {
            font-weight: 900;
        }

        .message.hl-gift {
            margin-top: calc(0.5 * var(--hl-rem));
            margin-bottom: calc(0.5 * var(--hl-rem));
            border-left: calc(0.4 * var(--hl-rem)) solid var(--hl-accent);
            background-color: hsla(0, 0%, 50%, 0.1);
        }

        .hl-gift-part {
            display: flex;
        }

        .hl-gift-icon {
            display: flex;
            flex-shrink: 0;
            padding-right: calc(1.6 * var(--hl-rem));
            margin: auto 0;
            color: var(--text-color);
        }

        .hl-gift-icon svg {
            width: calc(25px * var(--hl-k));
            height: calc(20px * var(--hl-k));
            fill: currentColor;
        }

        .hl-gift-icon img {
            display: block;
            height: calc(25px * var(--hl-k));
            width: auto;
        }

        .hl-gift-text {
            margin-left: calc(0.25 * var(--hl-rem));
        }

        .hl-gift-name {
            display: block !important;
            color: var(--hl-link) !important;
        }

        .hl-gift-name-big {
            display: block !important;
            font-size: calc(50px * 1.2) !important;
        }
    `;

  (document.head || document.documentElement).appendChild(style);
}

addHighlightStyles();

function hlHexAlpha(percent) {
  const alpha = Math.min(1, Math.max(0, Number(percent) / 100));

  return Math.ceil(255 * alpha)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

function hlEl(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text != null) {
    element.textContent = text;
  }

  return element;
}

function hlText(text, extraClass = "") {
  return hlEl("span", `text ${extraClass}`.trim(), text);
}

function hlTierLabel(plan) {
  const value = String(plan || "");

  if (value.toLowerCase() === "prime") {
    return "Prime";
  }

  const tier = value.charAt(0);

  return tier ? `Tier ${tier}` : "Tier 1";
}

function hlAppendToChat(element) {
  const chat = document.getElementById("chat");

  if (!chat) {
    return;
  }

  chat.appendChild(element);

  if (typeof fade === "number" && Number.isFinite(fade)) {
    setTimeout(
      () => {
        element.style.animation = "messageFadeOut 1s ease-in forwards";

        setTimeout(() => {
          element.remove();
        }, 1000);
      },
      Math.max(0, fade * 1000 - 1000),
    );
  }
}

function applyHighlight(message, color, label, background = null) {
  message.classList.add("has-highlight");
  message.style.setProperty("--hl-color", color);
  message.style.setProperty(
    "--hl-dim",
    background || color + hlHexAlpha(HL_OPACITY_PERCENT),
  );

  if (label) {
    const labelElement = hlEl("div", "hl-label", label);
    message.insertBefore(labelElement, message.firstChild);
  }
}

function applyRewardHighlight(message, tags) {
  const reward = channelRewards.get(String(tags["custom-reward-id"] || ""));

  const label =
    reward?.title ||
    (tags["msg-id"] === "highlighted-message"
      ? "Highlight My Message"
      : HL_REDEEM_FALLBACK_LABEL);

  applyHighlight(message, HL_REDEEM_COLOR, label, HL_REDEEM_BACKGROUND);
}

function applyMessageHighlights(message, tags, displayName) {
  const isRedeem =
    Boolean(tags["custom-reward-id"]) ||
    tags["msg-id"] === "highlighted-message";

  if (isRedeem && hlRedeemsEnabled) {
    applyRewardHighlight(message, tags);
    return;
  }

  if (hlFirstEnabled && String(tags["first-msg"]) === "1") {
    applyHighlight(message, HL_FIRST_MESSAGE_COLOR, HL_FIRST_MESSAGE_LABEL);
  }
}
function createSubGiftCard({ gifter, plan, recipient }) {
  const card = hlEl("div", "message hl-card hl-gift");
  const part = hlEl("div", "hl-gift-part");

  const icon = hlEl("div", "hl-gift-icon");
  icon.insertAdjacentHTML("beforeend", HL_GIFT_ICON);

  const body = hlEl("div", "hl-gift-text");

  body.append(
    hlText(gifter, "hl-bold hl-gift-name"),
    hlText("Gifted a "),
    hlText(hlTierLabel(plan), "hl-bold"),
    hlText(" Sub to "),
    hlText(recipient, "hl-bold"),
  );

  part.append(icon, body);
  card.appendChild(part);

  return card;
}

function createMassGiftCard({ gifter, plan, count, senderCount }) {
  const card = hlEl("div", "message hl-card hl-gift");
  const part = hlEl("div", "hl-gift-part");

  const icon = hlEl("div", "hl-gift-icon");
  const image = document.createElement("img");
  image.src = HL_MASS_GIFT_IMAGE;
  image.alt = "mystery gift";
  image.draggable = false;
  icon.appendChild(image);

  const body = hlEl("div", "hl-gift-text");

  const subWord = count > 1 ? "Subs" : "Sub";

  body.append(
    hlText(gifter, "hl-bold hl-gift-name-big"),
    hlText(`is gifting ${count} ${hlTierLabel(plan)} ${subWord}. `),
  );

  if (senderCount > 0) {
    body.appendChild(
      hlText(
        senderCount === count
          ? "It's their first Gift Sub in the channel!"
          : `They've gifted a total of ${senderCount} Subs in the channel!`,
      ),
    );
  }

  part.append(icon, body);
  card.appendChild(part);

  return card;
}

function hlGifterName(tags) {
  const anonymous =
    String(tags["msg-id"] || "").startsWith("anon") ||
    String(tags.login || "").toLowerCase() === "ananonymousgifter";

  if (anonymous) {
    return "Anonymous";
  }

  return tags["display-name"] || tags.login || "Someone";
}

function handleTwitchIRCUsernotice(message) {
  const tags = message.tags || {};
  const msgId = tags["msg-id"];

  if (!hlGiftsEnabled) {
    return;
  }

  if (msgId === "subgift" || msgId === "anonsubgift") {
    if (tags["msg-param-community-gift-id"]) {
      return;
    }

    hlAppendToChat(
      createSubGiftCard({
        gifter: hlGifterName(tags),
        plan: tags["msg-param-sub-plan"],
        recipient:
          tags["msg-param-recipient-display-name"] ||
          tags["msg-param-recipient-user-name"] ||
          "someone",
      }),
    );

    return;
  }

  if (msgId === "submysterygift" || msgId === "anonsubmysterygift") {
    const count = Number(tags["msg-param-mass-gift-count"]) || 1;

    hlAppendToChat(
      createMassGiftCard({
        gifter: hlGifterName(tags),
        plan: tags["msg-param-sub-plan"],
        count,
        senderCount: Number(tags["msg-param-sender-count"]) || 0,
      }),
    );
  }
}

async function loadChannelHighlightData() {
  if (!TWITCH_USER_ID) {
    return;
  }

  const userId = JSON.stringify(String(TWITCH_USER_ID));

  try {
    const data = await twitchGraphQL(
      `query { user(id: ${userId}) { primaryColorHex } }`,
    );

    const hex = data?.user?.primaryColorHex;

    if (/^[0-9a-f]{6}$/i.test(hex || "")) {
      document.documentElement.style.setProperty("--hl-accent", `#${hex}`);
    }
  } catch (error) {
    console.warn("Channel accent color unavailable:", error);
  }

  try {
    const data = await twitchGraphQL(
      `query { user(id: ${userId}) { channel { communityPointsSettings { customRewards { id title cost } } } } }`,
    );

    const rewards = data?.user?.channel?.communityPointsSettings?.customRewards;

    for (const reward of Array.isArray(rewards) ? rewards : []) {
      if (reward?.id) {
        channelRewards.set(String(reward.id), {
          title: reward.title,
          cost: reward.cost,
        });
      }
    }

    console.log(`Loaded ${channelRewards.size} channel point rewards.`);
  } catch (error) {
    console.warn("Channel point rewards unavailable:", error);
  }
}
