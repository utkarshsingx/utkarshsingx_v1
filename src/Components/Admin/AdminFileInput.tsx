import React from 'react';

interface AdminFileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  accept?: string;
  onFileChange?: (file: File | null) => void;
}

const AdminFileInput: React.FC<AdminFileInputProps> = ({
  label = 'Choose file',
  accept,
  onFileChange,
  className = '',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileChange?.(file);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-400">{label}</label>
      )}
      <div className="flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 min-h-[48px] sm:min-h-0 transition-all duration-200 ease-out hover:border-slate-500 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className={`block w-full text-base sm:text-sm text-lightest_slate file:mr-4 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-primary file:cursor-pointer file:hover:bg-primary/30 file:transition-colors cursor-pointer touch-manipulation ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default AdminFileInput;
