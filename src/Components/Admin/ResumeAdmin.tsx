import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminFileInput from './AdminFileInput';
import Button from '../../ui/Button';
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
    <div className="flex flex-col gap-6 sm:gap-8 w-full items-center px-1 sm:px-0">
      <div className="w-full max-w-xl">
        <div className="min-h-[2rem] flex items-center justify-center mb-4">
        <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
          Resume
        </GlitchText>
      </div>
      <div className="space-y-4">
        {currentUrl && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-400">Current resume</label>
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline inline-block"
            >
              {currentName || 'View resume'}
            </a>
          </div>
        )}
        <AdminFileInput
          label="Upload new resume"
          accept=".pdf,.doc,.docx"
          onFileChange={setFile}
        />
        <button
          onClick={upload}
          disabled={uploading || !file}
          className="px-6 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        </div>
      </div>
      <AdminPreview title="Public view (resume link)">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-400 text-sm">Resume appears in the About Me section and as a CTA button.</p>
          {currentUrl ? (
            <a href={currentUrl} target="_blank" rel="noreferrer">
              <Button title={currentName || 'Resume'} />
            </a>
          ) : (
            <p className="text-slate-500 italic">Upload a resume to see preview</p>
          )}
        </div>
      </AdminPreview>
    </div>
  );
};

export default ResumeAdmin;
