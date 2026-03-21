import React from 'react';

interface AdminPreviewProps {
  title?: string;
  children: React.ReactNode;
}

const AdminPreview: React.FC<AdminPreviewProps> = ({ title = 'Preview', children }) => {
  return (
    <div className="rounded-xl border border-slate-600/50 bg-slate-900/30 overflow-hidden w-full max-w-xl">
      <div className="px-4 sm:px-4 py-2.5 sm:py-2 border-b border-slate-700/50 bg-slate-800/30 text-center">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-4 sm:p-6 min-h-[140px] sm:min-h-[200px] overflow-auto max-h-[45vh] sm:max-h-[70vh]">
        {children}
      </div>
    </div>
  );
};

export default AdminPreview;
