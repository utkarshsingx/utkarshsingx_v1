import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiBriefcase, FiFolder, FiMail, FiLink, FiFileText, FiImage, FiGrid } from 'react-icons/fi';
import GlitchText from '../GlitchText';
import ShinyText from '../ShinyText';
import Shuffle from '../Shuffle';
import FallingText from '../FallingText';

const adminSections = [
  { to: '/admin/about', icon: FiUser, label: 'About Me', desc: 'Edit bio and tech stack' },
  { to: '/admin/experience', icon: FiBriefcase, label: 'Experience', desc: 'Manage work history' },
  { to: '/admin/projects', icon: FiFolder, label: 'Projects', desc: 'Manage projects' },
  { to: '/admin/contact', icon: FiMail, label: 'Contact', desc: 'Edit contact section' },
  { to: '/admin/links', icon: FiLink, label: 'Links', desc: 'Social and email links' },
  { to: '/admin/resume', icon: FiFileText, label: 'Resume', desc: 'Upload resume' },
  { to: '/admin/profile', icon: FiImage, label: 'Profile Pic', desc: 'Upload profile image' },
  { to: '/admin/sections', icon: FiGrid, label: 'Sections', desc: 'Show/hide sections' }
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="h-12 mb-6">
        <FallingText
          text="Welcome back"
          highlightWords={['Welcome']}
          trigger="auto"
          fontSize="1.25rem"
          gravity={0.5}
        />
      </div>
      <div className="min-h-[3rem] flex items-center overflow-visible mb-2">
        <GlitchText speed={1} enableShadows enableOnHover={false} className="text-off_white text-2xl sm:text-3xl md:text-4xl">
          Admin Dashboard
        </GlitchText>
      </div>
      <div className="mb-8">
        <ShinyText
          text="Manage your portfolio content."
          className="text-slate-400"
          color="#64748b"
          shineColor="#64ffda"
          speed={2.5}
          spread={100}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl px-1 sm:px-0">
        {adminSections.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-start gap-3 sm:gap-4 p-4 sm:p-4 min-h-[72px] sm:min-h-0 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:border-primary/50 hover:bg-slate-800/50 active:bg-slate-800/50 transition-colors group touch-manipulation"
          >
            <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
              <Icon size={24} />
            </div>
            <div className="min-w-0">
              <h2 className="font-medium text-lightest_slate mb-1">
                <Shuffle
                  text={label}
                  tag="span"
                  className="font-medium text-lightest_slate"
                  shuffleDirection="right"
                  duration={0.3}
                  triggerOnMount
                  triggerOnHover
                  triggerOnce={false}
                  respectReducedMotion
                />
              </h2>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
