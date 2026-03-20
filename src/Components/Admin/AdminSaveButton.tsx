import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiCheck, FiLoader, FiSave } from 'react-icons/fi';

interface AdminSaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  saving?: boolean;
  success?: boolean;
  label?: string;
  savingLabel?: string;
  successLabel?: string;
  className?: string;
}

const AdminSaveButton: React.FC<AdminSaveButtonProps> = ({
  onClick,
  disabled = false,
  saving = false,
  success = false,
  label = 'Save',
  savingLabel = 'Saving...',
  successLabel = 'Saved!',
  className = ''
}) => {
  const isDisabled = disabled || saving;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-primary/40 bg-primary/10 px-5 py-2.5 font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${
        success ? 'border-green-500/60 bg-green-500/20 text-green-400' : ''
      } ${className}`}
    >
      {/* Shimmer overlay on hover */}
      {!success && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      )}
      <AnimatePresence mode="wait">
        {saving ? (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <FiLoader size={18} className="shrink-0 animate-spin" strokeWidth={2.5} />
            <span>{savingLabel}</span>
          </motion.span>
        ) : success ? (
          <motion.span
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <FiCheck size={18} className="shrink-0" strokeWidth={2.5} />
            <span>{successLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <FiSave size={18} className="shrink-0 opacity-80" strokeWidth={2.5} />
            <span>{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AdminSaveButton;
