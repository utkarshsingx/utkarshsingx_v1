/**
 * GitHub API client for Git City – fetches live user stats.
 * Uses public REST API (no auth required for basic reads).
 */

import type { DeveloperRecord, TopRepo } from './github';

const GITHUB_API = 'https://api.github.com';

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string | null;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

/**
 * Fetch a GitHub user by username and convert to DeveloperRecord.
 * Contributions are estimated (GitHub doesn't expose via API).
 */
export async function fetchGitHubUser(username: string): Promise<DeveloperRecord> {
  const norm = username.trim().toLowerCase();
  if (!norm) throw new GitHubAPIError('Username required');

  const [userRes, reposRes] = await Promise.all([
    fetch(`${GITHUB_API}/users/${encodeURIComponent(norm)}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
    fetch(`${GITHUB_API}/users/${encodeURIComponent(norm)}/repos?per_page=100&sort=stargazers_count`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
  ]);

  if (!userRes.ok) {
    const data = await userRes.json().catch(() => ({}));
    if (userRes.status === 404) throw new GitHubAPIError('User not found', 404, data);
    throw new GitHubAPIError(data.message || userRes.statusText, userRes.status, data);
  }

  const user: GitHubUser = await userRes.json();
  let repos: GitHubRepo[] = [];
  if (reposRes.ok) repos = await reposRes.json();

  const total_stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const topRepos: TopRepo[] = repos
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
    }));

  const languages = repos.map((r) => r.language).filter(Boolean) as string[];
  const primary_language =
    languages.length > 0
      ? languages.sort(
          (a, b) =>
            languages.filter((x) => x === b).length - languages.filter((x) => x === a).length
        )[0]
      : null;

  const now = new Date().toISOString();
  const contributions = estimateContributions(user.public_repos, user.followers, total_stars);

  return {
    id: user.id,
    github_login: user.login,
    github_id: user.id,
    name: user.name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    contributions,
    public_repos: user.public_repos,
    total_stars,
    primary_language,
    top_repos: topRepos,
    rank: null,
    fetched_at: now,
    created_at: now,
    claimed: false,
    fetch_priority: 0,
    claimed_at: null,
    district: null,
    owned_items: [],
    followers: user.followers,
    following: user.following,
    account_created_at: user.created_at,
    contributions_total: contributions,
    contribution_years: [],
  };
}

function estimateContributions(publicRepos: number, followers: number, totalStars: number): number {
  const repoScore = Math.min(publicRepos * 80, 8000);
  const followerScore = Math.min(followers * 10, 2000);
  const starScore = Math.min(totalStars / 10, 3000);
  return Math.round(repoScore + followerScore + starScore);
}
