import React, { Suspense, useMemo, useSyncExternalStore } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminWelcome from './AdminWelcome';
import GlitchText from '../GlitchText';
import WaveBackground from '../WaveBackground';
import GooeyNav from '../GooeyNav';
import StaggeredMenu from '../StaggeredMenu';
import type { StaggeredMenuItem } from '../StaggeredMenu';
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

const adminStaggeredItems: StaggeredMenuItem[] = adminNavItems.map((item) => ({
  label: item.label,
  ariaLabel: item.label,
  link: item.to
}));

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
  const navigate = useNavigate();
  const waveColor = useAdminWaveColor();
  const primaryColor = useAdminPrimaryColor();
  const isMobile = useIsMobile();

  const handleAdminStaggeredClick = (item: StaggeredMenuItem, closeMenu: () => void) => {
    const navItem = adminNavItems.find((n) => n.label === item.label);
    if (navItem) {
      navigate(navItem.to);
      closeMenu();
    }
  };

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
        <div className="fixed top-0 left-0 right-0 h-[180px] sm:h-[220px] md:h-[260px] lg:h-[280px] z-[35] pointer-events-none admin-blur-fade" aria-hidden />
        {/* StaggeredMenu on mobile, GooeyNav on desktop */}
        {isMobile ? (
          <StaggeredMenu
            position="right"
            items={adminStaggeredItems}
            displaySocials={false}
            displayItemNumbering
            logoText="Admin"
            changeMenuColorOnOpen
            isFixed
            closeOnClickAway
            onItemClick={handleAdminStaggeredClick}
          />
        ) : (
          <header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-12 sm:pt-16 md:pt-20 pb-2 sm:pb-4 min-h-[140px] sm:min-h-[180px] md:min-h-[220px] overflow-hidden bg-background/60 backdrop-blur-md">
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
        )}
        <main className="flex-1 relative px-4 sm:px-6 py-6 sm:py-10 pt-44 sm:pt-52 md:pt-60 lg:pt-64 pb-16 sm:pb-20 overflow-x-hidden flex flex-col items-center text-center z-10" data-admin>
          <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center min-w-0">
            <Outlet />
          </div>
        </main>
        {/* Bottom footer: Sign out (left), Email (right) - aligned on mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 pb-[max(1rem,env(safe-area-inset-bottom))] bg-background/80 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none transition-all duration-300 ease-out">
          <button
            onClick={() => signOut()}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-lightest_slate hover:bg-slate-700/30 hover:text-red-400 transition-colors touch-manipulation"
          >
            <FiLogOut size={16} />
            <GlitchText speed={0.4} enableShadows enableOnHover className="!text-sm !font-normal !mx-0 text-lightest_slate">
              Sign out
            </GlitchText>
          </button>
          {user?.email && (
            <div className="min-w-0 flex-1 flex justify-end">
              <GlitchText speed={0.4} enableShadows enableOnHover className="!text-xs sm:!text-sm !font-normal !mx-0 text-lightest_slate truncate block max-w-full text-right">
                {user.email}
              </GlitchText>
            </div>
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
