import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ContactRow } from '../../hooks/usePortfolioData';
import GlitchText from '../GlitchText';
import AdminSaveButton from './AdminSaveButton';
import AdminLoading from './AdminLoading';
import AdminPreview from './AdminPreview';
import AdminInput from './AdminInput';
import AdminTextarea from './AdminTextarea';
import Button from '../../ui/Button';
import { usePortfolioDataContext } from '../../context/PortfolioDataContext';

const ContactAdmin: React.FC = () => {
  const { data, loading, error, refetch } = usePortfolioDataContext();
  const [sectionTitle, setSectionTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    const row = data.contact;
    if (row) {
      setRowId(row.id);
      setSectionTitle(row.section_title);
      setBodyText(row.body_text);
      setCtaLabel(row.cta_label);
      setCtaUrl(row.cta_url);
    } else {
      setRowId(null);
      setSectionTitle('');
      setBodyText('');
      setCtaLabel('');
      setCtaUrl('');
    }
  }, [data.contact]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { section_title: sectionTitle, body_text: bodyText, cta_label: ctaLabel, cta_url: ctaUrl };
      if (rowId) {
        const { error } = await supabase.from('contact').update(payload).eq('id', rowId).select().single();
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('contact').insert(payload).select('id').single();
        if (error) throw error;
        setRowId((data as { id: string }).id);
      }
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
    <div className="flex flex-col gap-6 sm:gap-8 w-full items-center px-1 sm:px-0">
      <div className="w-full max-w-xl">
        <div className="min-h-[2rem] flex items-center justify-center mb-4">
          <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
            Contact
          </GlitchText>
        </div>
        <div className="space-y-4">
        <AdminInput
          label="Section title"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
        <AdminTextarea
          label="Body text"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={4}
        />
        <AdminInput
          label="CTA label"
          value={ctaLabel}
          onChange={(e) => setCtaLabel(e.target.value)}
        />
        <AdminInput
          label="CTA URL"
          value={ctaUrl}
          onChange={(e) => setCtaUrl(e.target.value)}
        />
        <AdminSaveButton onClick={save} saving={saving} />
        </div>
      </div>
      <AdminPreview title="Public view (footer section)">
        <div className="text-center max-w-[540px] mx-auto flex flex-col items-center">
          <div className="text-primary text-lg font-mono mb-2">05. What&apos;s Next?</div>
          <div className="min-h-[2rem] flex items-center justify-center mb-2">
            <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-lg">
              {sectionTitle || 'Section title'}
            </GlitchText>
          </div>
          <div className="text-lightest_slate text-sm my-3 mb-6">
            {bodyText || 'Body text will appear here...'}
          </div>
          {ctaLabel && (
            <a href={ctaUrl || '#'} target="_blank" rel="noreferrer">
              <Button title={ctaLabel} />
            </a>
          )}
        </div>
      </AdminPreview>
    </div>
  );
};

export default ContactAdmin;
