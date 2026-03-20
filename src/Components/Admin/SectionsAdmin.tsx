import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { SiteSectionRow } from '../../hooks/usePortfolioData';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const DEFAULT_SECTIONS = [
  { key: 'about', enabled: true, sort_order: 0 },
  { key: 'experience', enabled: true, sort_order: 1 },
  { key: 'contributions', enabled: true, sort_order: 2 },
  { key: 'projects', enabled: true, sort_order: 3 },
  { key: 'contact', enabled: true, sort_order: 4 }
];

const SectionsAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [sections, setSections] = useState<SiteSectionRow[]>([]);
  const [initialSections, setInitialSections] = useState<Map<string, boolean>>(new Map());
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loaded = data.siteSections;
    if (loaded.length > 0) {
      setSections(loaded);
      setInitialSections(new Map(loaded.map((s) => [s.id, s.enabled])));
    }
  }, [data.siteSections]);

  useEffect(() => {
    if (loading || error) return;
    if (data.siteSections.length === 0) {
      (async () => {
        const { data: inserted, error: insertErr } = await supabase
          .from('site_sections')
          .insert(DEFAULT_SECTIONS)
          .select('*');
        if (!insertErr && inserted) {
          await refetch();
        }
      })();
    }
  }, [loading, error, data.siteSections.length, refetch]);

  const toggle = (id: string, enabled: boolean) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    setSaveSuccess(false);
  };

  const save = async () => {
    const changed = sections.filter((s) => initialSections.get(s.id) !== s.enabled);
    if (changed.length === 0) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    try {
      for (const s of changed) {
        const { error } = await supabase.from('site_sections').update({ enabled: s.enabled }).eq('id', s.id);
        if (error) throw error;
      }
      setInitialSections(new Map(sections.map((s) => [s.id, s.enabled])));
      await refetch();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;
  if (error) return <div className="text-red-400">Failed to load: {error}</div>;

  return (
    <div className="max-w-2xl">
      <div className="min-h-[2rem] flex items-center mb-4">
        <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-xl sm:text-2xl">
          Sections
        </GlitchText>
      </div>
      <p className="text-slate-400 text-sm mb-6">Toggle which sections are visible on the homepage.</p>
      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-primary/20 text-primary text-sm flex items-center justify-between">
          <span>Saved! Changes will reflect on the homepage.</span>
          <Link to="/" className="underline hover:no-underline">View homepage</Link>
        </div>
      )}
      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 px-4 py-3"
          >
            <span className="text-lightest_slate capitalize">{s.key}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-slate-400">{s.enabled ? 'Visible' : 'Hidden'}</span>
              <input
                type="checkbox"
                checked={s.enabled}
                onChange={(e) => toggle(s.id, e.target.checked)}
                className="rounded"
              />
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-6 px-6 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default SectionsAdmin;
