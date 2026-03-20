import React, { Suspense, useMemo } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Navbar from '../Navbar';
import LeftSidebar from '../LeftSidebar';
import RightSidebar from '../RightSidebar';
import ShinyText from '../ShinyText';
import WaveBackground from '../WaveBackground';
import { useTheme } from '../../context/ThemeContext';
import {
  FiUser,
  FiBriefcase,
  FiFolder,
  FiMail,
  FiLink,
  FiFileText,
  FiImage,
  FiGrid,
  FiHome,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { to: '/admin', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/about', icon: FiUser, label: 'About Me' },
  { to: '/admin/experience', icon: FiBriefcase, label: 'Experience' },
  { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { to: '/admin/contact', icon: FiMail, label: 'Contact' },
  { to: '/admin/links', icon: FiLink, label: 'Links' },
  { to: '/admin/resume', icon: FiFileText, label: 'Resume' },
  { to: '/admin/profile', icon: FiImage, label: 'Profile Pic' },
  { to: '/admin/sections', icon: FiGrid, label: 'Sections' }
];

function useAdminWaveColor(): [number, number, number] {
  const { theme } = useTheme();
  return useMemo(() => {
    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-footer-wave-rgb')
      .trim();
    const parts = rgb.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
      return [parts[0], parts[1], parts[2]] as [number, number, number];
    }
    return theme === 'dark' ? [0.039, 0.098, 0.188] : [0.031, 0.569, 0.698];
  }, [theme]);
}

function useAdminPrimaryColor(): [number, number, number] {
  const { theme } = useTheme();
  return useMemo(() => {
    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-primary-rgb-normalized')
      .trim();
    const parts = rgb.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
      return [parts[0], parts[1], parts[2]] as [number, number, number];
    }
    return theme === 'dark' ? [0.392, 1, 0.855] : [0.031, 0.569, 0.698];
  }, [theme]);
}

const AdminLayoutInner: React.FC = () => {
  const { user, signOut } = useAuth();
  const waveColor = useAdminWaveColor();
  const primaryColor = useAdminPrimaryColor();

  return (
    <>
      <Navbar />
      <LeftSidebar />
      <RightSidebar />
      <div className="flex min-h-screen bg-background">
        <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-slate-700/50 bg-background/95 backdrop-blur pt-20 pb-8 overflow-y-auto">
          {user?.email && (
            <div className="px-3 pb-4 mb-4 border-b border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Logged in as</div>
              <ShinyText
                text={user.email}
                className="text-xs text-lightest_slate block truncate"
                color="#94a3b8"
                shineColor="#64ffda"
                speed={3}
                spread={100}
              />
            </div>
          )}
          <nav className="flex flex-col gap-1 px-3">
            {adminNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-lightest_slate hover:bg-slate-700/30 hover:text-primary'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => signOut()}
              className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-lightest_slate hover:bg-slate-700/30 hover:text-red-400 transition-colors"
            >
              <FiLogOut size={18} />
              Sign out
            </button>
          </nav>
        </aside>
        <main className="ml-56 flex-1 relative px-6 py-8 pt-24 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30">
            <Suspense fallback={null}>
              <WaveBackground
                waveColor={waveColor}
                primaryColor={primaryColor}
                primaryBlend={0.15}
                disableAnimation={false}
                enableMouseInteraction={false}
                waveAmplitude={0.15}
                waveFrequency={2}
                waveSpeed={0.02}
                pixelSize={10}
                colorLevels={5}
              />
            </Suspense>
          </div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/50 to-transparent pointer-events-none" aria-hidden />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export const AdminLayout: React.FC = () => (
  <ProtectedRoute>
    <AdminLayoutInner />
  </ProtectedRoute>
);
