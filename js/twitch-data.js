const TWITCH_GQL_URL = "https://gql.twitch.tv/gql";
const TWITCH_PUBLIC_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

let twitchBadgesReadyPromise = Promise.resolve();

function cacheTwitchGraphQLBadges(badges) {
    let loaded = 0;

    for (const badge of Array.isArray(badges) ? badges : []) {
        const setId =
            badge?.setID ||
            badge?.setId ||
            badge?.set_id;

        const versionId =
            badge?.version ??
            badge?.id;

        if (!setId || versionId == null) {
            continue;
        }

        const imageUrl =
            badge?.imageURL ||
            badge?.imageUrl ||
            badge?.image_url;

        if (!imageUrl) {
            continue;
        }

        twitchBadges.set(
            `${setId}/${versionId}`,
            {
                title:
                    badge?.title ||
                    badge?.description ||
                    setId,
                url_1x: imageUrl,
                url_2x: imageUrl,
                url_4x: imageUrl
            }
        );

        loaded++;
    }

    return loaded;
}

async function twitchGraphQL(query) {
    const response = await fetch(
        TWITCH_GQL_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Client-ID": TWITCH_PUBLIC_CLIENT_ID
            },
            body: JSON.stringify({ query }),
            cache: "no-store"
        }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const detail =
            payload?.message ||
            payload?.error ||
            (Array.isArray(payload?.errors)
                ? payload.errors
                    .map(error => error?.message || "Unknown GraphQL error")
                    .join("; ")
                : "");

        throw new Error(
            `Twitch GraphQL returned ${response.status}` +
            (detail ? `: ${detail}` : "")
        );
    }

    if (Array.isArray(payload?.errors) && payload.errors.length) {
        throw new Error(
            payload.errors
                .map(error => error?.message || "Unknown GraphQL error")
                .join("; ")
        );
    }

    return payload?.data || {};
}

async function loadTwitchBadges() {
    const load = (async () => {
        let loaded = 0;

        try {
            const globalData = await twitchGraphQL(
                `query {
                    badges {
                        imageURL(size: DOUBLE)
                        description
                        title
                        setID
                        version
                    }
                }`
            );

            loaded += cacheTwitchGraphQLBadges(
                globalData?.badges
            );
        } catch (error) {
            console.warn(
                "Twitch global badge catalog unavailable:",
                error
            );
        }

        if (TWITCH_USER_ID) {
            try {
                const channelData = await twitchGraphQL(
                    `query {
                        user(id: "${String(TWITCH_USER_ID).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}") {
                            broadcastBadges {
                                imageURL(size: DOUBLE)
                                description
                                title
                                setID
                                version
                            }
                        }
                    }`
                );

                loaded += cacheTwitchGraphQLBadges(
                    channelData?.user?.broadcastBadges
                );
            } catch (error) {
                console.warn(
                    "Twitch channel badge catalog unavailable:",
                    error
                );
            }
        }

        if (!twitchBadges.has("subscriber/1")) {
            twitchBadges.set(
                "subscriber/1",
                {
                    title: "Subscriber",
                    url_1x:
                        "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
                    url_2x:
                        "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/2",
                    url_4x:
                        "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3"
                }
            );
        }

        console.log(
            `Loaded ${twitchBadges.size} Twitch badge definitions (${loaded} from Twitch GraphQL).`
        );

        return true;
    })();

    twitchBadgesReadyPromise = load;
    return load;
}

async function loadPreviewEmotes() {
    const previousChannel = CHANNEL;
    const previousUserId = TWITCH_USER_ID;

    CHANNEL = PREVIEW_CHANNEL;
    TWITCH_USER_ID = PREVIEW_TWITCH_USER_ID;

    seedPreviewTwitchBadges();

    const tasks = [
        load7TVGlobalEmotes(),
        load7TVEmotes(),
        loadFFZEmotes(),
        loadBTTVEmotes(),
        loadFFZBadges(),
        loadChatterinoBadges(),
        loadHomiesBadges(),
        loadBTTVBadges(),
        loadDankChatBadges(),
        loadMoltorinoBadges()
    ];

    tasks.push(loadTwitchBadges());
    tasks.push(loadFFZBotBadgeList());

    await Promise.allSettled(tasks);

    CHANNEL = previousChannel;
    TWITCH_USER_ID = previousUserId;
}

const PREVIEW_TWITCH_BADGES = {
    "48hgold/1": {
        title: "48 Hour Sub Gold",
        url: "https://static-cdn.jtvnw.net/badges/v1/af11047c-a3b6-424d-808e-7fc7aaa0e74d/3"
    },
    "founder/1": {
        title: "Founder",
        url: "https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/3"
    },
    "subtember/1": {
        title: "Subtember",
        url: "https://static-cdn.jtvnw.net/badges/v1/a9c01f28-179e-486d-a4c7-2277e4f6adb4/3"
    },
    "subscriber/1": {
        title: "subscriber",
        url: "https://static-cdn.jtvnw.net/badges/v1/3a37cb42-c1dc-48c1-9262-6266ca29ebf3/3"
    },
    "pikachu/1": {
        title: "pikachu",
        url: "https://static-cdn.jtvnw.net/badges/v1/20f214cf-36b0-4b42-8992-3b769bcb0461/3"
    },
    "noob/1": {
        title: "noob",
        url: "https://static-cdn.jtvnw.net/badges/v1/d87a78f5-76d9-451f-8f31-752a369e6045/3"
    },
    "omecash/1": {
        title: "omecash",
        url: "https://static-cdn.jtvnw.net/badges/v1/4cae4630-f0fd-4642-bd2d-120017968d61/3"
    },
    "bot/1": {
        title: "bot",
        url: "https://static-cdn.jtvnw.net/badges/v1/3ffa9565-c35b-4cad-800b-041e60659cf2/3"
    }
};

function seedPreviewTwitchBadges() {
    for (const [key, badge] of Object.entries(PREVIEW_TWITCH_BADGES)) {
        twitchBadges.set(key, {
            title: badge.title,
            url_1x: badge.url,
            url_2x: badge.url,
            url_4x: badge.url
        });
    }
}

const PREVIEW_CHANNEL = "marz_dev";
const PREVIEW_TWITCH_USER_ID = "1208634685";