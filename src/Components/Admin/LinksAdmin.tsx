import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const LINK_TYPES = ['github', 'twitter', 'linkedin', 'email'] as const;

const LinksAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [links, setLinks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const rows = data.links;
    const map: Record<string, string> = {};
    rows.forEach((r) => {
      map[r.type] = r.url;
    });
    LINK_TYPES.forEach((t) => {
      if (!(t in map)) map[t] = '';
    });
    setLinks(map);
  }, [data.links]);

  const save = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < LINK_TYPES.length; i++) {
        const type = LINK_TYPES[i];
        const url = links[type] || '';
        const { data: existing } = await supabase.from('links').select('id').eq('type', type).maybeSingle();
        if (existing) {
          await supabase.from('links').update({ url }).eq('id', (existing as { id: string }).id);
        } else if (url) {
          await supabase.from('links').insert({ type, url, sort_order: i });
        }
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
          Links
        </GlitchText>
      </div>
      <div className="space-y-4">
        {LINK_TYPES.map((type) => (
          <div key={type}>
            <label className="block text-sm text-slate-400 mb-1 capitalize">{type}</label>
            <input
              value={links[type] || ''}
              onChange={(e) => setLinks({ ...links, [type]: e.target.value })}
              placeholder={type === 'email' ? 'mailto:email@example.com' : 'https://...'}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
            />
          </div>
        ))}
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

export default LinksAdmin;
