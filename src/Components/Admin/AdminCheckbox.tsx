import React from 'react';

interface AdminCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  label,
  description,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `admin-checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <label
      htmlFor={inputId}
      className="flex items-center gap-3 cursor-pointer group min-h-[44px] sm:min-h-0 py-2 sm:py-0 -my-2 sm:my-0"
    >
      <input
        type="checkbox"
        id={inputId}
        className={`
          h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-600 bg-slate-800/50 text-primary shrink-0
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 focus:ring-offset-transparent
          transition-colors cursor-pointer
          ${className}
        `}
        {...props}
      />
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-lightest_slate group-hover:text-primary transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};

export default AdminCheckbox;
