import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import FuzzyText from '../FuzzyText';

const NotAdminScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = () => {
    navigate('/', { replace: true });
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center justify-center gap-6 text-center px-6">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.5}
              enableHover
              color="#ff6b6b"
              fontSize="clamp(2.5rem, 8vw, 5rem)"
            >
              Hey Stranger!
            </FuzzyText>
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.5}
              enableHover
              color="#ff6b6b"
              fontSize="clamp(2rem, 6vw, 4rem)"
            >
              You're not chief!
            </FuzzyText>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotAdminScreen;
