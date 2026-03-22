-- Git City developers — optional table for persistent city data
-- If populated, GitCityPage will use this instead of static seed

CREATE TABLE IF NOT EXISTS git_city_developers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  github_login TEXT NOT NULL UNIQUE,
  github_id BIGINT,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  contributions INT NOT NULL DEFAULT 0,
  public_repos INT NOT NULL DEFAULT 0,
  total_stars INT NOT NULL DEFAULT 0,
  primary_language TEXT,
  top_repos JSONB NOT NULL DEFAULT '[]'::jsonb,
  rank INT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed BOOLEAN DEFAULT false,
  district TEXT,
  owned_items JSONB DEFAULT '[]'::jsonb,
  contributions_total INT,
  followers INT,
  following INT,
  account_created_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_git_city_developers_login ON git_city_developers (github_login);
CREATE INDEX IF NOT EXISTS idx_git_city_developers_rank ON git_city_developers (rank);
CREATE INDEX IF NOT EXISTS idx_git_city_developers_contributions ON git_city_developers (contributions DESC);

ALTER TABLE git_city_developers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read git_city_developers"
  ON git_city_developers FOR SELECT
  USING (true);
