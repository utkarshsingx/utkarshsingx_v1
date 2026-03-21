import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FuzzyText from '../FuzzyText';
import LetterGlitch from '../LetterGlitch';

const AdminWelcome: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'chief' | 'welcome'>('chief');

  useEffect(() => {
    const fadeToWelcome = setTimeout(() => {
      setPhase('welcome');
    }, 2200);

    const hideAll = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(fadeToWelcome);
      clearTimeout(hideAll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* LetterGlitch background */}
          <div className="absolute inset-0 z-0">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette
              outerVignette={false}
              smooth
            />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'chief' ? (
              <motion.div
                key="chief"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                <FuzzyText
                  baseIntensity={0.2}
                  hoverIntensity={0.5}
                  enableHover
                  color="#64ffda"
                  fontSize="clamp(3rem, 14vw, 6rem)"
                >
                  Hey Chief!
                </FuzzyText>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                <FuzzyText
                  baseIntensity={0.2}
                  hoverIntensity={0.5}
                  enableHover
                  color="#64ffda"
                  fontSize="clamp(3rem, 14vw, 6rem)"
                >
                  Welcome back &lt;3
                </FuzzyText>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminWelcome;
