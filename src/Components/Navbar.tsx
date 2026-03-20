import React, { useState, useEffect, useRef, useSyncExternalStore, useMemo } from 'react';
import { FiHome, FiUser, FiBriefcase, FiActivity, FiFolder, FiMail, FiFileText, FiSun, FiMoon } from 'react-icons/fi';
import { scroller } from 'react-scroll';
import { motion, AnimatePresence } from 'motion/react';
import Dock from './Dock';
import StaggeredMenu from './StaggeredMenu';
import type { StaggeredMenuItem, StaggeredMenuSocialItem } from './StaggeredMenu';
import GlitchText from './GlitchText';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';

const scrollTo = (id: string) => {
  scroller.scrollTo(id, { smooth: true, duration: 500, offset: -100 });
};

const SCROLL_THRESHOLD = 100;
const HIDE_DELAY_MS = 800;

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

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { data } = usePortfolioDataContext();
  const resumeUrl = data.resume?.file_url || '/UtkarshResume.pdf';
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsVisible(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (!isHoveringRef.current) {
          hideTimeoutRef.current = setTimeout(() => setIsVisible(false), HIDE_DELAY_MS);
        }
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const iconSize = isMobile ? 16 : 18;
  const dockItems = [
    { icon: <FiHome size={iconSize} />, label: 'Home', onClick: () => scrollTo('intro') },
    { icon: <FiUser size={iconSize} />, label: 'About', onClick: () => scrollTo('about') },
    { icon: <FiBriefcase size={iconSize} />, label: 'Experience', onClick: () => scrollTo('experience') },
    { icon: <FiActivity size={iconSize} />, label: 'Contributions', onClick: () => scrollTo('contributions') },
    { icon: <FiFolder size={iconSize} />, label: 'Work', onClick: () => scrollTo('projects') },
    { icon: <FiMail size={iconSize} />, label: 'Contact', onClick: () => scrollTo('contact') },
    { icon: <FiFileText size={iconSize} />, label: 'Resume', onClick: () => window.open(resumeUrl, '_blank') },
    {
      icon: theme === 'dark' ? <FiSun size={iconSize} /> : <FiMoon size={iconSize} />,
      label: theme === 'dark' ? 'Light' : 'Dark',
      onClick: toggleTheme
    }
  ];

  const staggeredItems: StaggeredMenuItem[] = useMemo(
    () => [
      { label: 'Home', ariaLabel: 'Go to home', link: '#intro' },
      { label: 'About', ariaLabel: 'About me', link: '#about' },
      { label: 'Experience', ariaLabel: 'Experience', link: '#experience' },
      { label: 'Contributions', ariaLabel: 'Contributions', link: '#contributions' },
      { label: 'Work', ariaLabel: 'Projects', link: '#projects' },
      { label: 'Contact', ariaLabel: 'Contact', link: '#contact' },
      { label: 'Resume', ariaLabel: 'Download resume', link: resumeUrl }
    ],
    [resumeUrl]
  );

  const socialItems: StaggeredMenuSocialItem[] = useMemo(() => {
    const linkMap: Record<string, string> = {};
    data.links.forEach((l) => {
      linkMap[l.type] = l.url;
    });
    const out: StaggeredMenuSocialItem[] = [];
    if (linkMap.github) out.push({ label: 'GitHub', link: linkMap.github });
    if (linkMap.twitter) out.push({ label: 'Twitter', link: linkMap.twitter });
    if (linkMap.linkedin) out.push({ label: 'LinkedIn', link: linkMap.linkedin });
    return out;
  }, [data.links]);

  const handleStaggeredItemClick = (item: StaggeredMenuItem, closeMenu: () => void) => {
    if (item.link.startsWith('#')) {
      const id = item.link.slice(1);
      if (id === 'intro' || id === 'about' || id === 'experience' || id === 'contributions' || id === 'projects' || id === 'contact') {
        scrollTo(id);
      }
      closeMenu();
    } else if (item.label === 'Resume') {
      window.open(resumeUrl, '_blank');
      closeMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <>
      {isMobile ? (
        <StaggeredMenu
          position="right"
          items={staggeredItems}
          socialItems={socialItems}
          displaySocials={socialItems.length > 0}
          displayItemNumbering
          renderLogo={
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="cursor-pointer touch-manipulation bg-transparent border-0 p-0 text-left"
            >
              <GlitchText speed={0.4} enableShadows enableOnHover className="!text-lg !font-bold !mx-0 font-sans">
                Slayer
              </GlitchText>
            </button>
          }
          changeMenuColorOnOpen
          isFixed
          closeOnClickAway
          onItemClick={handleStaggeredItemClick}
        />
      ) : (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none pb-[var(--safe-area-inset-bottom)]">
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="pointer-events-auto"
                onMouseEnter={() => {
                  isHoveringRef.current = true;
                  if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  isHoveringRef.current = false;
                  hideTimeoutRef.current = setTimeout(() => setIsVisible(false), HIDE_DELAY_MS);
                }}
              >
                <Dock
                  items={dockItems}
                  panelHeight={68}
                  baseItemSize={50}
                  magnification={90}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Navbar;
