import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const USER = "kangkanrajkhowa";
const OUT = fileURLToPath(new URL("../src/content/github-stats.json", import.meta.url));
const token = process.env.GH_STATS_TOKEN || process.env.GITHUB_TOKEN || "";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "kangkan-portfolio-build",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function get(url) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

try {
  const user = await get(`https://api.github.com/users/${USER}`);
  const allRepos = await get(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
  );
  const repos = allRepos.filter((repo) => !repo.fork);

  const languages = {};
  const sampled = [...repos]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  for (const repo of sampled) {
    try {
      const repoLanguages = await get(repo.languages_url);
      for (const [name, bytes] of Object.entries(repoLanguages)) {
        languages[name] = (languages[name] ?? 0) + bytes;
      }
    } catch {
      // individual repo language fetch is best-effort
    }
  }

  const languageList = Object.entries(languages)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  const topRepos = [...repos]
    .filter((repo) => repo.description)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at) - new Date(a.pushed_at),
    )
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      pushedAt: repo.pushed_at,
    }));

  const data = {
    generatedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: user.name,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
    },
    totals: {
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
      repos: repos.length,
      languages: languageList.length,
    },
    languages: languageList,
    topRepos,
  };

  await fs.writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(
    `[github] wrote stats: ${data.totals.repos} repos, ${data.totals.stars} stars, ${languageList.length} languages`,
  );
} catch (error) {
  console.warn(
    `[github] stats fetch failed (${error.message}); keeping existing src/content/github-stats.json`,
  );
}
