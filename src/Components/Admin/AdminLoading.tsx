import React from 'react';
import DecryptedText from '../DecryptedText';

const AdminLoading: React.FC = () => (
  <div className="min-h-[200px] flex items-center justify-center text-lightest_slate">
    <DecryptedText
      text="Loading..."
      animateOn="view"
      sequential
      speed={80}
      className="text-lightest_slate"
    />
  </div>
);

export default AdminLoading;
