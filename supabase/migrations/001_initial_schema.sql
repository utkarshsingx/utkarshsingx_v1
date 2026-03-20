-- Portfolio Admin Schema
-- Run this in Supabase SQL Editor or via supabase db push

-- About Me (single row)
CREATE TABLE IF NOT EXISTS about_me (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  tech_list JSONB NOT NULL DEFAULT '[]',
  profile_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  j_no INT NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  time_period TEXT NOT NULL,
  description TEXT[] NOT NULL,
  sort_order INT DEFAULT 0
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  img TEXT NOT NULL,
  tech_used TEXT[] NOT NULL,
  git_link TEXT,
  link TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Contact (single row)
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title TEXT NOT NULL,
  body_text TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Links
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('github', 'twitter', 'linkedin', 'email')),
  url TEXT NOT NULL,
  label TEXT,
  sort_order INT DEFAULT 0
);

-- Resume (single row)
CREATE TABLE IF NOT EXISTS resume (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  file_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site sections (enable/disable)
CREATE TABLE IF NOT EXISTS site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- Admin allowlist
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY
);

INSERT INTO admin_users (email) VALUES ('hauntedutkarsh@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "about_me_public_read" ON about_me FOR SELECT USING (true);
CREATE POLICY "experience_public_read" ON experience FOR SELECT USING (true);
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (true);
CREATE POLICY "contact_public_read" ON contact FOR SELECT USING (true);
CREATE POLICY "links_public_read" ON links FOR SELECT USING (true);
CREATE POLICY "resume_public_read" ON resume FOR SELECT USING (true);
CREATE POLICY "site_sections_public_read" ON site_sections FOR SELECT USING (true);

-- Admin write: only users in admin_users can insert/update/delete
CREATE POLICY "about_me_admin_write" ON about_me FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "experience_admin_write" ON experience FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "projects_admin_write" ON projects FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "contact_admin_write" ON contact FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "links_admin_write" ON links FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "resume_admin_write" ON resume FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE POLICY "site_sections_admin_write" ON site_sections FOR ALL
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));
