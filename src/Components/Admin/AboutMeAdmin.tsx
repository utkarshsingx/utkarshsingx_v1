import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import GlitchText from '../GlitchText';
import AdminAddButton from './AdminAddButton';
import AdminSaveButton from './AdminSaveButton';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminInput from './AdminInput';
import AdminTextarea from './AdminTextarea';
import AdminFileInput from './AdminFileInput';
import Heading from '../../ui/Heading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const AboutMeAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [content, setContent] = useState('');
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
        const { error } = await supabase.from('about_me').update(payload).eq('id', rowId).select().single();
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from('about_me')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        setRowId((inserted as { id: string }).id);
      }
      setProfileFile(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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

  const filePreviewUrl = useMemo(() => (profileFile ? URL.createObjectURL(profileFile) : null), [profileFile]);
  const profileSrc = data.aboutMe?.profile_image_url || filePreviewUrl;
  useEffect(() => () => filePreviewUrl && URL.revokeObjectURL(filePreviewUrl), [filePreviewUrl]);
  const paragraphs = content.split('\n\n').filter(Boolean);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full items-center px-1 sm:px-0">
      <div className="w-full max-w-xl">
        <div className="min-h-[2rem] flex items-center justify-center mb-4">
          <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
            About Me
          </GlitchText>
        </div>
        <div className="space-y-4 flex flex-col items-center w-full">
        <AdminTextarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
        />
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Tech list</label>
          <div className="flex flex-wrap gap-2 mb-2 justify-center">
            <AdminInput
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              placeholder="Add tech"
              className="flex-1 min-w-[140px]"
            />
            <AdminAddButton onClick={addTech} label="Add" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
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
        <AdminFileInput
          label="Profile image"
          accept="image/*"
          onFileChange={setProfileFile}
        />
        <AdminSaveButton onClick={save} saving={saving} success={saveSuccess} />
        </div>
      </div>
      <AdminPreview title="Public view">
        <div className="text-lightest_slate text-base sm:text-lg">
          <Heading index="01" title="About Me" />
          <div className="flex mt-6 flex-col lg:flex-row gap-8 items-start">
            <div className="max-w-[400px] w-full">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} className={i > 0 ? 'mt-4' : ''}>
                    {p.split('\n').map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        {j < p.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                ))
              ) : (
                <p className="text-slate-500 italic">Add content to see preview</p>
              )}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono mt-4">
                {techList.map((tech, i) => (
                  <li key={i}>
                    <span className="text-primary">&#9656;</span> {tech}
                  </li>
                ))}
              </ul>
            </div>
            {profileSrc && (
              <div className="shrink-0">
                <img
                  src={profileSrc}
                  alt="Profile"
                  className="w-[192px] h-[240px] object-cover border-2 border-primary"
                />
              </div>
            )}
          </div>
        </div>
      </AdminPreview>
    </div>
  );
};

export default AboutMeAdmin;
