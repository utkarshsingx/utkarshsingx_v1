import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { AboutMeRow } from '../../hooks/usePortfolioData';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const AboutMeAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [content, setContent] = useState('');
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    const row = data.aboutMe;
    if (row) {
      setRowId(row.id);
      setContent(row.content);
      setTechList(Array.isArray(row.tech_list) ? row.tech_list : []);
    } else {
      setRowId(null);
      setContent('');
      setTechList([]);
    }
  }, [data.aboutMe]);

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techList.includes(t)) {
      setTechList([...techList, t]);
      setTechInput('');
    }
  };

  const removeTech = (i: number) => {
    setTechList(techList.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    setSaving(true);
    try {
      let profileUrl: string | null = null;
      if (profileFile) {
        const ext = profileFile.name.split('.').pop() || 'png';
        const path = `profile/profile-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('portfolio-assets')
          .upload(path, profileFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
        profileUrl = urlData.publicUrl;
      }

      const payload: { content: string; tech_list: string[]; profile_image_url?: string } = {
        content,
        tech_list: techList
      };
      if (profileUrl !== null) payload.profile_image_url = profileUrl;

      if (rowId) {
        const { error } = await supabase.from('about_me').update(payload).eq('id', rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('about_me').insert(payload).select('id').single();
        if (error) throw error;
        setRowId((data as { id: string }).id);
      }
      setProfileFile(null);
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
          About Me
        </GlitchText>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate p-3 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Tech list</label>
          <div className="flex gap-2 mb-2">
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              placeholder="Add tech"
              className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {techList.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-700 text-lightest_slate text-sm"
              >
                {t}
                <button type="button" onClick={() => removeTech(i)} className="text-red-400 hover:text-red-300">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Profile image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
            className="text-lightest_slate"
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

export default AboutMeAdmin;
