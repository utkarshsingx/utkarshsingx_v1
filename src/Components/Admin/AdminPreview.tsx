import React from 'react';

interface AdminPreviewProps {
  title?: string;
  children: React.ReactNode;
}

const AdminPreview: React.FC<AdminPreviewProps> = ({ title = 'Preview', children }) => {
  return (
    <div className="rounded-xl border border-slate-600/50 bg-slate-900/30 overflow-hidden w-full max-w-xl">
      <div className="px-3 sm:px-4 py-2 border-b border-slate-700/50 bg-slate-800/30 text-center">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-3 sm:p-6 min-h-[160px] sm:min-h-[200px] overflow-auto max-h-[50vh] sm:max-h-[70vh]">
        {children}
      </div>
    </div>
  );
};

export default AdminPreview;
