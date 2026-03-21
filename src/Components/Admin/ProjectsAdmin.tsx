import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import type { ProjectRow } from '../../hooks/usePortfolioData';
import { FiTrash2, FiGithub, FiLink } from 'react-icons/fi';
import AdminAddButton from './AdminAddButton';
import AdminSaveButton from './AdminSaveButton';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminInput from './AdminInput';
import AdminTextarea from './AdminTextarea';
import AdminFileInput from './AdminFileInput';
import Heading from '../../ui/Heading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ProjectsAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    img: '',
    tech_used: '',
    git_link: '',
    link: ''
  });
  const [imgFile, setImgFile] = useState<File | null>(null);

  useEffect(() => {
    setItems(data.projects);
  }, [data.projects]);

  const startEdit = (item: ProjectRow) => {
    setEditing(item.id);
    setForm({
      name: item.name,
      description: item.description,
      img: item.img,
      tech_used: item.tech_used.join(', '),
      git_link: item.git_link || '',
      link: item.link
    });
    setImgFile(null);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    let imgUrl = form.img;
    if (imgFile) {
      const ext = imgFile.name.split('.').pop() || 'png';
      const path = `projects/project-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('portfolio-assets')
        .upload(path, imgFile, { upsert: true });
      if (uploadErr) {
        alert(uploadErr.message);
        return;
      }
      const { data: urlData } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
      imgUrl = urlData.publicUrl;
    }
    const techUsed = form.tech_used.split(',').map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase
      .from('projects')
      .update({
        name: form.name,
        description: form.description,
        img: imgUrl,
        tech_used: techUsed,
        git_link: form.git_link || null,
        link: form.link
      })
      .eq('id', editing)
      .select()
      .single();
    if (error) {
      alert(error.message);
      return;
    }
    await refetch();
    setEditing(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    await refetch();
    setEditing(null);
  };

  const addNew = async () => {
    const { error } = await supabase.from('projects').insert({
      name: 'New Project',
      description: 'Description',
      img: '/images/placeholder.png',
      tech_used: [],
      git_link: null,
      link: '#',
      sort_order: items.length
    });
    if (error) {
      alert(error.message);
      return;
    }
    await refetch();
  };

  const imgPreviewUrl = useMemo(() => (imgFile ? URL.createObjectURL(imgFile) : null), [imgFile]);
  useEffect(() => () => imgPreviewUrl && URL.revokeObjectURL(imgPreviewUrl), [imgPreviewUrl]);
  const previewProjects = editing
    ? items.map((i) =>
        i.id === editing
          ? {
              ...i,
              name: form.name,
              description: form.description,
              img: imgPreviewUrl || form.img,
              tech_used: form.tech_used.split(',').map((t) => t.trim()).filter(Boolean),
              git_link: form.git_link || null,
              link: form.link
            }
          : i
      )
    : items;

  if (loading) return <AdminLoading />;
  if (error) return <div className="text-red-400">Failed to load: {error}</div>;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full items-center px-1 sm:px-0">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <div className="min-h-[2rem] flex items-center">
          <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
            Projects
          </GlitchText>
        </div>
        <AdminAddButton onClick={addNew} label="Add" />
        </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4"
          >
            {editing === item.id ? (
              <div className="space-y-3">
                <AdminInput
                  label="Project name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Project name"
                />
                <AdminTextarea
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                />
                <AdminInput
                  label="Image URL"
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="Image URL"
                />
                <AdminFileInput
                  label="Or upload image"
                  accept="image/*"
                  onFileChange={setImgFile}
                />
                <AdminInput
                  label="Tech used (comma separated)"
                  value={form.tech_used}
                  onChange={(e) => setForm({ ...form, tech_used: e.target.value })}
                  placeholder="React, Node, etc."
                />
                <AdminInput
                  label="GitHub link"
                  value={form.git_link}
                  onChange={(e) => setForm({ ...form, git_link: e.target.value })}
                  placeholder="https://github.com/..."
                />
                <AdminInput
                  label="Project link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                />
                <div className="flex gap-2 flex-wrap">
                  <AdminSaveButton onClick={saveEdit} />
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-lg border border-slate-600 text-lightest_slate hover:bg-slate-700/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => startEdit(item)}
              >
                <div>
                  <span className="font-medium text-lightest_slate">{item.name}</span>
                  <div className="text-sm text-slate-400 truncate max-w-md">{item.link}</div>
                </div>
                <span className="text-slate-500">Edit</span>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
      <AdminPreview title="Public view">
        {previewProjects.length > 0 ? (
          <div className="my-8">
            <Heading index="04" title={"Some Things I've Built"} />
            <div className="space-y-6 mt-6">
              {previewProjects.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 ${idx % 2 !== 0 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-32 h-24 shrink-0 rounded overflow-hidden bg-slate-700">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`flex-1 min-w-0 ${idx % 2 !== 0 ? 'text-right' : ''}`}>
                    <div className="font-bold text-off_white text-lg">{item.name}</div>
                    <div className="text-lightest_slate text-sm mt-1 line-clamp-2">{item.description}</div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {item.tech_used.map((t, i) => (
                        <span key={i} className="font-mono text-xs text-lightest_slate">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {item.git_link && <FiGithub size={16} className="text-primary" />}
                      <FiLink size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic">Add projects to see preview</p>
        )}
      </AdminPreview>
    </div>
  );
};

export default ProjectsAdmin;
