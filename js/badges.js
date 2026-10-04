const homiesBadges = new Map();

async function loadHomiesBadges() {
    try {
        const response = await fetch("https://itzalex.github.io/badges2");

        if (!response.ok) {
            throw new Error(`Homies badges: ${response.status}`);
        }

        const data = await response.json();

        for (const badge of data.badges || []) {
            const url = normalizeImageUrl(
                badge.image3 || badge.image2 || badge.image1
            );

            if (!url) {
                continue;
            }

            const title = badge.tooltip || "Homies Badge";

            for (const rawId of badge.users || []) {
                const id = String(rawId).trim();

                if (!id) {
                    continue;
                }

                if (!homiesBadges.has(id)) {
                    homiesBadges.set(id, []);
                }

                homiesBadges.get(id).push({ url, title });
            }
        }

        console.log(
            `Loaded Homies badges for ${homiesBadges.size} users.`
        );
    } catch (error) {
        console.error("Homies badge error:", error);
    }
}

function normalizeFFZRoomBadge(
    badge,
    title
) {
    if (!badge) {
        return null;
    }

    let url = null;

    if (
        typeof badge === "object" &&
        !Array.isArray(badge)
    ) {
        url =
            badge["4"] ||
            badge["2"] ||
            badge["1"] ||
            badge.image ||
            badge.url ||
            null;
    }
    if (
        typeof badge === "string"
    ) {
        url = badge;
    }

    url =
        normalizeImageUrl(url);

    if (!url) {
        return null;
    }

    return {
        url,

        title:
            title || "FFZ Badge"
    };
}

async function loadFFZBadges() {
    try {
        const response =
            await fetch(
                `https://api.frankerfacez.com/v1/user/id/${TWITCH_USER_ID}`
            );

        if (response.ok) {
            const data =
                await response.json();

            const badges =
                data.badges || {};

            for (
                const [id, badge]
                of Object.entries(
                    badges
                )
            ) {
                const image =
                    badge.urls?.["4"] ||
                    badge.urls?.["2"] ||
                    badge.urls?.["1"] ||
                    badge.image;

                if (!image) {
                    continue;
                }

                const url =
                    normalizeImageUrl(
                        image
                    );

                if (!url) {
                    continue;
                }

                ffzBadges.set(
                    String(id),
                    {
                        url,

                        title:
                            badge.title ||
                            badge.name ||
                            `FFZ ${id}`
                    }
                );
            }
        }

        const roomResponse =
            await fetch(
                `https://api.frankerfacez.com/v1/room/${encodeURIComponent(
                    CHANNEL
                )}`
            );

        if (!roomResponse.ok) {
            console.warn(
                `FFZ room badge request failed: ${roomResponse.status}`
            );

            return;
        }

        const roomData =
            await roomResponse.json();

        const room =
            roomData.room || {};

        if (room.vip_badge) {
            ffzRoomBadges.vip =
                normalizeFFZRoomBadge(
                    room.vip_badge,
                    "FFZ Custom VIP"
                );
        } else {
            ffzRoomBadges.vip = null;
        }

        if (room.moderator_badge) {
            ffzRoomBadges.moderator =
                normalizeFFZRoomBadge(
                    room.moderator_badge,
                    "FFZ Custom Moderator"
                );
        } else {
            ffzRoomBadges.moderator = null;
        }

        if (ffzRoomBadges.vip?.url) {
            preloadBadgeImage(
                ffzRoomBadges.vip.url
            );
        }

        if (ffzRoomBadges.moderator?.url) {
            preloadBadgeImage(
                ffzRoomBadges.moderator.url
            );
        }

        console.log(
            "Loaded FFZ channel badges:",
            {
                customVIP:
                    Boolean(
                        ffzRoomBadges.vip
                    ),

                customModerator:
                    Boolean(
                        ffzRoomBadges.moderator
                    )
            }
        );

    } catch (error) {
        console.error(
            "FFZ badge error:",
            error
        );
    }
}

async function loadExternalBadges() {
    await Promise.allSettled([
        loadFFZBadges(),
        loadChatterinoBadges(),
        loadHomiesBadges(),
        loadBTTVBadges(),
        loadDankChatBadges(),
        loadMoltorinoBadges()
    ]);
}

function preloadBadgeImage(url) {
    if (!url) {
        return Promise.resolve(null);
    }

    const cached =
        badgeImageCache.get(url);

    if (
        cached instanceof
        HTMLImageElement
    ) {
        return Promise.resolve(
            cached
        );
    }

    if (
        cached instanceof Promise
    ) {
        return cached;
    }

    const promise =
        new Promise(resolve => {
            const img =
                new Image();

            img.decoding =
                "async";

            img.onload = () => {
                badgeImageCache.set(
                    url,
                    img
                );

                resolve(img);
            };

            img.onerror = () => {
                badgeImageCache.delete(
                    url
                );

                resolve(null);
            };

            img.src =
                url;
        });

    badgeImageCache.set(
        url,
        promise
    );

    return promise;
}

function createBadge(
    url,
    title
) {
    if (!url) {
        return null;
    }

    const img =
        document.createElement("img");

    img.className =
        "badge";

    img.alt = "";

    img.title =
        title || "";

    img.width = 18;
    img.height = 18;

    img.loading =
        "eager";

    img.decoding =
        "async";

    img.style.width =
        "18px";

    img.style.height =
        "18px";

    img.style.objectFit =
        "contain";

    img.style.display =
        "inline-block";

    img.style.verticalAlign =
        "middle";

    img.style.marginRight =
        "2px";

    const cached =
        badgeImageCache.get(url);

    if (
        cached instanceof
        HTMLImageElement
    ) {
        img.src =
            cached.src;

        return img;
    }

    img.src =
        url;

    preloadBadgeImage(url);

    return img;
}

function createTwitchBadges(tags) {
    const container =
        document.createElement("span");

    container.className =
        "badges twitch-badges";

    if (!badgeTwitch) {
        return container;
    }

    const badgeString =
        tags.badges || "";

    if (!badgeString) {
        return container;
    }

    for (
        const entry
        of badgeString
            .split(",")
            .filter(Boolean)
    ) {
        const slash =
            entry.indexOf("/");

        if (slash === -1) {
            continue;
        }

        const set =
            entry.substring(
                0,
                slash
            );

        const version =
            entry.substring(
                slash + 1
            );

        let badge =
            twitchBadges.get(
                `${set}/${version}`
            );

        if (!badge && set === "subscriber") {
            badge = twitchBadges.get("subscriber/1");
        }

        const badgeUrl =
            badge?.url_2x ||
            badge?.url_1x ||
            badge?.url_4x ||
            null;

        if (!badgeUrl) {
            console.warn(
                "Twitch badge not found:",
                `${set}/${version}`
            );

            continue;
        }

        const img =
            document.createElement("img");

        img.className =
            "badge";

        img.src =
            badgeUrl;

        img.alt =
            badge?.title ||
            set;

        img.title =
            badge?.title ||
            set;

        img.width = 18;
        img.height = 18;

        img.style.width =
            "18px";

        img.style.height =
            "18px";

        img.style.objectFit =
            "contain";

        img.dataset.badgeType =
            set;

        img.dataset.badgeProvider =
            "twitch";

        container.appendChild(
            img
        );
    }

    return container;
}

async function loadChatterinoBadges() {
    try {
        const response = await fetch("https://api.chatterino.com/badges");

        if (!response.ok) {
            throw new Error(`Chatterino badges: ${response.status}`);
        }

        const data = await response.json();

        for (const badge of data.badges || []) {
            const url = normalizeImageUrl(
                badge.image3 || badge.image2 || badge.image1
            );

            if (!url) {
                continue;
            }

            const title = badge.tooltip || "Chatterino Badge";

            for (const rawId of badge.users || []) {
                const id = String(rawId);

                if (!chatterinoBadges.has(id)) {
                    chatterinoBadges.set(id, []);
                }

                chatterinoBadges.get(id).push({ url, title });
            }
        }

        console.log(
            `Loaded Chatterino badges for ${chatterinoBadges.size} users.`
        );

    } catch (error) {
        console.error("Chatterino badge error:", error);
    }
}

function createFFZRoomBadge(tags) {
    if (!badgeFfz) {
        return null;
    }

    const badgeString =
        tags.badges || "";

    if (!badgeString) {
        return null;
    }

    const badgeTypes =
        new Set();

    for (
        const entry
        of badgeString
            .split(",")
            .filter(Boolean)
    ) {
        const slash =
            entry.indexOf("/");

        const type =
            slash === -1
                ? entry
                : entry.substring(
                    0,
                    slash
                );

        badgeTypes.add(type);
    }

    if (
        badgeTypes.has("moderator") &&
        ffzRoomBadges.moderator
    ) {
        const badge =
            ffzRoomBadges.moderator;

        const img =
            createBadge(
                badge.url,
                badge.title
            );

        if (!img) {
            return null;
        }

        img.dataset.badgeType =
            "moderator";

        img.dataset.badgeProvider =
            "ffz";

        return {
            type:
                "moderator",

            img
        };
    }

    if (
        badgeTypes.has("vip") &&
        ffzRoomBadges.vip
    ) {
        const badge =
            ffzRoomBadges.vip;

        const img =
            createBadge(
                badge.url,
                badge.title
            );

        if (!img) {
            return null;
        }

        img.dataset.badgeType =
            "vip";

        img.dataset.badgeProvider =
            "ffz";

        return {
            type:
                "vip",

            img
        };
    }

    return null;
}


function hasTwitchBadge(
    tags,
    badgeType
) {
    if (!tags) {
        return false;
    }

    const badgeString =
        tags.badges || "";

    if (!badgeString) {
        return false;
    }

    return badgeString
        .split(",")
        .filter(Boolean)
        .some(entry => {
            const slash =
                entry.indexOf("/");

            const type =
                slash === -1
                    ? entry
                    : entry.substring(
                        0,
                        slash
                    );

            return type === badgeType;
        });
}


function isFFZVipBadge(
    id,
    badge
) {
    const badgeId =
        String(id || "")
            .toLowerCase();

    const badgeName =
        String(
            badge?.name || ""
        )
            .toLowerCase();

    const badgeTitle =
        String(
            badge?.title || ""
        )
            .toLowerCase();


    return (
        badgeId === "vip" ||
        badgeName === "vip" ||
        badgeTitle === "vip" ||
        badgeTitle.includes("vip")
    );
}

function isBadgeProviderEnabled(provider) {
    switch (provider) {
        case "FFZ":
            return badgeFfz;
        case "7TV":
            return badgeSeventv;
        case "Chatterino":
            return badgeChatterino;
        case "Homies":
            return badgeHomies;
        case "BTTV":
            return badgeBttv;
        case "DankChat":
            return badgeDankchat;
        case "Moltorino":
            return badgeMoltorino;
        default:
            return true;
    }
}


async function createExternalBadges(
    userId,
    tags = null
) {
    const container =
        document.createElement("span");

    container.className =
        "badges external-badges";

    if (!userId) {
        return container;
    }

    userId =
        String(userId);

    if (
        externalBadgeCache.has(
            userId
        )
    ) {
        const cached =
            externalBadgeCache.get(
                userId
            );

        for (
            const badge
            of cached
        ) {
            if (!isBadgeProviderEnabled(badge.provider)) {
                continue;
            }

            if (
                badge.provider === "FFZ" &&
                badge.type === "vip" &&
                ffzRoomBadges.vip &&
                hasTwitchBadge(
                    tags,
                    "vip"
                )
            ) {
                continue;
            }

            const img =
                createBadge(
                    badge.url,
                    badge.title
                );

            if (img) {
                container.appendChild(
                    img
                );
            }
        }

        return container;
    }

    if (
        externalBadgePromises.has(
            userId
        )
    ) {
        const badges =
            await externalBadgePromises.get(
                userId
            );

        for (
            const badge
            of badges
        ) {
            if (!isBadgeProviderEnabled(badge.provider)) {
                continue;
            }

            if (
                badge.provider === "FFZ" &&
                badge.type === "vip" &&
                ffzRoomBadges.vip &&
                hasTwitchBadge(
                    tags,
                    "vip"
                )
            ) {
                continue;
            }

            const img =
                createBadge(
                    badge.url,
                    badge.title
                );

            if (img) {
                container.appendChild(
                    img
                );
            }
        }

        return container;
    }


    const promise =
        (async () => {
            const badges = [];
            const ffzUser =
                await getFFZUser(
                    userId
                );

            if (ffzUser) {
                const ffzUserBadges =
                    ffzUser.badges || {};

                for (
                    const [
                        id,
                        badge
                    ]
                    of Object.entries(
                        ffzUserBadges
                    )
                ) {

                    if (
                        ffzRoomBadges.vip &&
                        hasTwitchBadge(
                            tags,
                            "vip"
                        ) &&
                        isFFZVipBadge(
                            id,
                            badge
                        )
                    ) {
                        continue;
                    }


                    const url =
                        badge?.urls?.["4"] ||
                        badge?.urls?.["2"] ||
                        badge?.urls?.["1"] ||
                        badge?.image;

                    if (!url) {
                        continue;
                    }

                    const normalizedUrl =
                        normalizeImageUrl(
                            url
                        );

                    if (!normalizedUrl) {
                        continue;
                    }

                    badges.push({
                        url:
                            normalizedUrl,

                        title:
                            badge?.title ||
                            badge?.name ||
                            `FFZ ${id}`,

                        provider:
                            "FFZ",

                        type:
                            isFFZVipBadge(
                                id,
                                badge
                            )
                                ? "vip"
                                : null
                    });

                    preloadBadgeImage(
                        normalizedUrl
                    );
                }
            }

            const sevenTV =
                await load7TVUserBadges(
                    userId
                );

            for (
                const badge
                of sevenTV
            ) {
                let url =
                    badge.loadedUrl ||
                    null;

                if (!url) {
                    for (
                        const candidate
                        of badge.urls || []
                    ) {
                        const image =
                            await preloadBadgeImage(
                                candidate
                            );

                        if (image) {
                            url =
                                candidate;

                            break;
                        }
                    }
                }

                if (!url) {
                    continue;
                }

                badges.push({
                    url,

                    title:
                        badge.name ||
                        "7TV",

                    provider:
                        "7TV",

                    type:
                        null
                });
            }


            const chatterino =
                chatterinoBadges.get(userId) || [];

            for (
                const badge
                of chatterino
            ) {
                const image =
                    await preloadBadgeImage(
                        badge.url
                    );

                if (!image) {
                    continue;
                }

                badges.push({
                    url:
                        badge.url,

                    title:
                        badge.title,

                    provider:
                        "Chatterino",

                    type:
                        null
                });
            }

            const homies =
                homiesBadges.get(userId) || [];

            for (const badge of homies) {
                const image =
                    await preloadBadgeImage(
                        badge.url
                    );

                if (!image) {
                    continue;
                }

                badges.push({
                    url:
                        badge.url,

                    title:
                        badge.title,

                    provider:
                        "Homies",

                    type:
                        null
                });
            }

            pushProviderBadges(badges, bttvBadges, userId, "BTTV");
            pushProviderBadges(badges, dankchatBadges, userId, "DankChat");
            pushProviderBadges(badges, moltorinoBadges, userId, "Moltorino");

            // make sure every pushed image actually like loads  lmao
            return (await Promise.all(
                badges.map(async badge =>
                    (await preloadBadgeImage(badge.url)) ? badge : null
                )
            )).filter(Boolean);
        })();


    externalBadgePromises.set(
        userId,
        promise
    );


    try {
        const badges =
            await promise;

        externalBadgeCache.set(
            userId,
            badges
        );


        for (
            const badge
            of badges
        ) {
            if (!isBadgeProviderEnabled(badge.provider)) {
                continue;
            }

            if (
                badge.provider === "FFZ" &&
                badge.type === "vip" &&
                ffzRoomBadges.vip &&
                hasTwitchBadge(
                    tags,
                    "vip"
                )
            ) {
                continue;
            }

            const img =
                createBadge(
                    badge.url,
                    badge.title
                );

            if (img) {
                container.appendChild(
                    img
                );
            }
        }

        return container;

    } finally {
        externalBadgePromises.delete(
            userId
        );
    }
}


async function load7TVUserBadges(userId) {
    if (!userId) {
        return [];
    }

    userId =
        String(userId);

    if (sevenTVBadges.has(userId)) {
        return sevenTVBadges.get(
            userId
        );
    }

    const query = `
        query GetUserBadge($platformId: String!) {
            users {
                userByConnection(
                    platform: TWITCH
                    platformId: $platformId
                ) {
                    style {
                        activeBadge {
                            id
                            name
                        }
                    }
                }
            }
        }
    `;

    try {
        const response =
            await fetch(
                "https://api.7tv.app/v4/gql",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        query,

                        variables: {
                            platformId:
                                userId
                        }
                    })
                }
            );

        if (!response.ok) {
            throw new Error(
                `7TV badge HTTP error: ${response.status}`
            );
        }

        const result =
            await response.json();

        if (result.errors) {
            sevenTVBadges.set(
                userId,
                []
            );

            return [];
        }

        const badge =
            result.data
                ?.users
                ?.userByConnection
                ?.style
                ?.activeBadge;

        if (!badge?.id) {
            sevenTVBadges.set(
                userId,
                []
            );

            return [];
        }

        const badgeId =
            String(badge.id);

        const urls = [
            `https://cdn.7tv.app/badge/${badgeId}/4x`,
            `https://cdn.7tv.app/badge/${badgeId}/2x`,
            `https://cdn.7tv.app/badge/${badgeId}/1x`,
            `https://cdn.7tv.app/badge/${badgeId}/4x.webp`,
            `https://cdn.7tv.app/badge/${badgeId}/2x.webp`,
            `https://cdn.7tv.app/badge/${badgeId}/1x.webp`
        ];

        const badges = [
            {
                id:
                    badgeId,

                name:
                    badge.name ||
                    "7TV Badge",

                urls
            }
        ];

        sevenTVBadges.set(
            userId,
            badges
        );

        for (
            const badgeData
            of badges
        ) {
            for (
                const url
                of badgeData.urls
            ) {
                const image =
                    await preloadBadgeImage(
                        url
                    );

                if (image) {
                    badgeData.loadedUrl =
                        url;

                    break;
                }
            }
        }

        return badges;

    } catch (error) {
        console.error(
            "7TV user badge error:",
            error
        );

        sevenTVBadges.set(
            userId,
            []
        );

        return [];
    }
}


async function getFFZUser(userId) {
    if (!userId) {
        return null;
    }

    try {
        const response =
            await fetch(
                `https://api.frankerfacez.com/v1/user/id/${userId}`
            );

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch {
        return null;
    }
}

const bttvBadges = new Map();
const dankchatBadges = new Map();
const moltorinoBadges = new Map();

const BTTV_BADGES_URL = "https://api.betterttv.net/3/cached/badges";

const DANKCHAT_BADGES_URLS = [
    "data/dankchat-badges.json",
    "https://flxrs.com/api/badges"
];
const CUSTOM_CORS_PROXY = "";

const CORS_PROXIES = [
    ...(CUSTOM_CORS_PROXY
        ? [url => `${CUSTOM_CORS_PROXY}${encodeURIComponent(url)}`]
        : []),
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
];
const MOLTORINO_BADGES_URL = "https://api.moltorino.com/v2/badges";

function addProviderBadge(map, userId, url, title) {
    const id = String(userId ?? "").trim();

    if (!id || !url) {
        return;
    }

    if (!map.has(id)) {
        map.set(id, []);
    }

    const list = map.get(id);

    if (!list.some(entry => entry.url === url)) {
        list.push({ url, title });
    }
}

function pickBadgeImage(badge) {
    return normalizeImageUrl(
        badge?.image4 ||
        badge?.image3 ||
        badge?.image2 ||
        badge?.image1 ||
        badge?.url ||
        badge?.image_url ||
        badge?.imageUrl ||
        badge?.image ||
        badge?.svg ||
        badge?.icon ||
        badge?.asset ||
        null
    );
}

function pickBadgeTitle(badge, fallback) {
    return (
        badge?.tooltip ||
        badge?.title ||
        badge?.description ||
        badge?.name ||
        fallback
    );
}

async function loadBTTVBadges() {
    try {
        const response = await fetch(BTTV_BADGES_URL);

        if (!response.ok) {
            throw new Error(`BTTV badges: ${response.status}`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : (data?.badges || []);

        bttvBadges.clear();

        for (const entry of list) {
            const url = pickBadgeImage(entry?.badge || entry);

            addProviderBadge(
                bttvBadges,
                entry?.providerId ?? entry?.userId ?? entry?.id,
                url,
                pickBadgeTitle(entry?.badge || entry, "BTTV Badge")
            );
        }

        console.log(`Loaded BTTV badges for ${bttvBadges.size} users.`);

    } catch (error) {
        console.error("BTTV badge error:", error);
    }
}

function ingestBadgeBundle(map, data, defaultTitle) {
    const list = Array.isArray(data)
        ? data
        : (data?.badges || data?.data || []);

    const byId = new Map();

    for (const badge of list) {
        const url = pickBadgeImage(badge);

        if (!url) {
            continue;
        }

        const title = pickBadgeTitle(badge, defaultTitle);

        if (badge?.id != null) {
            byId.set(String(badge.id), { url, title });
        }

        const ids = [
            ...(Array.isArray(badge?.users) ? badge.users : []),
            ...(badge?.userId != null ? [badge.userId] : []),
            ...(badge?.user_id != null ? [badge.user_id] : [])
        ];

        for (const id of ids) {
            addProviderBadge(map, id, url, title);
        }
    }

    if (
        data &&
        !Array.isArray(data) &&
        data.users &&
        typeof data.users === "object" &&
        !Array.isArray(data.users)
    ) {
        for (const [userId, value] of Object.entries(data.users)) {
            const badgeIds = Array.isArray(value) ? value : [value];

            for (const badgeId of badgeIds) {
                const badge = byId.get(String(badgeId?.id ?? badgeId));

                if (badge) {
                    addProviderBadge(map, userId, badge.url, badge.title);
                }
            }
        }
    }
}

async function fetchJsonWithCorsFallback(url) {
    const isRemote = /^https?:\/\//i.test(url);
    const attempts = isRemote
        ? [url, ...CORS_PROXIES.map(make => make(url))]
        : [url];
    let lastError = null;

    for (const attempt of attempts) {
        try {
            const response = await fetch(attempt);

            if (!response.ok) {
                throw new Error(`${attempt}: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error(`Could not fetch ${url}`);
}

async function loadDankChatBadges() {
    dankchatBadges.clear();

    for (const url of DANKCHAT_BADGES_URLS) {
        try {
            const data = await fetchJsonWithCorsFallback(url);

            ingestBadgeBundle(dankchatBadges, data, "DankChat Badge");

            console.log(
                `Loaded DankChat badges for ${dankchatBadges.size} users.`
            );

            if (!dankchatBadges.size) {
                console.warn("DankChat response had an unexpected shape:", data);
            }

            return;
        } catch (error) {
            console.warn("DankChat badge source failed:", error.message);
        }
    }

    console.error("DankChat badges: no working source found.");
}

async function loadMoltorinoBadges() {
    try {
        const response = await fetch(MOLTORINO_BADGES_URL);

        if (!response.ok) {
            throw new Error(`Moltorino badges: ${response.status}`);
        }

        const data = await response.json();

        moltorinoBadges.clear();
        ingestBadgeBundle(moltorinoBadges, data, "Moltorino Badge");

        console.log(`Loaded Moltorino badges for ${moltorinoBadges.size} users.`);

        if (!moltorinoBadges.size) {
            console.warn(
                "Moltorino badge response had an unexpected shape. Raw data:",
                data
            );
        }

    } catch (error) {
        console.error("Moltorino badge error:", error);
    }
}

function pushProviderBadges(target, map, userId, provider) {
    for (const badge of map.get(userId) || []) {
        target.push({
            url: badge.url,
            title: badge.title,
            provider,
            type: null
        });
    }
}