const previewMessages = [
    [
        "Dodorej",
        "订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK 订阅层|成为订阅者您现在可以订阅并获得些额外福利包括徽章访问零宽度表情参与即将到来的全球表情抽奖等什么是是全新的表情服务和扩展免费提供自定7TV ffzCursed ffzW ffzSpin 7TV CHECK",
        "#FF0000",
        "504585840",
        { badges: "vip/1,founder/1,48hgold/1" }
    ],
    [
        "marz_dev",
        "wowie an overlay with support for ffz effects",
        "#8A2BE2",
        "1208634685",
        { badges: "broadcaster/1,subscriber/1,subtember/1" }
    ],
    [
        "RandomKid",
        "Maybe",
        "#DAA520",
        "195845559",
        { badges: "moderator/1,subscriber/1,pikachu/1" }
    ],
    [
        "Muesli_Cornflake",
        "[Seal Hey Gif by wtf]",
        "#94FDFF",
        "omecash",
        {
            badges: "vip/1,omecash/1",
            gifs: "0-20|hey-seal|hey.gif"
        }
        ],
    [
        "SkibidiDalbajobas44",
        "Fiddy ffzBounce buh_fish_",
        "#FF0000",
        "260019982",
        { badges: "moderator/1,founder/1,omecash/1" }
    ],
    [
        "buh_official_",
        "lookUp FiddyWtf wtf did i do ?",
        "#FF0000",
        "717566574",
        { badges: "vip/1,omecash/1" }
    ],
    [
        "JamiMeow",
        "waga",
        "#FF69B4",
        "458139207",
        { badges: "vip/1,bot/1,omecash/1" }
    ],
    [
        "Underpaid_Actor",
        "PagMan ffzSpin",
        "#FF69B4",
        "406239629",
        { badges: "founder/1,noob/1" }
    ]
];
let currentPreviewMessage = 0;
let badgeSources = {
    twitch: badgeTwitch,
    ffz: badgeFfz,
    seventv: badgeSeventv,
    chatterino: badgeChatterino
};
const PLATFORM_BADGE_SOURCES = [
    { key: "twitch", label: "Twitch", logo: "logos/twitch.png" },
    { key: "ffz", label: "FFZ", logo: "logos/ffz.png" },
    { key: "seventv", label: "7TV", logo: "logos/7tv.png" },
    { key: "chatterino", label: "Chatterino", logo: "logos/chatterino.svg" }
];

let previewTimer = null;
let previewActive = false;

function runPreviewMessage() {
    if (!previewActive) {
        return;
    }

    const message = previewMessages[currentPreviewMessage];

    if (message[0] === "JamiMeow" && !botsEnabled) {
        currentPreviewMessage =
            (currentPreviewMessage + 1) % previewMessages.length;

        previewTimer = setTimeout(runPreviewMessage, 0);
        return;
    }

    addPreviewMessage(...message);

    currentPreviewMessage =
        (currentPreviewMessage + 1) % previewMessages.length;

    const delay = Math.random() * 1000 + 3000;

    previewTimer = setTimeout(runPreviewMessage, delay);
}

async function startPreviewMessages() {
    previewActive = true;

    try {
        await loadPreviewEmotes();
    } catch (error) {
        console.warn("Preview emotes failed to load:", error);
    }

    if (!previewActive) {
        return;
    }

    previewTimer = setTimeout(runPreviewMessage, 500);
}

function stopPreviewMessages() {
    previewActive = false;
    clearTimeout(previewTimer);
    previewTimer = null;
}
async function loadCommitInfo(target) {
    if (!target) {
        return;
    }

    try {
        const response = await fetch(
            "https://api.github.com/repos/marzzzdev/marz-overlay/commits/main"
        );

        if (!response.ok) {
            throw new Error(
                `GitHub API returned ${response.status}`
            );
        }

        const data = await response.json();
        const shortSha = data.sha.slice(0, 7);

        target.textContent = shortSha;
        target.href = data.html_url;
        target.title = data.commit.message.split("\n")[0];
    } catch (error) {
        console.warn(
            "Could not load latest commit info:",
            error
        );

        target.textContent = "unknown";
    }
}

function showOverlaySetupScreen() {
    ensureEmoteScaleStyle();

    let screen = document.getElementById("overlay-setup-screen");

    if (screen) {
        return;
    }

    screen = document.createElement("div");
    screen.id = "overlay-setup-screen";

    loadGoogleFontIfNeeded("'Open Sans', sans-serif");

    const style = document.createElement("style");
    style.dataset.marzSetup = "true";
    style.textContent = `
        html:has(#overlay-setup-screen),
        body:has(#overlay-setup-screen) {
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #0b0b0e;
        }

        #overlay-setup-screen {
            position: fixed;
            left: 0;
            top: 0;
            width: 80vw;
            height: 80vh;
            zoom: 1.25;
            z-index: 999999;
            display: grid;
            grid-template-columns: 196px minmax(360px, 470px) minmax(0, 1fr);
            grid-template-rows: 58px minmax(0, 1fr);
            background: #0b0b0e;
            color: #f4f4f5;
            font-family: 'Open Sans', Arial, sans-serif;
            overflow: hidden;
        }

        html:has(#overlay-setup-screen),
        body:has(#overlay-setup-screen) {
            scrollbar-width: none;
        }

        html:has(#overlay-setup-screen)::-webkit-scrollbar,
        body:has(#overlay-setup-screen)::-webkit-scrollbar {
            display: none;
        }

        #overlay-setup-screen *,
        #overlay-setup-screen *::before,
        #overlay-setup-screen *::after {
            box-sizing: border-box;
        }

        #overlay-setup-screen button,
        #overlay-setup-screen input,
        #overlay-setup-screen select {
            font: inherit;
        }

        #overlay-setup-screen .mc-topbar {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 18px;
            border-bottom: 1px solid #27272d;
            background: #111114;
        }

        #overlay-setup-screen .mc-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
        }

        #overlay-setup-screen .mc-brand-mark {
            height: 30px;
            width: auto;
            max-width: 96px;
            display: block;
            flex: 0 0 auto;
            border-radius: 0;
            object-fit: contain;
            object-position: center;
        }

        #overlay-setup-screen .mc-brand-text {
            min-width: 0;
        }

        #overlay-setup-screen .mc-brand-name {
            color: #fafafa;
            font-size: 12px;
            font-weight: 800;
            line-height: 1.05;
            letter-spacing: .02em;
        }

        #overlay-setup-screen .mc-brand-m {
            color: #f2df9b;
        }

        #overlay-setup-screen .mc-brand-page {
            margin-top: 3px;
            color: #74747f;
            font-size: 9px;
            line-height: 1;
            text-transform: none;
            letter-spacing: .11em;
        }

        #overlay-setup-screen .mc-top-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #868690;
            font-size: 9px;
            text-transform: none;
            letter-spacing: .08em;
        }

        #overlay-setup-screen .mc-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #3d3d45;
        }

        #overlay-setup-screen .mc-sidebar {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
            padding: 13px 10px;
            border-right: 1px solid #27272d;
            background: #101013;
        }

        #overlay-setup-screen .mc-nav-label {
            padding: 0 8px 8px;
            color: #62626c;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .14em;
            text-transform: none;
        }

        #overlay-setup-screen .mc-nav {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        #overlay-setup-screen .mc-nav-button {
            position: relative;
            display: grid;
            grid-template-columns: 24px 1fr;
            align-items: center;
            gap: 7px;
            width: 100%;
            min-height: 38px;
            padding: 0 8px;
            border: 0;
            border-radius: 6px;
            background: transparent;
            color: #8c8c96;
            text-align: left;
            cursor: pointer;
            transition: background .12s ease, color .12s ease;
        }

        #overlay-setup-screen .mc-nav-button:hover {
            background: #17171b;
            color: #d8d8de;
        }

        #overlay-setup-screen .mc-nav-button.is-active {
            background: #2a271d;
            color: #f0e9f8;
        }

        #overlay-setup-screen .mc-nav-button.is-active::before {
            content: "";
            position: absolute;
            left: -10px;
            top: 8px;
            bottom: 8px;
            width: 2px;
            border-radius: 2px;
            background: #e8d58a;
        }

        #overlay-setup-screen .mc-nav-icon {
            width: 24px;
            color: #66666f;
            font-size: 10px;
            font-weight: 800;
            text-align: center;
        }

        #overlay-setup-screen .mc-nav-button.is-active .mc-nav-icon {
            color: #f2df9b;
        }

        #overlay-setup-screen .mc-nav-copy {
            min-width: 0;
        }

        #overlay-setup-screen .mc-nav-title {
            font-size: 10px;
            font-weight: 700;
        }

        #overlay-setup-screen .mc-side-spacer {
            flex: 1;
        }

        #overlay-setup-screen .mc-side-hint {
            padding: 9px 8px;
            border-top: 1px solid #222228;
            color: #5d5d67;
            font-size: 8px;
            line-height: 1.5;
        }

        #overlay-setup-screen .mc-controls {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
            background: #0f0f12;
            border-right: 1px solid #27272d;
        }

        #overlay-setup-screen .mc-controls-head {
            padding: 18px 18px 15px;
            border-bottom: 1px solid #27272d;
        }

        #overlay-setup-screen .mc-control-title {
            margin: 0;
            font-size: 15px;
            line-height: 1.15;
            font-weight: 800;
            letter-spacing: -.02em;
        }

        #overlay-setup-screen .mc-control-subtitle {
            margin: 5px 0 0;
            color: #686872;
            font-size: 9px;
            line-height: 1.45;
        }

        #overlay-setup-screen .mc-panel-stack {
            flex: 1;
            min-height: 0;
            overflow: auto;
            padding: 14px 18px 20px;
            scrollbar-width: thin;
            scrollbar-color: #34343c transparent;
        }

        #overlay-setup-screen .mc-setup-footer {
            flex: 0 0 auto;
            padding: 11px 14px 12px;
            border-top: 1px solid #27272d;
            background: #0c0c0f;
        }

        #overlay-setup-screen .mc-feedback {
            display: flex;
            align-items: center;
            gap: 9px;
            min-height: 40px;
            padding: 7px 9px;
            margin-bottom: 10px;
            border: 1px solid #25252c;
            border-radius: 7px;
            background: #111116;
            color: #777781;
            font-size: 9px;
            line-height: 1.35;
        }

        #overlay-setup-screen .mc-discord-icon {
            width: 23px;
            height: 23px;
            flex: 0 0 23px;
            display: grid;
            place-items: center;
            border-radius: 6px;
            background: #25252e;
            color: #d7d7df;
        }

        #overlay-setup-screen .mc-discord-icon svg {
            width: 15px;
            height: 15px;
            display: block;
        }

        #overlay-setup-screen .mc-feedback-copy {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        #overlay-setup-screen .mc-feedback-label {
            color: #686872;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .06em;
            text-transform: uppercase;
        }

        #overlay-setup-screen .mc-feedback-link {
            color: #d4d4db;
            font-size: 9px;
            font-weight: 700;
            text-decoration: none;
        }

        #overlay-setup-screen .mc-feedback-link:hover {
            color: #fff;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        #overlay-setup-screen .mc-feedback-note {
            color: #55555f;
            font-size: 8px;
        }

        #overlay-setup-screen .mc-attribution {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 7px;
            color: #666670;
            font-size: 8px;
            line-height: 1.4;
        }

        #overlay-setup-screen .mc-attribution-brand {
            color: #a3a3ac;
            font-weight: 700;
        }

        #overlay-setup-screen .mc-attribution-separator {
            color: #3f3f47;
        }

        #overlay-setup-screen .mc-attribution-disclaimer {
            color: #4f4f58;
        }

        #overlay-setup-screen .mc-attribution-github {
            color: #868690;
            text-decoration: none;
            font-weight: 700;
        }

        #overlay-setup-screen .mc-attribution-github:hover {
            color: #fff;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        #overlay-setup-screen .mc-attribution-commit {
            color: #5c5c66;
            text-decoration: none;
            font-family: monospace;
        }

        #overlay-setup-screen .mc-attribution-commit:hover {
            color: #d4d4db;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        #overlay-setup-screen .mc-help-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        #overlay-setup-screen .mc-help-item {
            position: relative;
            margin-bottom: 7px;
            padding: 9px 10px 9px 24px;
            border: 1px solid #25252b;
            border-radius: 5px;
            background: #121216;
            color: #c7c7ce;
            font-size: 10px;
            line-height: 1.45;
        }

        #overlay-setup-screen .mc-help-item::before {
            content: "•";
            position: absolute;
            left: 10px;
            top: 8px;
            color: #e8d58a;
            font-size: 12px;
            line-height: 1;
        }

        #overlay-setup-screen .mc-help-note {
            margin-top: 11px;
            color: #62626b;
            font-size: 8px;
            line-height: 1.5;
        }

        #overlay-setup-screen .mc-panel {
            display: none;
        }

        #overlay-setup-screen .mc-panel.is-active {
            display: block;
        }

        #overlay-setup-screen .mc-field {
            margin-bottom: 15px;
        }

        #overlay-setup-screen .mc-field:last-child {
            margin-bottom: 0;
        }

        #overlay-setup-screen .mc-label {
            display: block;
            margin-bottom: 6px;
            color: #b9b9c1;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .05em;
            text-transform: none;
        }

        #overlay-setup-screen .mc-input,
        #overlay-setup-screen .mc-select {
            width: 100%;
            height: 34px;
            padding: 0 10px;
            border: 1px solid #32323a;
            border-radius: 5px;
            background: #0a0a0d;
            color: #f6f6f7;
            outline: none;
            font-size: 10px;
            transition: border-color .12s ease, background .12s ease;
        }

        #overlay-setup-screen .mc-input:hover,
        #overlay-setup-screen .mc-select:hover {
            border-color: #45454f;
        }

        #overlay-setup-screen .mc-input:focus,
        #overlay-setup-screen .mc-select:focus {
            border-color: #e8d58a;
            background: #0d0c10;
        }

        #overlay-setup-screen .mc-inline {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 10px;
            align-items: center;
        }


        #overlay-setup-screen .mc-divider {
            height: 1px;
            margin: 17px 0;
            background: #24242a;
        }

        #overlay-setup-screen .mc-subhead {
            margin: 0 0 9px;
            color: #777781;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .13em;
            text-transform: none;
        }

        #overlay-setup-screen .mc-toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            min-height: 40px;
            padding: 0 10px;
            margin-bottom: 4px;
            border: 1px solid #25252b;
            border-radius: 5px;
            background: #121216;
            cursor: pointer;
            user-select: none;
            transition: border-color .12s ease, background .12s ease;
        }

        #overlay-setup-screen .mc-toggle-row:hover {
            border-color: #33333a;
            background: #151519;
        }

        #overlay-setup-screen .mc-toggle-copy {
            min-width: 0;
        }

        #overlay-setup-screen .mc-toggle-title {
            color: #d5d5db;
            font-size: 10px;
            font-weight: 700;
        }

        #overlay-setup-screen .mc-toggle-note {
            margin-top: 2px;
            color: #5e5e68;
            font-size: 8px;
            line-height: 1.3;
        }

        #overlay-setup-screen .mc-check {
            width: 1px;
            height: 1px;
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        #overlay-setup-screen .mc-switch {
            width: 31px;
            height: 18px;
            flex: 0 0 auto;
            position: relative;
            border-radius: 999px;
            background: #36363e;
            transition: background .12s ease;
        }

        #overlay-setup-screen .mc-switch::after {
            content: "";
            position: absolute;
            width: 14px;
            height: 14px;
            top: 2px;
            left: 2px;
            border-radius: 50%;
            background: #ececf0;
            transition: transform .12s ease;
        }

        #overlay-setup-screen .mc-toggle-row.is-on .mc-switch {
            background: #e8d58a;
        }

        #overlay-setup-screen .mc-toggle-row.is-on .mc-switch::after {
            transform: translateX(13px);
        }

        #overlay-setup-screen .mc-platform-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            padding: 8px 10px 9px;
            margin: -4px 0 4px;
            border: 1px solid #24242a;
            border-top: 0;
            border-radius: 0 0 5px 5px;
            background: #0e0e11;
            transition: opacity .12s ease;
        }

        #overlay-setup-screen .mc-platform-grid.is-disabled {
            opacity: .45;
        }

        #overlay-setup-screen .mc-platform-button {
            display: flex;
            flex: 0 0 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            width: 40px;
            height: 40px;
            padding: 2px;
            border: 1px solid #25252b;
            border-radius: 5px;
            background: #121216;
            color: #8c8c96;
            cursor: pointer;
            user-select: none;
            transition: border-color .12s ease, background .12s ease, color .12s ease;
        }

        #overlay-setup-screen .mc-platform-button:hover {
            border-color: #33333a;
            background: #151519;
        }

        #overlay-setup-screen .mc-platform-button.is-active {
            border-color: #e8d58a;
            background: #2a271d;
            color: #f0e9f8;
        }

        #overlay-setup-screen .mc-platform-button:disabled {
            cursor: not-allowed;
            pointer-events: none;
        }

        #overlay-setup-screen .mc-platform-logo {
            width: 22px;
            height: 22px;
            display: block;
            object-fit: contain;
            filter: grayscale(1) brightness(1.6);
            opacity: .55;
            transition: filter .12s ease, opacity .12s ease;
            pointer-events: none;
        }

        #overlay-setup-screen .mc-platform-button.is-active .mc-platform-logo {
            filter: none;
            opacity: 1;
        }

        #overlay-setup-screen .mc-platform-label {
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .04em;
            text-transform: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            pointer-events: none;
        }

        #overlay-setup-screen .mc-color-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 86px;
            align-items: center;
            gap: 10px;
            padding: 8px 10px 9px;
            margin: -4px 0 4px;
            border: 1px solid #24242a;
            border-top: 0;
            border-radius: 0 0 5px 5px;
            background: #0e0e11;
        }

        #overlay-setup-screen .mc-muted {
            color: #62626b;
            font-size: 8px;
        }

        #overlay-setup-screen .mc-color {
            width: 86px;
            height: 24px;
            padding: 1px;
            border: 1px solid #36363e;
            border-radius: 4px;
            background: #0a0a0d;
            cursor: pointer;
        }

        #overlay-setup-screen .mc-color::-webkit-color-swatch-wrapper { padding: 0; }
        #overlay-setup-screen .mc-color::-webkit-color-swatch { border: 0; border-radius: 3px; }
        #overlay-setup-screen .mc-color::-moz-color-swatch { border: 0; border-radius: 3px; }

        #overlay-setup-screen .mc-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        #overlay-setup-screen .mc-range-line {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 72px;
            gap: 10px;
            align-items: center;
        }

        #overlay-setup-screen .mc-unit {
            color: #65656e;
            font-size: 8px;
        }

        #overlay-setup-screen .mc-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding-top: 15px;
            margin-top: 15px;
            border-top: 1px solid #25252b;
        }

        #overlay-setup-screen .mc-button {
            height: 35px;
            border: 1px solid #35353d;
            border-radius: 5px;
            background: #19191e;
            color: #dcdce1;
            font-size: 9px;
            font-weight: 800;
            cursor: pointer;
            transition: background .12s ease, border-color .12s ease, color .12s ease;
        }

        #overlay-setup-screen .mc-button:hover {
            background: #212127;
            border-color: #484850;
            color: #fff;
        }

        #overlay-setup-screen .mc-button-primary {
            border-color: #9147ff;
            background: #9147ff;
            color: #fff;
        }

        #overlay-setup-screen .mc-button-primary:hover {
            background: #7f35e7;
            border-color: #7f35e7;
        }

        #overlay-setup-screen .mc-button-full {
            grid-column: 1 / -1;
        }

        #overlay-setup-screen .mc-footnote {
            margin-top: 9px;
            color: #55555e;
            font-size: 8px;
            line-height: 1.45;
            text-align: center;
        }

        #overlay-setup-screen .mc-error {
            display: none;
            margin-top: 9px;
            padding: 8px 9px;
            border: 1px solid rgba(239, 68, 68, .28);
            border-radius: 5px;
            background: rgba(239, 68, 68, .08);
            color: #f08a8a;
            font-size: 8px;
            line-height: 1.4;
        }

        #overlay-setup-screen .mc-stage {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
            background: #09090c;
        }

        #overlay-setup-screen .mc-stage-head {
            height: 44px;
            flex: 0 0 44px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            border-bottom: 1px solid #27272d;
            background: #0e0e11;
        }

        #overlay-setup-screen .mc-stage-title {
            color: #a6a6af;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .13em;
            text-transform: none;
        }

        #overlay-setup-screen .mc-stage-meta {
            display: flex;
            align-items: center;
            gap: 9px;
            color: #5c5c66;
            font-size: 8px;
        }

        #overlay-setup-screen .mc-stage-meta strong {
            color: #8b8b95;
            font-weight: 700;
        }

        #overlay-setup-screen .mc-stage-canvas {
            position: relative;
            flex: 1;
            min-width: 0;
            min-height: 0;
            display: grid;
            place-items: center;
            padding: 20px;
            overflow: hidden;
        }

        #overlay-setup-screen .mc-stage-canvas::before {
            content: "";
            position: absolute;
            pointer-events: none;
        }

        #overlay-setup-screen .mc-stage-canvas::before {
            inset: 0;
            opacity: .33;
            background-image:
                linear-gradient(#1f1f24 1px, transparent 1px),
                linear-gradient(90deg, #1f1f24 1px, transparent 1px);
            background-size: 36px 36px;
            mask-image: radial-gradient(circle at 50% 45%, black 0%, transparent 80%);
        }

        #overlay-setup-screen .mc-preview-frame {
            position: relative;
            z-index: 1;
            width: min(760px, calc(100% - 40px));
            height: min(720px, calc(100% - 40px));
            min-width: 0;
            min-height: 0;
            max-width: 100%;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            overflow: hidden;
            border: 1px solid #34343c;
            border-radius: 8px;
            background: #111116;
            box-shadow: none;
        }

        #overlay-setup-screen .mc-preview-corner {
            position: absolute;
            inset: 10px 10px auto auto;
            z-index: 3;
            height: 22px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 0 8px;
            border: 1px solid #2d2d34;
            border-radius: 4px;
            background: rgba(7,7,10,.72);
            color: #676770;
            font-size: 7px;
            font-weight: 800;
            letter-spacing: .09em;
            text-transform: none;
            backdrop-filter: none;
        }

        #overlay-setup-screen .mc-preview-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #35c759;
        }

        #overlay-setup-screen #chat.mc-preview-chat {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            overflow-y: auto;
            padding: 22px;
            scrollbar-width: none;
        }

        #overlay-setup-screen #chat.mc-preview-chat > .message {
            flex: 0 0 auto;
            height: auto;
            min-height: min-content;
        }
        
        #overlay-setup-screen #chat.mc-preview-chat::-webkit-scrollbar {
            display: none;
        }
        #overlay-setup-screen #chat.mc-preview-chat > * {
            flex-shrink: 0;
        }

        #overlay-setup-screen .mc-preview-note {
            position: absolute;
            z-index: 2;
            left: 22px;
            bottom: 18px;
            color: #4e4e57;
            font-size: 7px;
            letter-spacing: .08em;
            text-transform: none;
            pointer-events: none;
        }

        #overlay-setup-screen .mc-stage-help {
            position: absolute;
            right: 34px;
            bottom: 22px;
            z-index: 2;
            max-width: 220px;
            color: #4e4e57;
            font-size: 7px;
            line-height: 1.45;
            text-align: right;
        }

        #overlay-setup-screen .mc-nav-title {
            font-size: 12px;
        }

        #overlay-setup-screen .mc-brand-name {
            font-size: 14px;
        }

        #overlay-setup-screen .mc-brand-page {
            font-size: 10px;
        }

        #overlay-setup-screen .mc-control-title {
            font-size: 18px;
        }

        #overlay-setup-screen .mc-control-subtitle,
        #overlay-setup-screen .mc-label,
        #overlay-setup-screen .mc-input,
        #overlay-setup-screen .mc-select,
        #overlay-setup-screen .mc-toggle-title,
        #overlay-setup-screen .mc-button {
            font-size: 11px;
        }

        #overlay-setup-screen .mc-toggle-note,
        #overlay-setup-screen .mc-muted,
        #overlay-setup-screen .mc-footnote,
        #overlay-setup-screen .mc-platform-label {
            font-size: 9px;
        }

        @media (max-width: 1020px) {
            #overlay-setup-screen {
                grid-template-columns: 176px minmax(330px, 420px) minmax(0, 1fr);
            }

            #overlay-setup-screen .mc-stage-canvas {
                padding: 14px;
            }
        }

        @media (max-width: 780px) {
            #overlay-setup-screen {
                grid-template-columns: 1fr;
                grid-template-rows: 58px auto minmax(320px, 1fr);
                overflow-y: auto;
            }

            #overlay-setup-screen .mc-sidebar {
                min-height: auto;
                border-right: 0;
                border-bottom: 1px solid #27272d;
            }

            #overlay-setup-screen .mc-nav {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
            }

            #overlay-setup-screen .mc-nav-button {
                grid-template-columns: 1fr;
                justify-items: center;
                gap: 2px;
                min-height: 46px;
                text-align: center;
            }

            #overlay-setup-screen .mc-nav-button.is-active::before {
                left: 12px;
                right: 12px;
                top: auto;
                bottom: 0;
                width: auto;
                height: 2px;
            }

            #overlay-setup-screen .mc-side-spacer,
            #overlay-setup-screen .mc-side-hint {
                display: none;
            }

            #overlay-setup-screen .mc-controls {
                border-right: 0;
                border-bottom: 1px solid #27272d;
            }

            #overlay-setup-screen .mc-panel-stack {
                max-height: 430px;
            }

            #overlay-setup-screen .mc-stage {
                min-height: 430px;
            }
        }

        @media (max-width: 520px) {
            #overlay-setup-screen .mc-two-col,
            #overlay-setup-screen .mc-actions {
                grid-template-columns: 1fr;
            }

            #overlay-setup-screen .mc-button-full {
                grid-column: auto;
            }

            #overlay-setup-screen .mc-preview-frame {
                width: 100%;
                height: calc(100% - 20px);
            }

            #overlay-setup-screen .mc-stage-help {
                display: none;
            }
        }
    `;

    screen.appendChild(style);

    const topbar = document.createElement("header");
    topbar.className = "mc-topbar";

    const brand = document.createElement("div");
    brand.className = "mc-brand";

    const brandMark = document.createElement("img");
    brandMark.className = "mc-brand-mark";
    brandMark.src = "waga.gif";
    brandMark.alt = "Waga";
    brandMark.draggable = false;

    const brandText = document.createElement("div");
    brandText.className = "mc-brand-text";

    const brandName = document.createElement("div");
    brandName.className = "mc-brand-name";

    const brandM = document.createElement("span");
    brandM.className = "mc-brand-m";
    brandM.textContent = "M";

    brandName.appendChild(brandM);
    brandName.appendChild(document.createTextNode("Chat"));

    const brandPage = document.createElement("div");
    brandPage.className = "mc-brand-page";
    brandPage.textContent = "The most up-to-date Twitch chat Overlay";

    brandText.appendChild(brandName);
    brandText.appendChild(brandPage);
    brand.appendChild(brandMark);
    brand.appendChild(brandText);

    topbar.appendChild(brand);
    const sidebar = document.createElement("aside");
    sidebar.className = "mc-sidebar";

    const navLabel = document.createElement("div");
    navLabel.className = "mc-nav-label";
    navLabel.textContent = "Setup";

    const nav = document.createElement("nav");
    nav.className = "mc-nav";

    sidebar.appendChild(navLabel);
    sidebar.appendChild(nav);

    const spacer = document.createElement("div");
    spacer.className = "mc-side-spacer";
    sidebar.appendChild(spacer);

    const hint = document.createElement("div");
    hint.className = "mc-side-hint";
    hint.textContent = "Changes update the renderer immediately. Preview will look 1:1 in your stream. (unless you change the aspect ratio in obs)";
    sidebar.appendChild(hint);

    const controls = document.createElement("main");
    controls.className = "mc-controls";

    const controlsHead = document.createElement("div");
    controlsHead.className = "mc-controls-head";

    const controlTitle = document.createElement("h1");
    controlTitle.className = "mc-control-title";
    controlTitle.textContent = "Overlay setup";

    const controlSubtitle = document.createElement("p");
    controlSubtitle.className = "mc-control-subtitle";
    controlSubtitle.textContent = "Tune the renderer without leaving the preview.";

    controlsHead.appendChild(controlTitle);
    controlsHead.appendChild(controlSubtitle);

    const panelStack = document.createElement("div");
    panelStack.className = "mc-panel-stack";

    controls.appendChild(controlsHead);
    controls.appendChild(panelStack);

    const setupFooter = document.createElement("div");
    setupFooter.className = "mc-setup-footer";

    const feedback = document.createElement("div");
    feedback.className = "mc-feedback";

    const discordIcon = document.createElement("span");
    discordIcon.className = "mc-discord-icon";
    discordIcon.setAttribute("aria-hidden", "true");
    discordIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.93 5.45A16.2 16.2 0 0 0 14.9 4.2l-.5 1.03a14.5 14.5 0 0 0-4.8 0L9.1 4.2a16.2 16.2 0 0 0-4.03 1.25C2.52 9.15 1.83 12.97 2.18 16.74a16.4 16.4 0 0 0 4.95 2.5l1.2-1.65c-.66-.24-1.28-.54-1.87-.9l.46-.36c3.62 1.7 7.56 1.7 11.14 0 .15.12.3.25.46.36-.6.36-1.22.66-1.88.9l1.2 1.65a16.4 16.4 0 0 0 4.95-2.5c.42-4.37-.72-8.15-3.86-11.29ZM8.48 15.3c-1.08 0-1.96-1-1.96-2.23 0-1.24.86-2.24 1.96-2.24s1.98 1 1.96 2.24c0 1.23-.87 2.23-1.96 2.23Zm7.04 0c-1.08 0-1.96-1-1.96-2.23 0-1.24.86-2.24 1.96-2.24s1.98 1 1.96 2.24c0 1.23-.87 2.23-1.96 2.23Z" fill="currentColor"/>
        </svg>
    `;

    const feedbackCopy = document.createElement("div");
    feedbackCopy.className = "mc-feedback-copy";

    const feedbackLabel = document.createElement("div");
    feedbackLabel.className = "mc-feedback-label";
    feedbackLabel.textContent = "Feedback & support";

    const feedbackLink = document.createElement("a");
    feedbackLink.className = "mc-feedback-link";
    feedbackLink.href = "https://discord.com/users/1422977056085639309";
    feedbackLink.target = "_blank";
    feedbackLink.rel = "noopener noreferrer";
    feedbackLink.textContent = "Add me on Discord for fast answers";


    feedbackCopy.appendChild(feedbackLabel);
    feedbackCopy.appendChild(feedbackLink);
    feedback.appendChild(discordIcon);
    feedback.appendChild(feedbackCopy);

    const attribution = document.createElement("div");
    attribution.className = "mc-attribution";

    const attributionBrand = document.createElement("span");
    attributionBrand.className = "mc-attribution-brand";
    attributionBrand.textContent = "MChat · made with 🤍 by marz_dev";

    const attributionSeparator = document.createElement("span");
    attributionSeparator.className = "mc-attribution-separator";
    attributionSeparator.textContent = "•";

    const attributionDisclaimer = document.createElement("span");
    attributionDisclaimer.className = "mc-attribution-disclaimer";
    attributionDisclaimer.textContent = "Not affiliated with Twitch";

    const attributionSeparator2 = document.createElement("span");
    attributionSeparator2.className = "mc-attribution-separator";
    attributionSeparator2.textContent = "•";

    const attributionGithub = document.createElement("a");
    attributionGithub.className = "mc-attribution-github";
    attributionGithub.href = "https://github.com/marzzzdev/marz-overlay";
    attributionGithub.target = "_blank";
    attributionGithub.rel = "noopener noreferrer";
    attributionGithub.textContent = "GitHub";

    const attributionSeparator3 = document.createElement("span");
    attributionSeparator3.className = "mc-attribution-separator";
    attributionSeparator3.textContent = "•";

    const attributionCommit = document.createElement("a");
    attributionCommit.className = "mc-attribution-commit";
    attributionCommit.href = "https://github.com/marzzzdev/marz-overlay/commits/main";
    attributionCommit.target = "_blank";
    attributionCommit.rel = "noopener noreferrer";
    attributionCommit.textContent = "loading commit…";

    attribution.appendChild(attributionBrand);
    attribution.appendChild(attributionSeparator);
    attribution.appendChild(attributionDisclaimer);
    attribution.appendChild(attributionSeparator2);
    attribution.appendChild(attributionGithub);
    attribution.appendChild(attributionSeparator3);
    attribution.appendChild(attributionCommit);

    setupFooter.appendChild(feedback);
    setupFooter.appendChild(attribution);
    controls.appendChild(setupFooter);

    loadCommitInfo(attributionCommit);

    const stage = document.createElement("section");
    stage.className = "mc-stage";

    const stageHead = document.createElement("div");
    stageHead.className = "mc-stage-head";

    const stageTitle = document.createElement("div");
    stageTitle.className = "mc-stage-title";
    stageTitle.textContent = "Renderer preview";

    const stageMeta = document.createElement("div");
    stageMeta.className = "mc-stage-meta";

    stageHead.appendChild(stageTitle);
    stageHead.appendChild(stageMeta);

    const stageCanvas = document.createElement("div");
    stageCanvas.className = "mc-stage-canvas";

    const previewFrame = document.createElement("div");
    previewFrame.className = "mc-preview-frame";

    let previewChat = document.getElementById("chat");

    if (!previewChat) {
        previewChat = document.createElement("div");
        previewChat.id = "chat";
    }

    const originalKeys = [
        "position", "inset", "top", "left", "right", "bottom",
        "width", "height", "zIndex", "flex", "minHeight",
        "overflowY", "display", "flexDirection", "justifyContent",
        "padding"
    ];

    for (const key of originalKeys) {
        previewChat.dataset[`original${key.charAt(0).toUpperCase()}${key.slice(1)}`] = previewChat.style[key] || "";
    }

    previewChat.classList.add("mc-preview-chat");
    previewChat.style.position = "relative";
    previewChat.style.inset = "auto";
    previewChat.style.top = "auto";
    previewChat.style.left = "auto";
    previewChat.style.right = "auto";
    previewChat.style.bottom = "auto";
    previewChat.style.width = "100%";
    previewChat.style.height = "100%";
    previewChat.style.zIndex = "auto";
    previewChat.style.flex = "1";
    previewChat.style.minHeight = "0";
    previewChat.style.overflowY = "auto";
    previewChat.style.display = "flex";
    previewChat.style.flexDirection = "column";
    previewChat.style.justifyContent = "flex-end";
    previewChat.style.padding = "22px";
    previewChat.innerHTML = "";

    previewFrame.appendChild(previewChat);
    stageCanvas.appendChild(previewFrame);

    stage.appendChild(stageHead);
    stage.appendChild(stageCanvas);

    screen.appendChild(topbar);
    screen.appendChild(sidebar);
    screen.appendChild(controls);
    screen.appendChild(stage);
    document.body.appendChild(screen);

    function createPanel(id, navTitle, navDesc, icon) {
        const panel = document.createElement("section");
        panel.className = "mc-panel";
        panel.dataset.panel = id;

        const navButton = document.createElement("button");
        navButton.type = "button";
        navButton.className = "mc-nav-button";
        navButton.dataset.panel = id;

        const navIcon = document.createElement("span");
        navIcon.className = "mc-nav-icon";
        navIcon.textContent = icon;

        const navCopy = document.createElement("span");
        navCopy.className = "mc-nav-copy";

        const title = document.createElement("span");
        title.className = "mc-nav-title";
        title.textContent = navTitle;

        navCopy.appendChild(title);
        navButton.appendChild(navIcon);
        navButton.appendChild(navCopy);
        nav.appendChild(navButton);
        panelStack.appendChild(panel);

        navButton.addEventListener("click", () => {
            for (const button of nav.querySelectorAll(".mc-nav-button")) {
                button.classList.toggle("is-active", button === navButton);
            }

            for (const otherPanel of panelStack.querySelectorAll(".mc-panel")) {
                otherPanel.classList.toggle("is-active", otherPanel === panel);
            }

            controlTitle.textContent = navTitle;
            controlSubtitle.textContent = navDesc;
        });

        return panel;
    }

    function addField(parent, labelText, control) {
        const field = document.createElement("div");
        field.className = "mc-field";

        const label = document.createElement("label");
        label.className = "mc-label";
        label.textContent = labelText;

        field.appendChild(label);
        field.appendChild(control);
        parent.appendChild(field);

        return field;
    }

    function addToggle(parent, labelText, noteText, key, checked) {
        const wrapper = document.createElement("label");
        wrapper.className = `mc-toggle-row${checked ? " is-on" : ""}`;

        const copy = document.createElement("div");
        copy.className = "mc-toggle-copy";

        const title = document.createElement("div");
        title.className = "mc-toggle-title";
        title.textContent = labelText;

        const note = document.createElement("div");
        note.className = "mc-toggle-note";
        note.textContent = noteText;

        copy.appendChild(title);
        copy.appendChild(note);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        checkbox.dataset.setting = key;
        checkbox.className = "mc-check";

        const sw = document.createElement("span");
        sw.className = "mc-switch";

        wrapper.appendChild(copy);
        wrapper.appendChild(checkbox);
        wrapper.appendChild(sw);
        parent.appendChild(wrapper);

        checkbox.addEventListener("change", () => {
            wrapper.classList.toggle("is-on", checkbox.checked);
        });

        return checkbox;
    }

    function addPlatformToggles(parent, items, state, onToggle) {
        const grid = document.createElement("div");
        grid.className = "mc-platform-grid";

        for (const item of items) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `mc-platform-button${state[item.key] ? " is-active" : ""}`;
            button.dataset.platform = item.key;

            const logo = document.createElement("img");
            logo.className = "mc-platform-logo";
            logo.src = item.logo;
            logo.alt = item.label;
            logo.draggable = false;

            const label = document.createElement("span");
            label.className = "mc-platform-label";
            label.textContent = item.label;

            button.appendChild(logo);
            button.appendChild(label);
            grid.appendChild(button);

            button.addEventListener("click", () => {
                state[item.key] = !state[item.key];
                button.classList.toggle("is-active", state[item.key]);

                if (onToggle) {
                    onToggle(item.key, state[item.key]);
                }

                rerenderPreviewChat();
            });
        }

        parent.appendChild(grid);

        return grid;
    }

    const connectionPanel = createPanel("connection", "Connection", "Choose the Twitch channel this overlay should read from anonymously.", "01");

    const channelInput = document.createElement("input");
    channelInput.type = "text";
    channelInput.className = "mc-input";
    channelInput.placeholder = "Channel Name";
    channelInput.value = selectedChannel || "";
    channelInput.autocomplete = "off";
    channelInput.spellcheck = false;

    const channelInline = document.createElement("div");
    channelInline.className = "mc-inline";
    channelInline.appendChild(channelInput);

    addField(connectionPanel, "Twitch channel", channelInline);

    const connectionDivider = document.createElement("div");
    connectionDivider.className = "mc-divider";
    connectionPanel.appendChild(connectionDivider);

    const connectionSub = document.createElement("h2");
    connectionSub.className = "mc-subhead";
    connectionSub.textContent = "Browser source";
    connectionPanel.appendChild(connectionSub);

    const connectionText = document.createElement("div");
    connectionText.className = "mc-muted";
    connectionText.textContent = "Generate one URL with the current overlay settings. Paste it into an OBS Browser Source.";
    connectionText.style.lineHeight = "1.55";
    connectionPanel.appendChild(connectionText);

    const appearancePanel = createPanel("appearance", "Appearance", "Control the visual density of messages, the backdrop, badges and 7TV visibility.", "02");

    const backgroundCheckbox = addToggle(appearancePanel, "Background", "Use the configured overlay backdrop.", "background", backgroundEnabled);

    const backgroundColorRow = document.createElement("div");
    backgroundColorRow.className = "mc-color-row";

    const backgroundColorText = document.createElement("span");
    backgroundColorText.className = "mc-muted";
    backgroundColorText.textContent = backgroundColor;

    const backgroundColorInput = document.createElement("input");
    backgroundColorInput.type = "color";
    backgroundColorInput.className = "mc-color";
    backgroundColorInput.value = backgroundColor;
    backgroundColorInput.setAttribute("aria-label", "Background color");

    backgroundColorRow.appendChild(backgroundColorText);
    backgroundColorRow.appendChild(backgroundColorInput);
    appearancePanel.appendChild(backgroundColorRow);

    const wrapCheckbox = addToggle(appearancePanel, "Wrap messages", "Allow long chat messages to continue on another line.", "wrap", wrapEnabled);
    const badgesCheckbox = addToggle(appearancePanel, "Badges", "Show Twitch, 7TV, FFZ and other supported badges.", "badges", badgesEnabled);

    const platformGrid = addPlatformToggles(
        appearancePanel,
        PLATFORM_BADGE_SOURCES,
        badgeSources,
        (key, value) => {
            if (key === "twitch") {
                badgeTwitch = value;
            } else if (key === "ffz") {
                badgeFfz = value;
            } else if (key === "seventv") {
                badgeSeventv = value;
            } else if (key === "chatterino") {
                badgeChatterino = value;
            }
        }
    );

    function syncPlatformState() {
        const disabled = !badgesCheckbox.checked;
        platformGrid.classList.toggle("is-disabled", disabled);
        for (const button of platformGrid.querySelectorAll(".mc-platform-button")) {
            button.disabled = disabled;
        }
    }

    syncPlatformState();

    const gifsCheckbox = addToggle(appearancePanel, "GIFs", "Show Twitch GIFs in chat messages.", "gifs", gifsEnabled);
    const botsCheckbox = addToggle(appearancePanel, "Bots", "Show bot messages and commands in chat.", "bots", botsEnabled);
    const highlightsCheckbox = addToggle(appearancePanel, "Highlights", "Highlight usernames with the 7TV Paint/Color", "highlights", highlightsEnabled);
    const unlistedCheckbox = addToggle(appearancePanel, "Unlisted 7TV emotes", "Render unlisted 7TV emotes when they are available.", "unlisted", showUnlisted7TV);

    const shadowDivider = document.createElement("div");
    shadowDivider.className = "mc-divider";
    appearancePanel.appendChild(shadowDivider);

    const shadowSub = document.createElement("h2");
    shadowSub.className = "mc-subhead";
    shadowSub.textContent = "Text shadow";
    appearancePanel.appendChild(shadowSub);

    const shadowCheckbox = addToggle(appearancePanel, "Drop shadow", "Show a shadow behind usernames, text, emotes and badges.", "shadow", shadowEnabled);

    const shadowTwoCol = document.createElement("div");
    shadowTwoCol.className = "mc-two-col";

    const shadowIntensityField = document.createElement("div");
    shadowIntensityField.className = "mc-field";

    const shadowIntensityLabel = document.createElement("label");
    shadowIntensityLabel.className = "mc-label";
    shadowIntensityLabel.textContent = "Intensity";

    const shadowIntensityInput = document.createElement("input");
    shadowIntensityInput.type = "number";
    shadowIntensityInput.className = "mc-input";
    shadowIntensityInput.min = "0";
    shadowIntensityInput.max = "1";
    shadowIntensityInput.step = "0.05";
    shadowIntensityInput.value = String(shadowIntensity);

    shadowIntensityField.appendChild(shadowIntensityLabel);
    shadowIntensityField.appendChild(shadowIntensityInput);

    const shadowSizeField = document.createElement("div");
    shadowSizeField.className = "mc-field";

    const shadowSizeLabel = document.createElement("label");
    shadowSizeLabel.className = "mc-label";
    shadowSizeLabel.textContent = "Size";

    const shadowSizeLine = document.createElement("div");
    shadowSizeLine.className = "mc-range-line";

    const shadowSizeInput = document.createElement("input");
    shadowSizeInput.type = "number";
    shadowSizeInput.className = "mc-input";
    shadowSizeInput.min = "0";
    shadowSizeInput.max = "40";
    shadowSizeInput.step = "1";
    shadowSizeInput.value = String(shadowSize);

    const shadowSizeUnit = document.createElement("span");
    shadowSizeUnit.className = "mc-unit";
    shadowSizeUnit.textContent = "px";

    shadowSizeLine.appendChild(shadowSizeInput);
    shadowSizeLine.appendChild(shadowSizeUnit);
    shadowSizeField.appendChild(shadowSizeLabel);
    shadowSizeField.appendChild(shadowSizeLine);

    shadowTwoCol.appendChild(shadowIntensityField);
    shadowTwoCol.appendChild(shadowSizeField);
    appearancePanel.appendChild(shadowTwoCol);

    const shadowOffsetField = document.createElement("div");
    shadowOffsetField.className = "mc-field";

    const shadowOffsetLabel = document.createElement("label");
    shadowOffsetLabel.className = "mc-label";
    shadowOffsetLabel.textContent = "Offset";

    const shadowOffsetLine = document.createElement("div");
    shadowOffsetLine.className = "mc-range-line";

    const shadowOffsetInput = document.createElement("input");
    shadowOffsetInput.type = "number";
    shadowOffsetInput.className = "mc-input";
    shadowOffsetInput.min = "0";
    shadowOffsetInput.max = "20";
    shadowOffsetInput.step = "1";
    shadowOffsetInput.value = String(shadowOffset);

    const shadowOffsetUnit = document.createElement("span");
    shadowOffsetUnit.className = "mc-unit";
    shadowOffsetUnit.textContent = "px";

    shadowOffsetLine.appendChild(shadowOffsetInput);
    shadowOffsetLine.appendChild(shadowOffsetUnit);
    shadowOffsetField.appendChild(shadowOffsetLabel);
    shadowOffsetField.appendChild(shadowOffsetLine);
    appearancePanel.appendChild(shadowOffsetField);

    const typographyPanel = createPanel("typography", "Typography", "Choose the font used by the renderer. Changes are applied to the live preview immediately.", "03");

    const fontSelect = document.createElement("select");
    fontSelect.className = "mc-select";

    for (const font of CHAT_FONTS) {
        const option = document.createElement("option");
        option.value = font.value;
        option.textContent = font.label;
        if (font.value === chatFont) {
            option.selected = true;
        }
        fontSelect.appendChild(option);
    }

    addField(typographyPanel, "Chat font", fontSelect);

    const typographyNote = document.createElement("div");
    typographyNote.className = "mc-muted";
    typographyNote.textContent = "Settings are included directly in the generated overlay URL.";
    typographyPanel.appendChild(typographyNote);

    const textScaleInput = document.createElement("input");
    textScaleInput.type = "number";
    textScaleInput.className = "mc-input";
    textScaleInput.min = "0.25";
    textScaleInput.max = "3";
    textScaleInput.step = "0.05";
    textScaleInput.value = String(scale);

    addField(typographyPanel, "Text scale", textScaleInput);

    const emoteScaleInput = document.createElement("input");
    emoteScaleInput.type = "number";
    emoteScaleInput.className = "mc-input";
    emoteScaleInput.min = "0.25";
    emoteScaleInput.max = "3";
    emoteScaleInput.step = "0.05";
    emoteScaleInput.value = String(emoteScale);

    addField(
        typographyPanel,
        "Emote scale",
        emoteScaleInput
    );

    const timingPanel = createPanel("timing", "Timing", "Tune message lifetime and fading behavior.", "04");

    const helpPanel = createPanel("help", "Help", "Learn what MChat can do and how to use the overlay.", "05");

    const helpFeatures = [
        "MChat is a Twitch chat overlay that works with OBS, Streamlabs, XSplit and other streaming software, integrating with emotes and badges from multiple platforms, such as 7TV, FFZ and BTTV. Chat look can be customized to your liking by adjusting the overlay settings such as the text scale, emote scale and any other preference you could ever want, and counting.",
        "7TV Paints, FFZ, BTTV and Twitch badges are supported.",
        "GIFs are supported, but can be disabled for performance.",
        "Bots and commands can be hidden from the overlay.",
        "Unlisted 7TV emotes can be enabled or disabled.",
        "You can choose from a variety of fonts for the chat.",
        "You can enable highlighting of usernames with the 7TV Paint/Color.",
        "You can scale the text and emotes independently.",
        "You can set a fade time for messages or disable fading.",
        "You can choose a background color or disable the background.",
        "Once adjusted to your liking, you may copy the link.",
    ];

    const helpList = document.createElement("ul");
    helpList.className = "mc-help-list";

    for (const feature of helpFeatures) {
        const item = document.createElement("li");
        item.className = "mc-help-item";
        item.textContent = feature;
        helpList.appendChild(item);
    }

    helpPanel.appendChild(helpList);

    const helpNote = document.createElement("div");
    helpNote.className = "mc-help-note";
    helpNote.textContent = "More features being added daily.";
    helpPanel.appendChild(helpNote);

    const timingTwoCol = document.createElement("div");
    timingTwoCol.className = "mc-two-col";

    const fadeField = document.createElement("div");
    fadeField.className = "mc-field";

    const fadeLabel = document.createElement("label");
    fadeLabel.className = "mc-label";
    fadeLabel.textContent = "Fade time";

    const fadeLine = document.createElement("div");
    fadeLine.className = "mc-range-line";

    const fadeInput = document.createElement("input");
    fadeInput.type = "number";
    fadeInput.className = "mc-input";
    fadeInput.min = "1";
    fadeInput.max = "300";
    fadeInput.step = "1";
    fadeInput.value = fade === false ? "" : String(fade);
    fadeInput.placeholder = "15";

    const fadeUnit = document.createElement("span");
    fadeUnit.className = "mc-unit";
    fadeUnit.textContent = "sec";

    fadeLine.appendChild(fadeInput);
    fadeLine.appendChild(fadeUnit);
    fadeField.appendChild(fadeLabel);
    fadeField.appendChild(fadeLine);

    timingTwoCol.appendChild(fadeField);
    timingPanel.appendChild(timingTwoCol);

    const noFade = addToggle(timingPanel, "Disable fading", "Keep messages visible until the renderer removes them.", "disable-fading", fade === false);

    const actions = document.createElement("div");
    actions.className = "mc-actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className =
        "mc-button mc-button-full";

    copyButton.textContent =
        "Copy overlay link";

    actions.appendChild(copyButton);

    const error = document.createElement("div");
    error.className = "mc-error";

    connectionPanel.appendChild(actions);
    connectionPanel.appendChild(error);

    function activatePanel(id) {
        const button = nav.querySelector(`.mc-nav-button[data-panel="${id}"]`);
        if (button) {
            button.click();
        }
    }

    activatePanel("connection");

    function syncFadeState() {
        fadeInput.disabled = noFade.checked;
        fadeInput.style.opacity = noFade.checked ? ".45" : "1";
        fadeInput.title = noFade.checked ? "Disable fading is enabled" : "Fade time in seconds";
    }

    function applyBackgroundPreview() {
        backgroundColor = backgroundColorInput.value;
        backgroundColorText.textContent = backgroundColor;
        applyBackgroundColor(backgroundColor);
        backgroundEnabled = backgroundCheckbox.checked;
        document.body.classList.toggle("has-background", backgroundEnabled);
        previewChat.classList.toggle("has-background", backgroundEnabled);
    }

    backgroundCheckbox.addEventListener("change", applyBackgroundPreview);
    backgroundColorInput.addEventListener("input", applyBackgroundPreview);
    backgroundColorInput.addEventListener("change", applyBackgroundPreview);

    badgesCheckbox.addEventListener("change", () => {
        badgesEnabled = badgesCheckbox.checked;
        syncPlatformState();
        rerenderPreviewChat();
    });

    wrapCheckbox.addEventListener("change", () => {
        wrapEnabled = wrapCheckbox.checked;
        rerenderPreviewChat();
    });

    gifsCheckbox.addEventListener("change", () => {
        gifsEnabled = gifsCheckbox.checked;
        rerenderPreviewChat();
    });
    botsCheckbox.addEventListener("change", () => {
        botsEnabled = botsCheckbox.checked;
        rerenderPreviewChat();
    });
    highlightsCheckbox.addEventListener("change", () => {
        highlightsEnabled = highlightsCheckbox.checked;
        rerenderPreviewChat();
    });

    unlistedCheckbox.addEventListener("change", () => {
        showUnlisted7TV = unlistedCheckbox.checked;
        rerenderPreviewChat();
    });

    function syncShadowState() {
        shadowIntensityInput.disabled = !shadowCheckbox.checked;
        shadowSizeInput.disabled = !shadowCheckbox.checked;
        shadowOffsetInput.disabled = !shadowCheckbox.checked;

        const opacity = shadowCheckbox.checked ? "1" : ".45";
        shadowIntensityInput.style.opacity = opacity;
        shadowSizeInput.style.opacity = opacity;
        shadowOffsetInput.style.opacity = opacity;
    }

    shadowCheckbox.addEventListener("change", () => {
        shadowEnabled = shadowCheckbox.checked;
        document.body.classList.toggle("shadow-disabled", !shadowEnabled);
        syncShadowState();
    });

    shadowIntensityInput.addEventListener("input", () => {
        const value = Number(shadowIntensityInput.value);
        if (!Number.isFinite(value)) {
            return;
        }
        shadowIntensity = Math.max(0, Math.min(value, 1));
        document.documentElement.style.setProperty("--shadow-color", `rgba(0, 0, 0, ${shadowIntensity})`);
    });

    shadowSizeInput.addEventListener("input", () => {
        const value = Number(shadowSizeInput.value);
        if (!Number.isFinite(value)) {
            return;
        }
        shadowSize = Math.max(0, Math.min(value, 40));
        document.documentElement.style.setProperty("--shadow-blur", `${shadowSize}px`);
    });

    shadowOffsetInput.addEventListener("input", () => {
        const value = Number(shadowOffsetInput.value);
        if (!Number.isFinite(value)) {
            return;
        }
        shadowOffset = Math.max(0, Math.min(value, 20));
        document.documentElement.style.setProperty("--shadow-offset-x", `${shadowOffset}px`);
        document.documentElement.style.setProperty("--shadow-offset-y", `${shadowOffset}px`);
    });

    fontSelect.addEventListener("change", () => {
        chatFont = fontSelect.value;
        document.documentElement.style.setProperty("--chat-font", chatFont);
        loadGoogleFontIfNeeded(chatFont);
        loadCustomFontIfNeeded(chatFont);
        document.body.classList.toggle("pixel-font", chatFont === "'Minecraft', sans-serif");
    });

    let fadeApplyTimer = null;

    function applyFadeChange() {
        clearTimeout(fadeApplyTimer);

        fadeApplyTimer = setTimeout(() => {
            fade = noFade.checked
                ? false
                : Math.max(1, Number(fadeInput.value) || 15);

            reschedulePreviewFades();
        }, 400);
    }

    fadeInput.addEventListener("input", () => {
        if (!noFade.checked) {
            applyFadeChange();
        }
    });

    noFade.addEventListener("change", () => {
        syncFadeState();
        applyFadeChange();
    });
    textScaleInput.addEventListener("input", () => {
        const newScale = Number(textScaleInput.value);
        if (!Number.isFinite(newScale)) {
            return;
        }
        scale = Math.max(0.25, Math.min(newScale, 3));
        document.documentElement.style.setProperty("--chat-scale", scale);
    });

    emoteScaleInput.addEventListener("input", () => {
        const newEmoteScale =
            Number(
                emoteScaleInput.value
            );

        if (!Number.isFinite(newEmoteScale)) {
            return;
        }

        emoteScale =
            Math.max(
                0.25,
                Math.min(
                    newEmoteScale,
                    3
                )
            );

        document.documentElement.style.setProperty(
            "--emote-scale",
            emoteScale
        );
    });

    channelInput.addEventListener("input", () => {
        error.style.display = "none";
    });

    channelInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            copyButton.click();
        }
    });

    function getOverlayUrl() {
        const channel =
            channelInput.value
                .trim()
                .toLowerCase()
                .replace(/^#/, "");

        if (!channel) {
            error.textContent =
                "Enter a Twitch channel before generating the overlay link.";

            error.style.display =
                "block";

            activatePanel("connection");
            channelInput.focus();

            return null;
        }

        error.style.display =
            "none";

        const overlaySettings = {
            background:
                backgroundCheckbox.checked,

            backgroundColor:
                backgroundColorInput.value,

            fade:
                noFade.checked
                    ? false
                    : Math.max(
                        1,
                        Number(
                            fadeInput.value
                        ) || 15
                    ),

            badges:
                badgesCheckbox.checked,

            badgeTwitch:
                badgeSources.twitch,

            badgeFfz:
                badgeSources.ffz,

            badgeSeventv:
                badgeSources.seventv,

            badgeChatterino:
                badgeSources.chatterino,

            gifs:
                gifsCheckbox.checked,

            bots:
                botsCheckbox.checked,

            highlights:
                highlightsCheckbox.checked,

            scale:
                Math.max(
                    0.25,
                    Math.min(
                        Number(
                            textScaleInput.value
                        ) || 1,
                        3
                    )
                ),

            emoteScale:
                Math.max(
                    0.25,
                    Math.min(
                        Number(
                            emoteScaleInput.value
                        ) || 1,
                        3
                    )
                ),

            wrap:
                wrapCheckbox.checked,

            unlisted:
                unlistedCheckbox.checked,

            font:
                fontSelect.value,

            shadow:
                shadowCheckbox.checked,

            shadowIntensity:
                Math.max(
                    0,
                    Math.min(
                        Number(
                            shadowIntensityInput.value
                        ) ?? 0.9,
                        1
                    )
                ),

            shadowSize:
                Math.max(
                    0,
                    Math.min(
                        Number(
                            shadowSizeInput.value
                        ) || 6,
                        40
                    )
                ),

            shadowOffset:
                Math.max(
                    0,
                    Math.min(
                        Number(
                            shadowOffsetInput.value
                        ) || 3,
                        20
                    )
                )
        };

        const url =
            new URL(
                window.location.href
            );

        url.search = "";

        appendFlatOverlaySettings(
            url,
            channel,
            overlaySettings
        );

        return url.toString();
    }


    copyButton.addEventListener("click", async () => {
        const url = getOverlayUrl();
        if (!url) {
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = url;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
        }

        copyButton.textContent = "Link copied";
        window.setTimeout(() => {
            copyButton.textContent = "Copy overlay link";
        }, 1500);
    });

    syncFadeState();
    startPreviewMessages();
}
function showChannelError(message) {
    const screen =
        document.getElementById(
            "overlay-setup-screen"
        );

    if (!screen) {
        return;
    }

    const error =
        screen.querySelector(
            "[data-channel-error]"
        );

    if (error) {
        error.textContent =
            message;

        error.style.display =
            "block";
    }
}

function hideOverlaySetupScreen() {
    const screen =
        document.getElementById(
            "overlay-setup-screen"
        );

    if (!screen) {
        return;
    }

    stopPreviewMessages();

    const chat =
        document.getElementById("chat");

    if (chat && screen.contains(chat)) {
        chat.style.position =
            chat.dataset.originalPosition || "";
        chat.style.inset =
            chat.dataset.originalInset || "";
        chat.style.top =
            chat.dataset.originalTop || "";
        chat.style.left =
            chat.dataset.originalLeft || "";
        chat.style.right =
            chat.dataset.originalRight || "";
        chat.style.bottom =
            chat.dataset.originalBottom || "";
        chat.style.width =
            chat.dataset.originalWidth || "";
        chat.style.height =
            chat.dataset.originalHeight || "";
        chat.style.zIndex =
            chat.dataset.originalZIndex || "";

        chat.style.flex = "";
        chat.style.minHeight = "";
        chat.style.overflowY = "";

        delete chat.dataset.originalPosition;
        delete chat.dataset.originalInset;
        delete chat.dataset.originalTop;
        delete chat.dataset.originalLeft;
        delete chat.dataset.originalRight;
        delete chat.dataset.originalBottom;
        delete chat.dataset.originalWidth;
        delete chat.dataset.originalHeight;
        delete chat.dataset.originalZIndex;

        chat.style.display = "";
        chat.style.flexDirection = "";
        chat.style.justifyContent = "";

        document.body.appendChild(chat);
    }

    screen.remove();
}