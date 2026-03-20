import React, { forwardRef } from 'react';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || `admin-textarea-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full space-y-1.5 group">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-400 transition-colors group-focus-within:text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-lightest_slate font-mono text-sm
            placeholder:text-slate-500
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            hover:border-slate-500
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[80px]
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';

export default AdminTextarea;
