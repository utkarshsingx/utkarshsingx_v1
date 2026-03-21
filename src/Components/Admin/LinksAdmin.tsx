import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import GlitchText from '../GlitchText';
import AdminSaveButton from './AdminSaveButton';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminInput from './AdminInput';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const LINK_TYPES = ['github', 'twitter', 'linkedin', 'email'] as const;
const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FiGithub,
  twitter: FaXTwitter,
  linkedin: FiLinkedin,
  email: FiMail
};

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
          const { error } = await supabase.from('links').update({ url }).eq('id', (existing as { id: string }).id).select().single();
          if (error) throw error;
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
    <div className="flex flex-col gap-6 sm:gap-8 w-full items-center px-1 sm:px-0">
      <div className="w-full max-w-xl">
        <div className="min-h-[2rem] flex items-center justify-center mb-4">
        <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
          Links
        </GlitchText>
      </div>
      <div className="space-y-4">
        {LINK_TYPES.map((type) => (
          <AdminInput
            key={type}
            label={type}
            value={links[type] || ''}
            onChange={(e) => setLinks({ ...links, [type]: e.target.value })}
            placeholder={type === 'email' ? 'mailto:email@example.com' : 'https://...'}
          />
        ))}
        <AdminSaveButton onClick={save} saving={saving} />
        </div>
      </div>
      <AdminPreview title="Public view (footer icons)">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-400 text-sm">Links appear in the footer next to &quot;Built by...&quot;</p>
          <div className="flex gap-6 text-2xl">
            {LINK_TYPES.filter((t) => t !== 'email').map((type) => {
              const Icon = LINK_ICONS[type];
              const url = links[type] || '';
              return (
                <div key={type} className="flex flex-col items-center gap-1">
                  {url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                      <Icon className="text-lightest_slate hover:text-primary cursor-pointer" />
                    </a>
                  ) : (
                    <Icon className="text-slate-600" />
                  )}
                  <span className="text-xs text-slate-500 capitalize">{type}</span>
                </div>
              );
            })}
          </div>
          {links.email && (
            <a href={links.email} className="text-primary text-sm hover:underline">
              {links.email}
            </a>
          )}
        </div>
      </AdminPreview>
    </div>
  );
};

export default LinksAdmin;
