async function loadCommitInfo(target) {
	if (!target) {
		return;
	}

	try {
		const response = await fetch(
			"https://api.github.com/repos/MarzzzDev/MChat/commits/main",
		);

		if (!response.ok) {
			throw new Error(`GitHub API returned ${response.status}`);
		}

		const data = await response.json();
		const shortSha = data.sha.slice(0, 7);
		const commitDate = new Date(data.commit.committer?.date || data.commit.author.date);
		const formattedDate = Number.isNaN(commitDate.getTime())
			? "date unavailable"
			: new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(commitDate);

		target.textContent = `${shortSha} · ${formattedDate}`;
		target.href = data.html_url;
		target.title = `${data.commit.message.split("\n")[0]} · ${commitDate.toISOString()}`;
	} catch (error) {
		console.warn("Could not load latest commit info:", error);

		target.textContent = "unknown";
	}
}
