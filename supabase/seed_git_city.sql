-- Optional: Seed git_city_developers with sample data
-- Run after: npx supabase db push (or after 004_git_city_developers migration)
-- Then: psql $DATABASE_URL -f supabase/seed_git_city.sql (or run in Supabase SQL Editor)

INSERT INTO git_city_developers (
  github_login, github_id, name, avatar_url, bio,
  contributions, public_repos, total_stars, primary_language,
  top_repos, rank, claimed, district, owned_items, contributions_total
) VALUES
  ('utkarshsingx', NULL, 'Utkarsh Singh', 'https://avatars.githubusercontent.com/u/utkarshsingx', 'Full-stack developer', 1200, 25, 150, 'TypeScript', '[]'::jsonb, 1, true, 'frontend', '["flag","neon_outline"]'::jsonb, 1200),
  ('torvalds', NULL, 'Linus Torvalds', 'https://avatars.githubusercontent.com/u/1024025', 'Creator of Linux', 8000, 8, 150000, 'C', '[]'::jsonb, 2, true, 'backend', '[]'::jsonb, 8000),
  ('gaearon', NULL, 'Dan Abramov', 'https://avatars.githubusercontent.com/u/810438', 'Co-author of Redux, Create React App', 5000, 120, 80000, 'JavaScript', '[]'::jsonb, 3, true, 'frontend', '[]'::jsonb, 5000)
ON CONFLICT (github_login) DO UPDATE SET
  contributions = EXCLUDED.contributions,
  public_repos = EXCLUDED.public_repos,
  total_stars = EXCLUDED.total_stars,
  primary_language = EXCLUDED.primary_language,
  rank = EXCLUDED.rank,
  fetched_at = now();
