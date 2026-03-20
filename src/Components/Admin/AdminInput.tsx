import React, { forwardRef } from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || `admin-input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="space-y-1.5 group">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-400 transition-colors group-focus-within:text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-lightest_slate
            placeholder:text-slate-500
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            hover:border-slate-500
            disabled:opacity-50 disabled:cursor-not-allowed
            file:mr-4 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary file:cursor-pointer
            file:hover:bg-primary/30
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

AdminInput.displayName = 'AdminInput';

export default AdminInput;
