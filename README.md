# MChat

MChat is a free, customizable chat overlay for Twitch, Kick, YouTube Live, and TikTok LIVE. Configure the overlay at [mchat.marz.lol](https://mchat.marz.lol), preview it, then add its generated URL as a Browser Source in OBS or other streaming software that supports browser sources.

## Quick start

1. Open [MChat](https://mchat.marz.lol/) and enter the channel name for each platform you want to show.
2. Customize the appearance and behavior. The preview updates as you change settings.
3. Copy the generated overlay link.
4. In OBS, add a **Browser** source and paste the link. Set the source dimensions to fit your scene. Other software with browser-source support should work similarly.

MChat is free to use. Normal setup does not require an account or a Twitch login.

## Platforms and rendering

- **Twitch:** anonymous read-only IRC chat, Twitch badges and emotes, channel GIFs, and Twitch chat events supported by the overlay.
- **Kick:** chat and platform badges, with Kick emotes and supported third-party emote integrations.
- **YouTube Live:** live chat, custom emoji, platform badges, and supported membership, Super Chat, and moderation events.
- **TikTok LIVE:** chat, supported event messages, TikTok emotes/media, and badges. TikTok connection uses MChat's separate events service.
- **Third-party emotes and badges:** integrations include 7TV, BetterTTV (BTTV), FrankerFaceZ (FFZ), and community badge sources such as Chatterino and Homies. Availability depends on the platform and provider data.

The exact message, badge, and emote details vary by platform. MChat is an overlay for displaying chat; it does not send chat messages or replace a platform's moderation tools.

For YouTube, enter a channel handle to discover its current live stream, or paste a live/video URL or 11-character video ID to connect directly.

## Customization

The setup page includes a live preview and controls for appearance and message behavior, including:

- Fonts, text sizes, colors, shadows, strokes, and separate emote sizing
- Backgrounds and message cards
- Layout, spacing, alignment, and timestamps
- Message animations, fading, and emote effects
- Platform and third-party badge visibility and sizing
- Bot, command, and message filters
- Twitch GIFs, profile pictures, highlights, and other optional display features

Generated links contain the selected channels and overlay settings. You can copy a link for OBS, reopen it in the setup page to continue editing, and export or import settings as `.mc` files. The setup page also supports importing compatible ChatIS and UChat links.

## Reliability and updates

MChat reconnects to Twitch and Kick chat after connection drops, retries YouTube chat, and retries TikTok event polling with backoff. The overlay has moderator commands for actions such as reconnecting platform connections and refreshing the overlay. MChat also checks for repository updates and can refresh an overlay when a new version is detected.

These mechanisms help recover from interruptions, but they do not guarantee uninterrupted service. TikTok depends on MChat's separate event service, and chat access and third-party emote or badge data can be affected by platform or provider availability.

## Self-hosting

MChat is a static browser application. Serve the repository over HTTP(S) and open `index.html`; its relative assets and scripts should remain in their existing paths. The hosted version uses external platform, emote, badge, and TikTok services, so self-hosting the frontend does not remove those dependencies.

The source is licensed under the [MIT License](LICENSE).

## Links

- [Open MChat](https://mchat.marz.lol/)
- [Source repository](https://github.com/MarzzzDev/MChat)
- [About and credits](https://faq.marz.lol)
- [Emote Combos](https://combos.marz.lol)
- [Feedback and support](https://discord.com/users/marz_dev)

MChat is not affiliated with Twitch, Kick, YouTube, or TikTok.
