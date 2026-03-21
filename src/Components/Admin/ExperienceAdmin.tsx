import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ExperienceRow } from '../../hooks/usePortfolioData';
import { FiTrash2 } from 'react-icons/fi';
import AdminAddButton from './AdminAddButton';
import AdminSaveButton from './AdminSaveButton';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminInput from './AdminInput';
import AdminTextarea from './AdminTextarea';
import Heading from '../../ui/Heading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ExperienceAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [items, setItems] = useState<ExperienceRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [previewSelectedId, setPreviewSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    j_no: 0,
    name: '',
    position: '',
    time_period: '',
    description: ''
  });

  useEffect(() => {
    setItems(data.experience);
  }, [data.experience]);

  const startEdit = (item: ExperienceRow) => {
    setEditing(item.id);
    setForm({
      j_no: item.j_no,
      name: item.name,
      position: item.position,
      time_period: item.time_period,
      description: item.description.join('\n')
    });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    const desc = form.description.split('\n').filter(Boolean);
    const { error } = await supabase
      .from('experience')
      .update({
        j_no: form.j_no,
        name: form.name,
        position: form.position,
        time_period: form.time_period,
        description: desc
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
    if (!confirm('Delete this experience?')) return;
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    await refetch();
    setEditing(null);
  };

  const addNew = async () => {
    const maxJ = items.length ? Math.max(...items.map((i) => i.j_no)) : 0;
    const { error } = await supabase.from('experience').insert({
      j_no: maxJ + 1,
      name: 'New Company',
      position: 'Position',
      time_period: 'Period',
      description: ['Description line 1'],
      sort_order: 0
    });
    if (error) {
      alert(error.message);
      return;
    }
    await refetch();
  };

  const displayItems = editing ? items.map((i) => (i.id === editing ? { ...i, ...form, description: form.description.split('\n').filter(Boolean) } : i)) : items;
  const editingJob = editing ? { ...items.find((i) => i.id === editing)!, ...form, description: form.description.split('\n').filter(Boolean) } : null;
  const displayJob = editingJob || displayItems.find((i) => i.id === (previewSelectedId ?? displayItems[0]?.id)) || displayItems[0];

  if (loading) return <AdminLoading />;
  if (error) return <div className="text-red-400">Failed to load: {error}</div>;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full items-center px-1 sm:px-0">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <div className="min-h-[2rem] flex items-center">
          <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
            Experience
          </GlitchText>
        </div>
        <AdminAddButton onClick={addNew} label="Add" />
        </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 sm:p-4"
          >
            {editing === item.id ? (
              <div className="space-y-3">
                <AdminInput
                  label="Job number"
                  value={form.j_no}
                  onChange={(e) => setForm({ ...form, j_no: parseInt(e.target.value, 10) || 0 })}
                  placeholder="j_no"
                  type="number"
                />
                <AdminInput
                  label="Company name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Company name"
                />
                <AdminInput
                  label="Position"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Position"
                />
                <AdminInput
                  label="Time period"
                  value={form.time_period}
                  onChange={(e) => setForm({ ...form, time_period: e.target.value })}
                  placeholder="Time period"
                />
                <AdminTextarea
                  label="Description (one per line)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description (one per line)"
                  rows={4}
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
                  <span className="font-medium text-lightest_slate">{item.position}</span>
                  <span className="text-primary"> @ {item.name}</span>
                  <div className="text-sm text-slate-400">{item.time_period}</div>
                </div>
                <span className="text-slate-500">Edit</span>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
      <AdminPreview title="Public view">
        {displayItems.length > 0 ? (
          <div className="mt-4" id="experience">
            <Heading index="02" title={"Where I've Worked"} />
            <div className="flex mt-4 flex-col md:flex-row gap-6">
              <div className="flex flex-row md:flex-col overflow-x-auto pb-2 gap-0 md:gap-0">
                {displayItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreviewSelectedId(item.id)}
                    className={`font-mono py-2 px-3 shrink-0 md:shrink-auto md:border-l-4 border-b-4 md:border-b-0 text-sm text-left bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset cursor-pointer hover:bg-lightest_navy/20 transition-colors ${
                      displayJob?.id === item.id ? 'text-primary border-primary' : 'text-lightest_slate border-lightest_navy'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              {displayJob && (
                <div className="max-w-[400px] w-full">
                  <div className="text-off_white font-[600] text-lg">
                    {displayJob.position}
                    <span className="text-primary"> @ {displayJob.name}</span>
                  </div>
                  <div className="text-lightest_slate text-sm mb-4">{displayJob.time_period}</div>
                  <div>
                    {displayJob.description?.map((line, idx) => (
                      <div key={idx} className="flex text-sm">
                        <div className="text-primary">&#9656;</div>
                        <span className="text-lightest_slate ml-1">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic">Add experience entries to see preview</p>
        )}
      </AdminPreview>
    </div>
  );
};

export default ExperienceAdmin;
