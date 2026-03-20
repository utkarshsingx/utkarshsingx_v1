import React, { useState, useEffect } from 'react';
import { FiHome, FiUser, FiBriefcase, FiFolder, FiMail, FiFileText, FiSun, FiMoon } from 'react-icons/fi';
import { scroller } from 'react-scroll';
import { motion, AnimatePresence } from 'motion/react';
import Dock from './Dock';
import { useTheme } from '../context/ThemeContext';

const scrollTo = (id: string) => {
  scroller.scrollTo(id, { smooth: true, duration: 500, offset: -100 });
};

const SCROLL_THRESHOLD = 100;
const HIDE_DELAY_MS = 800;

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsVisible(true);
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => setIsVisible(false), HIDE_DELAY_MS);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(hideTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const items = [
    { icon: <FiHome size={18} />, label: 'Home', onClick: () => scrollTo('intro') },
    { icon: <FiUser size={18} />, label: 'About', onClick: () => scrollTo('about') },
    { icon: <FiBriefcase size={18} />, label: 'Experience', onClick: () => scrollTo('experience') },
    { icon: <FiFolder size={18} />, label: 'Work', onClick: () => scrollTo('projects') },
    { icon: <FiMail size={18} />, label: 'Contact', onClick: () => scrollTo('contact') },
    { icon: <FiFileText size={18} />, label: 'Resume', onClick: () => window.open('/UtkarshResume.pdf', '_blank') },
    {
      icon: theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />,
      label: theme === 'dark' ? 'Light' : 'Dark',
      onClick: toggleTheme
    }
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto"
          >
            <Dock
              items={items}
              panelHeight={68}
              baseItemSize={50}
              magnification={90}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
