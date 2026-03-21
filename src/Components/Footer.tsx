import React, { Suspense, useMemo, useState, useSyncExternalStore } from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import WaveBackground from './WaveBackground';
import Contact from './Contact';
import { useTheme } from '../context/ThemeContext';
import { SecretTerminal } from './SecretTerminal';
import { SecretTerminalErrorBoundary } from './SecretTerminalErrorBoundary';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';

function useFooterWaveColor(): [number, number, number] {
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

function usePrimaryColor(): [number, number, number] {
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

const iconMap = {
  github: FiGithub,
  twitter: FaXTwitter,
  linkedin: FiLinkedin
};

const Footer: React.FC = () => {
  const waveColor = useFooterWaveColor();
  const primaryColor = usePrimaryColor();
  const isMobile = useIsMobile();
  const [showSecretTerminal, setShowSecretTerminal] = useState(false);
  const { data } = usePortfolioDataContext();
  const footerLinks = data.links.filter((l) => l.type !== 'email');
  const showContact = data.siteSections.find((s) => s.key === 'contact')?.enabled ?? true;

  const handleBuiltByClick = () => {
    setShowSecretTerminal(true);
  };

  return (
    <footer className="relative w-full overflow-hidden" id="footer">
      {/* Animated wave background - full height */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[var(--theme-footer-wave)]" />}>
          <WaveBackground
            waveColor={waveColor}
            primaryColor={primaryColor}
            primaryBlend={0.25}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            waveAmplitude={0.25}
            waveFrequency={2.5}
            waveSpeed={0.03}
            pixelSize={isMobile ? 8 : 12}
            colorLevels={5}
          />
        </Suspense>
      </div>

      {/* Transition: theme bg (What's Next) → wave (Built by) - extended & smooth */}
      <div
        className="absolute inset-x-0 top-0 z-[1] h-[85%] pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 footer-fade-gradient" />
      </div>

      {/* What's Next - centered in footer */}
      <div className="relative z-10 flex min-w-0 flex-col items-center justify-center w-full min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        {showContact && <Contact />}
      </div>

      {/* Built by - on wave background */}
      <div className="relative z-10 flex min-w-0 flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 md:py-12 min-h-[140px] sm:min-h-[160px] md:min-h-[200px]">
        <div className="flex lg:hidden gap-3 sm:gap-4 text-xl sm:text-2xl mb-3 sm:mb-4">
          {footerLinks.map((link) => {
            const Icon = iconMap[link.type as keyof typeof iconMap];
            if (!Icon) return null;
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                <Icon className="hover:text-primary cursor-pointer duration-300" />
              </a>
            );
          })}
        </div>
        <p className="font-mono text-center text-lightest_slate text-sm sm:text-base">
          Built by{' '}
          <button
            type="button"
            onClick={handleBuiltByClick}
            className="hover:text-primary cursor-pointer duration-300 bg-transparent border-none p-0 font-mono text-lightest_slate"
          >
            Utkarsh Singh
          </button>
          {' '}with 🖤
        </p>
      </div>
      {showSecretTerminal && (
        <SecretTerminalErrorBoundary onClose={() => setShowSecretTerminal(false)}>
          <SecretTerminal onClose={() => setShowSecretTerminal(false)} />
        </SecretTerminalErrorBoundary>
      )}
    </footer>
  );
};

export default Footer;
