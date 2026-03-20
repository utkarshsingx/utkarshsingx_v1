import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface AboutMeRow {
  id: string;
  content: string;
  tech_list: string[];
  profile_image_url: string | null;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  j_no: number;
  name: string;
  position: string;
  time_period: string;
  description: string[];
  sort_order: number;
}

export interface ProjectRow {
  id: string;
  name: string;
  description: string;
  img: string;
  tech_used: string[];
  git_link: string | null;
  link: string;
  sort_order: number;
}

export interface ContactRow {
  id: string;
  section_title: string;
  body_text: string;
  cta_label: string;
  cta_url: string;
  updated_at: string;
}

export interface LinkRow {
  id: string;
  type: 'github' | 'twitter' | 'linkedin' | 'email';
  url: string;
  label: string | null;
  sort_order: number;
}

export interface ResumeRow {
  id: string;
  file_url: string;
  file_name: string | null;
  updated_at: string;
}

export interface SiteSectionRow {
  id: string;
  key: string;
  enabled: boolean;
  sort_order: number;
}

export interface PortfolioData {
  aboutMe: AboutMeRow | null;
  experience: ExperienceRow[];
  projects: ProjectRow[];
  contact: ContactRow | null;
  links: LinkRow[];
  resume: ResumeRow | null;
  siteSections: SiteSectionRow[];
}

const initialData: PortfolioData = {
  aboutMe: null,
  experience: [],
  projects: [],
  contact: null,
  links: [],
  resume: null,
  siteSections: []
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [aboutRes, expRes, projRes, contactRes, linksRes, resumeRes, sectionsRes] = await Promise.all([
        supabase.from('about_me').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('contact').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('links').select('*').order('sort_order', { ascending: true }),
        supabase.from('resume').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('site_sections').select('*').order('sort_order', { ascending: true })
      ]);

      if (aboutRes.error) throw aboutRes.error;
      if (expRes.error) throw expRes.error;
      if (projRes.error) throw projRes.error;
      if (contactRes.error) throw contactRes.error;
      if (linksRes.error) throw linksRes.error;
      if (resumeRes.error) throw resumeRes.error;
      if (sectionsRes.error) throw sectionsRes.error;

      setData({
        aboutMe: aboutRes.data as AboutMeRow | null,
        experience: (expRes.data || []) as ExperienceRow[],
        projects: (projRes.data || []) as ProjectRow[],
        contact: contactRes.data as ContactRow | null,
        links: (linksRes.data || []) as LinkRow[],
        resume: resumeRes.data as ResumeRow | null,
        siteSections: (sectionsRes.data || []) as SiteSectionRow[]
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch portfolio data');
      setData(initialData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
