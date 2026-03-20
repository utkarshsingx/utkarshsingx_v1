import React, { Suspense, useMemo, useSyncExternalStore } from 'react';
import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminWelcome from './AdminWelcome';
import GlitchText from '../GlitchText';
import WaveBackground from '../WaveBackground';
import GooeyNav from '../GooeyNav';
import { useTheme } from '../../context/ThemeContext';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/about', label: 'About Me' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/contact', label: 'Contact' },
  { to: '/admin/links', label: 'Links' },
  { to: '/admin/resume', label: 'Resume' },
  { to: '/admin/profile', label: 'Profile Pic' },
  { to: '/admin/sections', label: 'Sections' }
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

const useIsMobile = () =>
  useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(max-width: 768px)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.innerWidth <= 768,
    () => false
  );

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
  const isMobile = useIsMobile();

  return (
    <>
      <AdminWelcome />
      <div className="flex min-h-screen bg-background flex-col relative">
        {/* WaveBackground throughout - nav and page */}
        <div className="fixed inset-0 z-0">
          <Suspense fallback={null}>
            <WaveBackground
              waveColor={waveColor}
              primaryColor={primaryColor}
              primaryBlend={0.25}
              disableAnimation={false}
              enableMouseInteraction={true}
              waveAmplitude={0.25}
              waveFrequency={2.5}
              waveSpeed={0.03}
              pixelSize={isMobile ? 8 : 12}
              colorLevels={5}
            />
          </Suspense>
        </div>
        {/* Top solid, fades down - full page overlay */}
        <div className="fixed inset-0 z-[1] pointer-events-none admin-page-fade" aria-hidden />
        {/* Blur layer with gradient transition - full blur at top, fades down */}
        <div className="fixed top-0 left-0 right-0 h-[220px] sm:h-[260px] md:h-[280px] z-[35] pointer-events-none admin-blur-fade" aria-hidden />
        {/* Centered GooeyNav - blurry bg with transition */}
        <header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-16 sm:pt-20 pb-3 sm:pb-4 min-h-[180px] sm:min-h-[220px] overflow-hidden bg-background/60 backdrop-blur-md">
          {/* Smooth gradient transition at bottom of nav */}
          <div className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none admin-nav-fade" aria-hidden />
          <div className="relative z-10 w-full flex flex-col items-center gap-2 sm:gap-4 px-2 sm:px-4">
            <GooeyNav
              items={adminNavItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        </header>
        <main className="flex-1 relative px-4 sm:px-6 py-6 sm:py-10 pt-56 sm:pt-60 md:pt-64 pb-16 sm:pb-20 overflow-x-hidden flex flex-col items-center text-center z-10" data-admin>
          <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center min-w-0">
            <Outlet />
          </div>
        </main>
        {/* Bottom: Sign out (left), Email (right) - GlitchText on hover */}
        <div className="fixed bottom-0 left-0 z-50 flex items-center pl-4 sm:pl-6 pb-4 sm:pb-6">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-lightest_slate hover:bg-slate-700/30 hover:text-red-400 transition-colors"
          >
            <FiLogOut size={16} />
            <GlitchText speed={0.4} enableShadows enableOnHover className="!text-sm !font-normal !mx-0 text-lightest_slate">
              Sign out
            </GlitchText>
          </button>
        </div>
        <div className="fixed bottom-0 right-0 z-50 flex items-center pr-4 sm:pr-6 pb-4 sm:pb-6 max-w-[180px] sm:max-w-[240px]">
          {user?.email && (
            <GlitchText speed={0.4} enableShadows enableOnHover className="!text-xs sm:!text-sm !font-normal !mx-0 text-lightest_slate truncate block">
              {user.email}
            </GlitchText>
          )}
        </div>
      </div>
    </>
  );
};

export const AdminLayout: React.FC = () => (
  <ProtectedRoute>
    <AdminLayoutInner />
  </ProtectedRoute>
);
