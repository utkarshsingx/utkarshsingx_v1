import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminFileInput from './AdminFileInput';
import Heading from '../../ui/Heading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ProfileAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const currentUrl = data.aboutMe?.profile_image_url ?? null;

  const upload = async () => {
    if (!file) {
      alert('Select an image first');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `profile/profile-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('portfolio-assets')
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { data: existing } = await supabase
        .from('about_me')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existing) {
        await supabase
          .from('about_me')
          .update({ profile_image_url: publicUrl })
          .eq('id', (existing as { id: string }).id);
      } else {
        await supabase.from('about_me').insert({
          content: '',
          tech_list: [],
          profile_image_url: publicUrl
        });
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
          Profile Picture
        </GlitchText>
      </div>
      <div className="space-y-4">
        {currentUrl && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-400">Current profile image</label>
            <img
              src={currentUrl}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-lg border border-slate-600"
            />
          </div>
        )}
        <AdminFileInput
          label="Upload new image"
          accept="image/*"
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
      <AdminPreview title="Public view (About Me section)">
        <div>
          <Heading index="01" title="About Me" />
          <div className="mt-6 flex justify-center">
            {currentUrl ? (
              <img
                src={currentUrl}
                alt="Profile"
                className="w-[192px] h-[240px] object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-[192px] h-[240px] border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-sm">
                Upload image to see preview
              </div>
            )}
          </div>
        </div>
      </AdminPreview>
    </div>
  );
};

export default ProfileAdmin;
