/**
 * Optional Supabase fetch for Git City developers.
 * If VITE_SUPABASE_URL is set and the git_city_developers table exists, use it.
 * Otherwise falls back to seed + GitHub API.
 */

import { supabase } from '@/lib/supabase';
import type { DeveloperRecord, TopRepo } from './github';

interface DbRow {
  id: number;
  github_login: string;
  github_id: number | null;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  contributions: number;
  public_repos: number;
  total_stars: number;
  primary_language: string | null;
  top_repos: unknown;
  rank: number | null;
  fetched_at: string;
  created_at: string;
  claimed: boolean;
  district: string | null;
  owned_items: unknown;
  contributions_total: number | null;
  followers: number | null;
  following: number | null;
  account_created_at: string | null;
}

function rowToDeveloper(r: DbRow): DeveloperRecord {
  return {
    id: r.id,
    github_login: r.github_login,
    github_id: r.github_id,
    name: r.name,
    avatar_url: r.avatar_url,
    bio: r.bio,
    contributions: r.contributions,
    public_repos: r.public_repos,
    total_stars: r.total_stars,
    primary_language: r.primary_language,
    top_repos: Array.isArray(r.top_repos)
      ? (r.top_repos as TopRepo[])
      : (r.top_repos as TopRepo[] || []),
    rank: r.rank,
    fetched_at: r.fetched_at,
    created_at: r.created_at,
    claimed: r.claimed ?? false,
    fetch_priority: 0,
    claimed_at: null,
    district: r.district,
    owned_items: Array.isArray(r.owned_items) ? (r.owned_items as string[]) : [],
    contributions_total: r.contributions_total ?? undefined,
    followers: r.followers ?? undefined,
    following: r.following ?? undefined,
    account_created_at: r.account_created_at,
  };
}

/**
 * Fetch developers from Supabase git_city_developers table.
 * Returns null if Supabase isn't configured, table doesn't exist, or fetch fails (use seed fallback).
 */
export async function fetchGitCityDevelopers(): Promise<DeveloperRecord[] | null> {
  if (!import.meta.env.VITE_SUPABASE_URL) return null;
  try {
    const { data, error } = await supabase
      .from('git_city_developers')
      .select('*')
      .order('contributions', { ascending: false });

    if (error) return null;
    if (!data || data.length === 0) return null;

    return (data as DbRow[]).map(rowToDeveloper);
  } catch {
    return null;
  }
}
