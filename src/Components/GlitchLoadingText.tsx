import { useEffect, useState, useRef } from 'react';

interface GlitchLoadingTextProps {
  text?: string;
  className?: string;
  glitchChars?: string;
  intervalMs?: number;
}

const GlitchLoadingText: React.FC<GlitchLoadingTextProps> = ({
  text = 'Loading...',
  className = 'text-lightest_slate font-mono',
  glitchChars = '!@#$%^&*<>?/\\|~`01',
  intervalMs = 80
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const chars = text.split('');
    const glitchArr = glitchChars.split('');

    const id = setInterval(() => {
      if (!mounted.current) return;
      if (Math.random() > 0.4) {
        setIsGlitching(true);
        const scrambled = chars
          .map((c) => (c === ' ' ? ' ' : glitchArr[Math.floor(Math.random() * glitchArr.length)]))
          .join('');
        setDisplayText(scrambled);
        setTimeout(() => {
          if (mounted.current) {
            setDisplayText(text);
            setIsGlitching(false);
          }
        }, 50);
      }
    }, intervalMs);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [text, glitchChars, intervalMs]);

  return (
    <span
      className={`inline-block relative ${className}`}
      aria-live="polite"
    >
      <span
        className="block"
        style={{
          textShadow: isGlitching
            ? '2px 0 #ff006e, -2px 0 #00f5d4, 0 1px #ff006e, 0 -1px #00f5d4'
            : 'none'
        }}
      >
        {displayText}
      </span>
    </span>
  );
};

export default GlitchLoadingText;
