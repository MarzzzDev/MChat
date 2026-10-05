function ensureEmoteScaleStyle() {
    let style = document.getElementById("emote-scale-style");

    if (!style) {
        style = document.createElement("style");

        style.id = "emote-scale-style";

        style.textContent = `
            .emote:not(.seven-tv-zero-width):not(.twitch-gif),
            .twemoji {
                height:
                    calc(
                        65px *
                        var(--emote-scale, 1)
                    ) !important;

                width:
                    auto !important;
            }

            .twitch-gif {
                display: block !important;
                width: auto !important;
                height: 480px !important;
                max-width: min(80vw, 1240px) !important;
                max-height: 480px !important;
                object-fit: contain !important;
                object-position: left center !important;
                margin: 10px 0 12px 0 !important;
                vertical-align: top !important;
                flex: 0 0 auto !important;
                filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.9)) !important;
            }

            .twitch-gif-break {
                display: block !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                line-height: 0 !important;
            }
        `;

        (document.head || document.documentElement).appendChild(style);
    }

    document.documentElement.style.setProperty(
        "--emote-scale",
        Number(emoteScale) || 1,
    );
}

function addGlobalStyle() {
    if (document.getElementById("ffz-effects-style")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "ffz-effects-style";

    style.textContent = `

        @keyframes ffzRainbow {
            0% {
                filter:
                    var(--ffz-effect-filter, )
                    hue-rotate(0deg)
                    saturate(1.5)
                    var(--shadow-filter, );
            }

            100% {
                filter:
                    var(--ffz-effect-filter, )
                    hue-rotate(360deg)
                    saturate(1.5)
                    var(--shadow-filter, );
            }
        }

        @keyframes ffzShake {
            0%, 100% {
                transform:
                    translateX(0)
                    rotate(0deg);
            }

            20% {
                transform:
                    translateX(-3px)
                    rotate(-3deg);
            }

            40% {
                transform:
                    translateX(3px)
                    rotate(3deg);
            }

            60% {
                transform:
                    translateX(-3px)
                    rotate(-3deg);
            }

            80% {
                transform:
                    translateX(3px)
                    rotate(3deg);
            }
        }

        @keyframes ffzSpin {
            from {
                transform:
                    rotate(0deg);
            }

            to {
                transform:
                    rotate(360deg);
            }
        }

        @keyframes ffzSlide {
            0% {
                transform:
                    translateX(-10px);
            }

            50% {
                transform:
                    translateX(10px);
            }

            100% {
                transform:
                    translateX(-10px);
            }
        }

        @keyframes ffzArrive {
            0% {
                opacity: 0;
                transform:
                    scale(0);
            }

            60% {
                opacity: 1;
                transform:
                    scale(1.15);
            }

            100% {
                opacity: 1;
                transform:
                    scale(1);
            }
        }

        @keyframes ffzLeave {
            0% {
                opacity: 1;
                transform:
                    scale(1);
            }

            100% {
                opacity: 0;
                transform:
                    scale(0);
            }
        }

        @keyframes ffzHyper {
            0%, 100% {
                transform:
                    scale(1)
                    rotate(0deg);
            }

            25% {
                transform:
                    scale(1.12)
                    rotate(-4deg);
            }

            50% {
                transform:
                    scale(0.92)
                    rotate(4deg);
            }

            75% {
                transform:
                    scale(1.12)
                    rotate(-4deg);
            }
        }

        @keyframes ffzJam {
            0%, 100% {
                transform:
                    translateY(0)
                    scaleY(1);
            }

            12.5% {
                transform:
                    translateY(1px)
                    scaleY(0.95);
            }

            25% {
                transform:
                    translateY(4px)
                    scaleY(0.85);
            }

            37.5% {
                transform:
                    translateY(0)
                    scaleY(1.05);
            }

            50% {
                transform:
                    translateY(-5px)
                    scaleY(1.1);
            }

            62.5% {
                transform:
                    translateY(0)
                    scaleY(1);
            }

            75% {
                transform:
                    translateY(4px)
                    scaleY(0.85);
            }

            87.5% {
                transform:
                    translateY(0)
                    scaleY(1.05);
            }
        }

        @keyframes ffz-effect-bounce {
            0% {
                transform:
                    scale(0.8, 1);
            }

            10% {
                transform:
                    scale(0.9, 0.8);
            }

            20% {
                transform:
                    scale(1, 0.4);
            }

            25% {
                transform:
                    scale(1.2, 0.3);
            }

            25.001% {
                transform:
                    scale(-1.2, 0.3);
            }

            30% {
                transform:
                    scale(-1, 0.4);
            }

            40% {
                transform:
                    scale(-0.9, 0.8);
            }

            50% {
                transform:
                    scale(-0.8, 1);
            }

            60% {
                transform:
                    scale(-0.9, 0.8);
            }

            70% {
                transform:
                    scale(-1, 0.4);
            }

            75% {
                transform:
                    scale(-1.2, 0.3);
            }

            75.001% {
                transform:
                    scale(1.2, 0.3);
            }

            80% {
                transform:
                    scale(1, 0.4);
            }

            90% {
                transform:
                    scale(0.9, 0.8);
            }

            100% {
                transform:
                    scale(0.8, 1);
            }
        }

        @keyframes ffzPhotocopy {
            0%, 100% {
                filter:
                    var(--ffz-effect-filter, )
                    grayscale(1)
                    contrast(1.35)
                    brightness(1.05)
                    var(--shadow-filter, );
            }

            50% {
                filter:
                    var(--ffz-effect-filter, )
                    grayscale(1)
                    contrast(1.8)
                    brightness(0.9)
                    var(--shadow-filter, );
            }
        }

        .ffz-effect-target {
            display:
                inline-block;

            position:
                relative;
        }

        .ffz-effect-target > .emote {
            display:
                block;
        }

        .ffz-effect-transform {
            display:
                inline-block;

            transform:
                translateZ(0)
                scaleX(var(--ffz-scale-x, 1))
                scaleY(var(--ffz-scale-y, 1))
                rotate(var(--ffz-rotate, 0deg));

            transform-origin:
                center center;
        }

        .ffz-effect-flip-x {
            transform:
                scaleX(-1);
        }

        .ffz-effect-flip-y {
            transform:
                scaleY(-1);
        }

        .ffz-effect-grow-x {
            transform:
                scaleX(2);
        }

        .ffz-effect-shrink-x {
            transform:
                scaleX(0.5);
        }

        .ffz-effect-rainbow {
            animation:
                ffzRainbow
                1.5s
                linear
                infinite;
        }

        .ffz-effect-hyper-red {
            --ffz-effect-filter:
                saturate(2)
                hue-rotate(-20deg)
                contrast(1.8);
        }

        .ffz-effect-shake {
            animation:
                ffzShake
                0.18s
                linear
                infinite;
        }

        .ffz-effect-cursed {
            --ffz-effect-filter:
                grayscale(1)
                contrast(3)
                brightness(0.75);
        }

        .ffz-effect-jam {
            animation:
                ffzJam
                0.6s
                ease-in-out
                infinite;
        }

        .ffz-effect-bounce {
            animation:
                ffz-effect-bounce
                0.9s
                linear
                infinite;

            transform-origin:
                bottom center;
        }

        .ffz-effect-slide {
            animation:
                ffzSlide
                1s
                ease-in-out
                infinite;
        }

        .ffz-effect-appear {
            animation:
                ffzArrive
                0.7s
                ease-out
                forwards;
        }

        .ffz-effect-leave {
            animation:
                ffzLeave
                0.7s
                ease-in
                forwards;
        }

        .ffz-effect-rotate {
            animation:
                ffzSpin
                1s
                linear
                infinite;
        }

        .ffz-effect-hyper {
            animation:
                ffzHyper
                0.45s
                ease-in-out
                infinite;
        }

        .ffz-effect-photocopy {
            animation:
                ffzPhotocopy
                0.35s
                steps(2)
                infinite;
        }

        .seven-tv-painted {
            position:
                relative;

            display:
                inline-block;

            isolation:
                isolate;

            overflow:
                visible;

            background-clip:
                text;

            -webkit-background-clip:
                text;

            color:
                transparent;

            -webkit-text-fill-color:
                transparent;
        }

        .emote-overlay-target {
            position:
                relative;

            display:
                inline-block;

            width:
                auto;

            height:
                auto;

            line-height:
                0;

            vertical-align:
                middle;

            overflow:
                visible;
        }

        .emote-overlay-target >
        .emote:not(.seven-tv-zero-width) {
            position:
                relative;

            display:
                block;

            z-index:
                1;
        }

        .emote-overlay-target >
        .seven-tv-zero-width {
            position:
                absolute;

            left:
                50%;

            top:
                50%;

            width:
                100%;

            height:
                100%;

            max-width:
                none;

            max-height:
                none;

            object-fit:
                contain;

            transform:
                translate(-50%, -50%);

            display:
                block;

            pointer-events:
                none;

            z-index:
                2;
        }

        .badge {
            width:
                18px;

            height:
                18px;

            object-fit:
                contain;

            display:
                inline-block;

            vertical-align:
                middle;

            margin-right:
                2px;
        }
    `;

    document.head.appendChild(style);
}

addGlobalStyle();
