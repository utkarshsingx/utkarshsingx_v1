import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import type { SiteSectionRow } from '../../hooks/usePortfolioData';
import GlitchText from '../GlitchText';
import AdminSaveButton from './AdminSaveButton';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminCheckbox from './AdminCheckbox';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const DEFAULT_SECTIONS = [
  { key: 'about', enabled: true, sort_order: 0 },
  { key: 'experience', enabled: true, sort_order: 1 },
  { key: 'contributions', enabled: true, sort_order: 2 },
  { key: 'projects', enabled: true, sort_order: 3 },
  { key: 'contact', enabled: true, sort_order: 4 }
];

const SectionsAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [sections, setSections] = useState<SiteSectionRow[]>([]);
  const [initialSections, setInitialSections] = useState<Map<string, { enabled: boolean; sortOrder: number }>>(new Map());
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = data?.siteSections ?? [];
    if (loaded.length > 0) {
      const sorted = [...loaded].sort((a, b) => a.sort_order - b.sort_order);
      setSections(sorted);
      setInitialSections(new Map(sorted.map((s) => [s.id, { enabled: s.enabled, sortOrder: s.sort_order }])));
    }
  }, [data.siteSections]);

  useEffect(() => {
    if (loading || error) return;
    const siteSections = data?.siteSections ?? [];
    if (siteSections.length === 0) {
      (async () => {
        const { data: inserted, error: insertErr } = await supabase
          .from('site_sections')
          .insert(DEFAULT_SECTIONS)
          .select('*');
        if (!insertErr && inserted) {
          await refetch();
        }
      })();
    }
  }, [loading, error, data?.siteSections?.length, refetch]);

  const toggle = (id: string, enabled: boolean) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    setSaveSuccess(false);
  };

  const reorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setSections((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, removed);
      return copy.map((s, i) => ({ ...s, sort_order: i }));
    });
    setSaveSuccess(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'section', id }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDraggedId(null);
    const id = e.dataTransfer.getData('text/plain');
    const fromIndex = sections.findIndex((s) => s.id === id);
    if (fromIndex === -1) return;
    reorder(fromIndex, targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const hasChanges = () => {
    const enabledChanged = sections.some((s) => initialSections.get(s.id)?.enabled !== s.enabled);
    const orderChanged = sections.some((s, i) => initialSections.get(s.id)?.sortOrder !== i);
    return enabledChanged || orderChanged;
  };

  const save = async () => {
    if (!hasChanges()) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    try {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        const initial = initialSections.get(s.id);
        const needsUpdate = initial?.enabled !== s.enabled || initial?.sortOrder !== i;
        if (needsUpdate) {
          const { error } = await supabase
            .from('site_sections')
            .update({ enabled: s.enabled, sort_order: i })
            .eq('id', s.id)
            .select()
            .single();
          if (error) throw error;
        }
      }
      setInitialSections(new Map(sections.map((s, i) => [s.id, { enabled: s.enabled, sortOrder: i }])));
      await refetch();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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
          Sections
        </GlitchText>
      </div>
      <p className="text-slate-400 text-sm mb-6">Drag to reorder, toggle to show/hide. Click Save to apply changes.</p>
      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-primary/20 text-primary text-sm flex items-center justify-between">
          <span>Saved! Changes will reflect on the homepage.</span>
          <Link to="/" className="underline hover:no-underline">View homepage</Link>
        </div>
      )}
      <div className="space-y-3">
        {[...sections]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((s, index) => (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, s.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 min-h-[52px] sm:min-h-0 transition-all cursor-grab active:cursor-grabbing select-none touch-manipulation ${
                draggedId === s.id
                  ? 'border-primary/60 bg-primary/10 opacity-80'
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
              }`}
            >
              <div
                className="touch-none flex-shrink-0 text-slate-500 hover:text-lightest_slate transition-colors"
                aria-label="Drag to reorder"
              >
                <FiMoreVertical size={18} />
              </div>
              <span className="flex-1 text-lightest_slate capitalize font-medium">{s.key}</span>
              <AdminCheckbox
                checked={s.enabled}
                onChange={(e) => toggle(s.id, e.target.checked)}
                label={s.enabled ? 'Visible' : 'Hidden'}
              />
            </div>
          ))}
      </div>
      <AdminSaveButton onClick={save} saving={saving} success={saveSuccess} className="mt-6" />
      </div>
      <AdminPreview title="Homepage layout">
        <div className="space-y-2">
          <p className="text-slate-400 text-sm mb-4">Sections on the homepage (order no. is dynamic—hidden sections are skipped):</p>
          {sections.length > 0 ? (
            <div className="flex flex-col gap-2">
              {[...sections]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((s) => {
                  const enabledBefore = sections
                    .filter((x) => x.sort_order < s.sort_order)
                    .filter((x) => x.enabled).length;
                  const orderNo = s.enabled ? String(enabledBefore + 1).padStart(2, '0') : '—';
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between px-3 py-2 rounded ${
                        s.enabled ? 'bg-primary/10 border border-primary/30' : 'bg-slate-800/50 border border-slate-700/50 opacity-60'
                      }`}
                    >
                      <span className="capitalize text-lightest_slate">
                        {s.enabled && <span className="font-mono text-primary mr-2">{orderNo}.</span>}
                        {s.key}
                      </span>
                      <span className={`text-xs ${s.enabled ? 'text-primary' : 'text-slate-500'}`}>
                        {s.enabled ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-slate-500 italic">No sections configured</p>
          )}
        </div>
      </AdminPreview>
    </div>
  );
};

export default SectionsAdmin;
