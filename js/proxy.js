const ALLOWED_HOSTS = [
	"kick.com",
	"youtube.com",
	"www.youtube.com",
	"youtubei.googleapis.com",
];

const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
	"(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const DROP_HEADERS = new Set([
	"host",
	"origin",
	"referer",
	"cookie",
	"user-agent",
	"content-length",
	"connection",
]);

function isAllowed(url) {
	return (
		url.protocol === "https:" &&
		ALLOWED_HOSTS.some(
			(host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
		)
	);
}

export default {
	async fetch(request, env) {
		const origin = env.ALLOWED_ORIGIN || "*";

		const cors = {
			"Access-Control-Allow-Origin": origin,
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Max-Age": "86400",
			Vary: "Origin",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: cors });
		}

		if (origin !== "*" && request.headers.get("Origin") !== origin) {
			return new Response("Forbidden", { status: 403, headers: cors });
		}

		let target;

		try {
			target = new URL(new URL(request.url).searchParams.get("u"));
		} catch {
			return new Response("Bad target", { status: 400, headers: cors });
		}

		if (!isAllowed(target)) {
			return new Response("Host not allowed", { status: 403, headers: cors });
		}

		const headers = new Headers();

		for (const [key, value] of request.headers) {
			const name = key.toLowerCase();

			if (
				DROP_HEADERS.has(name) ||
				name.startsWith("sec-") ||
				name.startsWith("cf-") ||
				name.startsWith("x-forwarded") ||
				name === "x-real-ip"
			) {
				continue;
			}

			headers.set(key, value);
		}

		headers.set("User-Agent", USER_AGENT);

		if (target.hostname.endsWith("youtube.com") || target.hostname.endsWith("googleapis.com")) {
			headers.set("Origin", "https://www.youtube.com");
			headers.set("Referer", "https://www.youtube.com/");
			headers.set("Cookie", "SOCS=CAI; CONSENT=YES+1");
		} else {
			headers.set("Referer", "https://kick.com/");
		}

		const upstream = await fetch(target.toString(), {
			method: request.method,
			headers,
			body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
			redirect: "follow",
		});

		const responseHeaders = new Headers(upstream.headers);

		for (const [key, value] of Object.entries(cors)) {
			responseHeaders.set(key, value);
		}

		return new Response(upstream.body, {
			status: upstream.status,
			headers: responseHeaders,
		});
	},
};