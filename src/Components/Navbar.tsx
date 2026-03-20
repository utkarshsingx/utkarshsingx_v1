import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-scroll';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const controls = useAnimation();
  const [toggleMenu, settoggleMenu] = useState(false);
  const [prevScroll, setprevScroll] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = toggleMenu ? 'hidden' : 'auto';
    }
  }, [toggleMenu]);

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    setScrollY(currentScroll);
    if (currentScroll <= prevScroll) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
    setprevScroll(currentScroll);
  };

  useEffect(() => {
    setScrollY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScroll]);

  const shadowClass = scrollY >= 100 ? 'drop-shadow-2xl' : '';

  return (
    <>
      <div className='flex items-center justify-center'>
        <motion.div
          animate={controls}
          transition={{ duration: 0.3 }}
          className={`hidden md:flex font-mono justify-between gap-10 text-base items-center fixed dark:bg-navy light:bg-white light:border-b light:border-slate-200 p-10 h-16 w-full -mt-2 z-50 glassmorphism ${shadowClass} duration-1000`}
        >
          <Link to='intro' spy={true} smooth={true} duration={500} offset={-100} className='text-primary text-base hover:cursor-pointer hover:text-white'>
            SLAYER
          </Link>
          <div>
            <ul className='flex gap-8 items-center'>
              <li>
                <button
                  type='button'
                  onClick={toggleTheme}
                  className='cursor-pointer hover:text-primary duration-200 p-1'
                  aria-label='Toggle theme'
                >
                  {theme === 'dark' ? <FiSun className='text-xl' /> : <FiMoon className='text-xl' />}
                </button>
              </li>
              <motion.li
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className='flex gap-1 hover:text-primary hover:cursor-pointer'
              >
                <Link to='about' spy={true} smooth={true} duration={500} offset={-100}>
                  <span className='text-primary'>01.</span>
                  <span>About</span>
                </Link>
              </motion.li>
              <motion.li
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className='flex gap-1 hover:text-primary hover:cursor-pointer'
              >
                <Link to='experience' spy={true} smooth={true} duration={500} offset={-100}>
                  <span className='text-primary'>02.</span>
                  <span>Experience</span>
                </Link>
              </motion.li>
              <motion.li
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className='flex gap-1 hover:text-primary hover:cursor-pointer'
              >
                <Link to='projects' spy={true} smooth={true} duration={500} offset={-100}>
                  <span className='text-primary'>03.</span>
                  <span>Work</span>
                </Link>
              </motion.li>
              <motion.li
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className='flex gap-1 hover:text-primary hover:cursor-pointer'
              >
                <Link to='contact' spy={true} smooth={true} duration={500} offset={-100}>
                  <span className='text-primary'>04.</span>
                  <span>Contact</span>
                </Link>
              </motion.li>
              <a href='/UtkarshResume.pdf' target='_blank' rel='noreferrer'>
                <motion.li
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className='flex gap-1 hover:cursor-pointer'
                >
                  <Button title='Resume' />
                </motion.li>
              </a>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className='flex items-center justify-center w-full'>
        <motion.div
          animate={controls}
          transition={{ duration: 0.3 }}
          className={`flex md:hidden font-mono justify-between text-base gap-8 fixed p-10 h-16 w-full -mt-2 z-50 glassmorphism dark:bg-navy light:bg-white light:border-b light:border-slate-200 ${shadowClass} duration-1000`}
        >
          <Link to='intro' spy={true} smooth={true} duration={500} offset={-100} className='text-primary text-base hover:cursor-pointer hover:text-white'>
            SLAYER
          </Link>
          <button
            type='button'
            onClick={toggleTheme}
            className='cursor-pointer hover:text-primary duration-200 p-2'
            aria-label='Toggle theme'
          >
            {theme === 'dark' ? <FiSun className='text-xl' /> : <FiMoon className='text-xl' />}
          </button>
          {toggleMenu ? (
            <motion.div
              animate={{ x: -20 }}
              transition={{ duration: 0.3 }}
              className='flex -mr-16 flex-col w-full h-screen -mt-10 bg-light_navy'
            >
              <IoClose
                className='absolute top-10 text-4xl mr-[50px] text-primary hover:text-off_white self-end'
                onClick={() => settoggleMenu((prev) => !prev)}
              />
              <ul className='flex flex-col items-center w-full h-full justify-center'>
                <li className='h-[15%] w-full items-center justify-center flex gap-1 hover:text-primary hover:cursor-pointer'>
                  <Link
                    to='about'
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => settoggleMenu(false)}
                  >
                    <span className='text-primary'>01.</span>
                    <span>About</span>
                  </Link>
                </li>
                <li className='h-[15%] w-full items-center justify-center flex gap-1 hover:text-primary hover:cursor-pointer'>
                  <Link
                    to='experience'
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => settoggleMenu(false)}
                  >
                    <span className='text-primary'>02.</span>
                    <span>Experience</span>
                  </Link>
                </li>
                <li className='h-[15%] w-full items-center justify-center flex gap-1 hover:text-primary hover:cursor-pointer'>
                  <Link
                    to='projects'
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => settoggleMenu(false)}
                  >
                    <span className='text-primary'>03.</span>
                    <span>Work</span>
                  </Link>
                </li>
                <li className='h-[15%] w-full items-center justify-center flex gap-1 hover:text-primary hover:cursor-pointer'>
                  <Link
                    to='contact'
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => settoggleMenu(false)}
                  >
                    <span className='text-primary'>04.</span>
                    <span>Contact</span>
                  </Link>
                </li>
                <li className='h-[15%] w-full items-center justify-center flex gap-1 hover:cursor-pointer'>
                  <a href='/UtkarshResume.pdf' target='_blank' rel='noreferrer'>
                    <Button title='Resume' />
                  </a>
                </li>
              </ul>
            </motion.div>
          ) : (
            <FiMenu
              className='text-3xl text-primary hover:text-off_white'
              onClick={() => settoggleMenu((prev) => !prev)}
            />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
