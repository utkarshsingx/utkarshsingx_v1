import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ContactRow } from '../../hooks/usePortfolioData';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ContactAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [sectionTitle, setSectionTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    const row = data.contact;
    if (row) {
      setRowId(row.id);
      setSectionTitle(row.section_title);
      setBodyText(row.body_text);
      setCtaLabel(row.cta_label);
      setCtaUrl(row.cta_url);
    } else {
      setRowId(null);
      setSectionTitle('');
      setBodyText('');
      setCtaLabel('');
      setCtaUrl('');
    }
  }, [data.contact]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { section_title: sectionTitle, body_text: bodyText, cta_label: ctaLabel, cta_url: ctaUrl };
      if (rowId) {
        const { error } = await supabase.from('contact').update(payload).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('contact').insert(payload).select('id').single();
        if (error) throw error;
        setRowId((data as { id: string }).id);
      }
      await refetch();
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
          Contact
        </GlitchText>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Section title</label>
          <input
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Body text</label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">CTA label</label>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">CTA URL</label>
          <input
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default ContactAdmin;
