import { useMemo, useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { generateCityLayout } from '@/lib/gitCity/github';
import { fetchGitHubUser, GitHubAPIError } from '@/lib/gitCity/github-api';
import { fetchGitCityDevelopers } from '@/lib/gitCity/supabase-developers';
import { GIT_CITY_SEED } from '@/data/gitCitySeed';
import { THEME_NAMES } from '@/components/GitCity/types';
import type { DeveloperRecord } from '@/lib/gitCity/github';

const CityCanvas = lazy(() =>
  import('@/components/GitCity/CityCanvas').then((m) => ({ default: m.default }))
);

function GitCityPage() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [introMode, setIntroMode] = useState(true);
  const [focusedBuilding, setFocusedBuilding] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [addedDevs, setAddedDevs] = useState<DeveloperRecord[]>([]);
  const [baseDevs, setBaseDevs] = useState<DeveloperRecord[]>(GIT_CITY_SEED);

  useEffect(() => {
    fetchGitCityDevelopers().then((devs) => {
      if (devs && devs.length > 0) setBaseDevs(devs);
    });
  }, []);

  const allDevs = useMemo(() => {
    const seen = new Set(addedDevs.map((d) => d.github_login.toLowerCase()));
    const base = baseDevs.filter((d) => !seen.has(d.github_login.toLowerCase()));
    return [...addedDevs, ...base];
  }, [addedDevs, baseDevs]);

  const layout = useMemo(() => generateCityLayout(allDevs), [allDevs]);

  const handleIntroEnd = useCallback(() => setIntroMode(false), []);

  const handleBuildingClick = useCallback((building: { login: string }) => {
    setFocusedBuilding((prev) => (prev === building.login ? null : building.login));
  }, []);

  const handleSearch = useCallback(async () => {
    const username = searchInput.trim();
    if (!username) return;
    setSearchError(null);
    setSearchLoading(true);
    try {
      const dev = await fetchGitHubUser(username);
      const lower = dev.github_login.toLowerCase();
      setAddedDevs((prev) => {
        if (prev.some((d) => d.github_login.toLowerCase() === lower)) return prev;
        return [dev, ...prev];
      });
      setFocusedBuilding(dev.github_login);
      setSearchInput('');
    } catch (e) {
      setSearchError(e instanceof GitHubAPIError ? e.message : 'Failed to fetch user');
    } finally {
      setSearchLoading(false);
    }
  }, [searchInput]);

  const removeAddedDev = useCallback((login: string) => {
    setAddedDevs((prev) => prev.filter((d) => d.github_login.toLowerCase() !== login.toLowerCase()));
    if (focusedBuilding?.toLowerCase() === login.toLowerCase()) setFocusedBuilding(null);
  }, [focusedBuilding]);

  return (
    <div className="relative w-full h-screen flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-10 flex flex-wrap items-center justify-between gap-3 p-4 bg-black/40 backdrop-blur-sm">
        <Link
          to="/"
          className="text-sm font-mono text-lightest_slate hover:text-primary transition-colors shrink-0"
        >
          ← Back to portfolio
        </Link>
        <h1 className="text-lg font-mono font-semibold text-lightest_slate shrink-0">Git City</h1>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Add user: username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-slate-900/80 border border-slate-600 rounded px-2 py-1 text-sm font-mono text-lightest_slate w-40 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searchLoading || !searchInput.trim()}
              className="px-2 py-1 text-xs font-mono rounded bg-slate-700 text-lightest_slate hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? '…' : 'Add'}
            </button>
          </div>
          <span className="text-xs text-slate-500 font-mono">Theme:</span>
          <select
            value={themeIndex}
            onChange={(e) => setThemeIndex(Number(e.target.value))}
            className="bg-slate-900/80 border border-slate-600 rounded px-2 py-1 text-sm font-mono text-lightest_slate"
          >
            {THEME_NAMES.map((name, i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {searchError && (
          <p className="absolute top-full left-4 right-4 mt-1 text-xs font-mono text-red-400">
            {searchError}
          </p>
        )}
      </header>

      <div className="flex-1 w-full">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-[var(--theme-bg,#0a192f)]">
              <p className="font-mono text-lightest_slate animate-pulse">Loading city...</p>
            </div>
          }
        >
          <CityCanvas
            buildings={layout.buildings}
            plazas={layout.plazas}
            decorations={layout.decorations}
            river={layout.river}
            bridges={layout.bridges}
            themeIndex={themeIndex}
            introMode={introMode}
            onIntroEnd={handleIntroEnd}
            focusedBuilding={focusedBuilding}
            onBuildingClick={handleBuildingClick}
          />
        </Suspense>
      </div>

      {focusedBuilding && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-slate-600">
          <p className="font-mono text-sm text-lightest_slate">
            @{focusedBuilding}{' '}
            <a
              href={`https://github.com/${focusedBuilding}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-2"
            >
              View on GitHub →
            </a>
          </p>
        </div>
      )}

      {addedDevs.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
          {addedDevs.map((d) => (
            <span
              key={d.github_login}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-slate-800/80 border border-slate-600 text-lightest_slate"
            >
              @{d.github_login}
              <button
                type="button"
                onClick={() => removeAddedDev(d.github_login)}
                className="text-slate-400 hover:text-red-400 ml-0.5"
                aria-label={`Remove ${d.github_login}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default GitCityPage;
