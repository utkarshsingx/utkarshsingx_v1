import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ExperienceRow } from '../../hooks/usePortfolioData';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import GlitchText from '../GlitchText';
import AdminLoading from './AdminLoading';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ExperienceAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [items, setItems] = useState<ExperienceRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
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
      .eq('id', editing);
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

  if (loading) return <AdminLoading />;
  if (error) return <div className="text-red-400">Failed to load: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="min-h-[2rem] flex items-center">
          <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-xl sm:text-2xl">
            Experience
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
                  value={form.j_no}
                  onChange={(e) => setForm({ ...form, j_no: parseInt(e.target.value, 10) || 0 })}
                  placeholder="j_no"
                  type="number"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Company name"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Position"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <input
                  value={form.time_period}
                  onChange={(e) => setForm({ ...form, time_period: e.target.value })}
                  placeholder="Time period"
                  className="w-full rounded border border-slate-600 bg-slate-800/50 text-lightest_slate px-3 py-2"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description (one per line)"
                  rows={4}
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
  );
};

export default ExperienceAdmin;
