import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { loadGhosttyFrames, parseFrameLine } from '../lib/ghosttyFrames';

const FALLBACK_GHOST = `
    xx++++++++++xx
  ++==****%%%%%****==++
 ++***$$$$$$$$$$$$$$***++
++*$$$@@@@@@@@@@@@@@@@$$$*++
++*$$@@@@@@@@@@@@@@@@@@$$*++
++*$$@@@@@@@@@@@@@@@@@@$$*++
++*$$$$$$$$$$$$$$$$$$$$$$*++
 ++*$$$$$$$$$$$$$$$$$$$*++
  ++********  ********++
       👻 Ghostty
`;

const FPS = 30;
const FRAME_DELAY_MS = 1000 / FPS;

const GhostDisplay: React.FC = () => {
  const [frames, setFrames] = useState<string[] | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    loadGhosttyFrames()
      .then((f) => {
        if (!cancelled) {
          setFrames(f);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!frames || frames.length === 0) return;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, FRAME_DELAY_MS);
    return () => clearInterval(id);
  }, [frames]);

  const renderFrame = (frame: string) => {
    const lines = frame.split('\n');
    return lines.map((line, i) => {
      const segments = parseFrameLine(line);
      if (segments.length === 0) return <div key={i} className="h-[1em]" />;
      return (
        <div key={i} className="leading-none font-mono whitespace-pre">
          {segments.map((seg, j) => (
            <span
              key={j}
              className={seg.brand ? 'text-primary' : 'text-lightest_slate'}
            >
              {seg.text}
            </span>
          ))}
        </div>
      );
    });
  };

  const showFallback = loading || error;

  return (
    <div className="relative min-h-[70px] sm:min-h-[280px] w-full max-w-[200px] sm:max-w-none mx-auto rounded overflow-visible">
      <div
        className="flex justify-center overflow-visible py-0.5 sm:py-2"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {showFallback ? (
          <motion.pre
            className="font-mono text-[6px] sm:text-xs text-lightest_slate whitespace-pre text-center select-none leading-[1.1]"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut' as const
            }}
          >
            {FALLBACK_GHOST}
          </motion.pre>
        ) : (
          <div className="text-[6px] sm:text-[10px] leading-[1.1] text-center">
            {frames && renderFrame(frames[frameIndex] ?? '')}
          </div>
        )}
      </div>
    </div>
  );
};

export default GhostDisplay;
