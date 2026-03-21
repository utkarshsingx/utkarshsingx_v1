import React from 'react';
import { motion } from 'motion/react';
import { FiPlus } from 'react-icons/fi';

interface AdminAddButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const AdminAddButton: React.FC<AdminAddButtonProps> = ({ onClick, label = 'Add', className = '' }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 touch-manipulation ${className}`}
    >
      {/* Shimmer overlay on hover - React Bits style */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      <FiPlus size={18} className="shrink-0" strokeWidth={2.5} />
      <span>{label}</span>
    </motion.button>
  );
};

export default AdminAddButton;
