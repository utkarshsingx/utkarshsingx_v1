import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ProjectRow } from '../../hooks/usePortfolioData';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
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
      .eq('id', editing);
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

  if (loading) return <AdminLoading />;
  if (error) return <div className="text-red-400">Failed to load: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="min-h-[2rem] flex items-center">
          <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-xl sm:text-2xl">
            Projects
          </GlitchText>
        </div>
        <button
          onClick={addNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
        >
          <FiPlus size={18} />
          Add
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4"
          >
            {editing === item.id ? (
              <div className="space-y-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Project name"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Image URL or upload</label>
                  <input
                    value={form.img}
                    onChange={(e) => setForm({ ...form, img: e.target.value })}
                    placeholder="Image URL"
                    className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2 mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImgFile(e.target.files?.[0] || null)}
                    className="text-lightest_slate text-sm"
                  />
                </div>
                <input
                  value={form.tech_used}
                  onChange={(e) => setForm({ ...form, tech_used: e.target.value })}
                  placeholder="Tech used (comma separated)"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <input
                  value={form.git_link}
                  onChange={(e) => setForm({ ...form, git_link: e.target.value })}
                  placeholder="GitHub link"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="Project link"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                  >
                    Save
                  </button>
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
  );
};

export default ProjectsAdmin;
