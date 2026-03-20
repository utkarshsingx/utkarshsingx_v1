import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ResumeAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const currentUrl = data.resume?.file_url ?? null;
  const currentName = data.resume?.file_name ?? null;

  const upload = async () => {
    if (!file) {
      alert('Select a file first');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'pdf';
      const path = `resume/resume-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('portfolio-assets')
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { data: existing } = await supabase.from('resume').select('id').limit(1).maybeSingle();
      if (existing) {
        await supabase
          .from('resume')
          .update({ file_url: publicUrl, file_name: file.name })
          .eq('id', (existing as { id: string }).id);
      } else {
        await supabase.from('resume').insert({ file_url: publicUrl, file_name: file.name });
      }
      setFile(null);
      await refetch();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <AdminLoading />;
  if (error) return <div className="text-red-400">Failed to load: {error}</div>;

  return (
    <div className="max-w-2xl">
      <div className="min-h-[2rem] flex items-center mb-4">
        <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-xl sm:text-2xl">
          Resume
        </GlitchText>
      </div>
      <div className="space-y-4">
        {currentUrl && (
          <div>
            <label className="block text-sm text-slate-400 mb-1">Current resume</label>
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              {currentName || 'View resume'}
            </a>
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-400 mb-1">Upload new resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-lightest_slate"
          />
        </div>
        <button
          onClick={upload}
          disabled={uploading || !file}
          className="px-6 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default ResumeAdmin;
