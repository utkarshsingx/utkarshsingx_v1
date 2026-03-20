import React from 'react';
import GlitchLoadingText from '../GlitchLoadingText';

const AdminLoading: React.FC = () => (
  <div className="min-h-[200px] flex items-center justify-center text-lightest_slate">
    <GlitchLoadingText className="text-lightest_slate font-mono text-lg" />
  </div>
);

export default AdminLoading;
