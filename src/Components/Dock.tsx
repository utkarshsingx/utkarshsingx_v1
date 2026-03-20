'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import LetterGlitch from './LetterGlitch';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type SpringOptions = {
  mass?: number;
  stiffness?: number;
  damping?: number;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full overflow-visible bg-navy/60 dark:bg-navy/60 light:bg-white/60 border-lightest_navy dark:border-lightest_navy light:border-slate-200 border-2 shadow-lg text-primary ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {/* LetterGlitch background - fixed size, centered (does not magnify) */}
      <div
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden [&>div]:!bg-transparent"
        style={{ width: baseItemSize, height: baseItemSize }}
      >
        <LetterGlitch
          glitchColors={['#64ffda', '#a8b2d1', '#495670']}
          glitchSpeed={40}
          centerVignette={false}
          outerVignette={true}
          outerVignetteRadius={35}
          fontSize={8}
          charWidth={5}
          charHeight={10}
          smooth={true}
        />
      </div>
      {/* Icon overlay - fixed size, centered (does not magnify) */}
      <div
        className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center p-2 rounded-full bg-navy/50 dark:bg-navy/50 light:bg-white/70 overflow-hidden"
        style={{ width: baseItemSize, height: baseItemSize }}
      >
        {Children.map(children, child =>
          React.isValidElement(child) && (child as React.ReactElement).type !== DockLabel
            ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
            : child
        )}
      </div>
      {/* Tooltip - rendered outside icon overlay for correct positioning relative to dock item */}
      {Children.map(children, child =>
        React.isValidElement(child) && (child as React.ReactElement).type === DockLabel
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : null
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-8 left-1/2 z-[100] isolate font-sans w-fit whitespace-nowrap rounded-md border border-lightest_navy dark:border-lightest_navy light:border-slate-200 bg-navy dark:bg-navy light:bg-white px-2 py-1 text-xs font-normal antialiased text-lightest_slate dark:text-lightest_slate light:text-slate shadow-lg`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 90,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification]);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="relative mx-2 flex max-w-full items-center">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-fit gap-4 rounded-2xl border-lightest_navy dark:border-lightest_navy light:border-slate-200 border-2 py-2 px-4 bg-navy/80 dark:bg-navy/80 light:bg-white/80 backdrop-blur-lg`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Navigation dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
