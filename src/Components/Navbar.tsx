import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { FiHome, FiUser, FiBriefcase, FiActivity, FiFolder, FiMail, FiFileText, FiSun, FiMoon } from 'react-icons/fi';
import { scroller } from 'react-scroll';
import { motion, AnimatePresence } from 'motion/react';
import Dock from './Dock';
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

  const items = [
    { icon: <FiHome size={18} />, label: 'Home', onClick: () => scrollTo('intro') },
    { icon: <FiUser size={18} />, label: 'About', onClick: () => scrollTo('about') },
    { icon: <FiBriefcase size={18} />, label: 'Experience', onClick: () => scrollTo('experience') },
    { icon: <FiActivity size={18} />, label: 'Contributions', onClick: () => scrollTo('contributions') },
    { icon: <FiFolder size={18} />, label: 'Work', onClick: () => scrollTo('projects') },
    { icon: <FiMail size={18} />, label: 'Contact', onClick: () => scrollTo('contact') },
    { icon: <FiFileText size={18} />, label: 'Resume', onClick: () => window.open(resumeUrl, '_blank') },
    {
      icon: theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />,
      label: theme === 'dark' ? 'Light' : 'Dark',
      onClick: toggleTheme
    }
  ];

  return (
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
              items={items}
              panelHeight={isMobile ? 52 : 68}
              baseItemSize={isMobile ? 40 : 50}
              magnification={isMobile ? 50 : 90}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
