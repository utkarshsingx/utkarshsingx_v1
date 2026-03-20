import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface GooeyNavItem {
  label: string;
  href?: string;
  to?: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  // Sync active index with current route
  useEffect(() => {
    const path = location.pathname;
    const idx = items.findIndex((item) => {
      const target = item.to ?? item.href ?? '';
      if (target === '/admin' || target === '/admin/') {
        return path === '/admin' || path === '/admin/';
      }
      return path.startsWith(target);
    });
    if (idx >= 0) setActiveIndex(idx);
  }, [location.pathname, items]);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };
  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // ignore
          }
        }, t);
      }, 30);
    }
  };
  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };
  const handleClickInternal = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const el = e.currentTarget;
    const item = items[index];
    const isInternal = item.to || (item.href && !item.href.startsWith('http'));
    if (isInternal) {
      e.preventDefault();
      if (activeIndex === index) return;
      setActiveIndex(index);
      if (item.to) navigate(item.to);
      else if (item.href) navigate(item.href);
    } else {
      return; // external link, let default behavior happen
    }
    updateEffectPosition(el);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach((p) => filterRef.current!.removeChild(p));
    }
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        const anchor = liEl.querySelector('a');
        if (anchor) {
          handleClickInternal(
            {
              currentTarget: anchor
            } as React.MouseEvent<HTMLAnchorElement>,
            index
          );
        }
      }
    }
  };
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement;
    if (activeLi) {
      const anchor = activeLi.querySelector('a');
      if (anchor) {
        updateEffectPosition(anchor as HTMLElement);
      }
      textRef.current?.classList.add('active');
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement;
      if (currentActiveLi) {
        const anchor = currentActiveLi.querySelector('a');
        if (anchor) {
          updateEffectPosition(anchor as HTMLElement);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          .gooey-nav {
            --gooey-primary: var(--theme-primary, #64ffda);
            --gooey-text: var(--theme-text, #a8b2d1);
            --gooey-bg: var(--theme-bg, #0a192f);
            --gooey-active-text: #000000;
            --color-1: var(--gooey-primary);
            --color-2: var(--gooey-primary);
            --color-3: var(--gooey-primary);
            --color-4: var(--gooey-primary);
          }
          .gooey-nav .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .gooey-nav .effect.text {
            color: var(--gooey-bg);
            transition: color 0.3s ease;
          }
          .gooey-nav .effect.text.active {
            color: var(--gooey-active-text);
          }
          .gooey-nav .effect.filter {
            filter: blur(7px) contrast(100) blur(0);
            mix-blend-mode: lighten;
          }
          .gooey-nav .effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: transparent;
          }
          .gooey-nav .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--gooey-primary);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .gooey-nav .effect.active::after {
            animation: gooey-pill 0.3s ease both;
          }
          @keyframes gooey-pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .gooey-nav .particle,
          .gooey-nav .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .gooey-nav .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: gooey-particle calc(var(--time)) ease 1 -350ms;
          }
          .gooey-nav .point {
            background: var(--color);
            opacity: 1;
            animation: gooey-point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes gooey-particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes gooey-point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          .gooey-nav li {
            color: var(--gooey-text);
          }
          .gooey-nav li:hover:not(.active) {
            color: var(--gooey-primary);
          }
          .gooey-nav li.active {
            color: var(--gooey-active-text);
            text-shadow: none;
          }
          .gooey-nav li.active::after {
            opacity: 1;
            transform: scale(1);
          }
          .gooey-nav li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background: transparent;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
        `}
      </style>
      <div className="gooey-nav relative" ref={containerRef}>
        <nav className="flex relative justify-center" style={{ transform: 'translate3d(0,0,0.01px)' }}>
          <ul
            ref={navRef}
            className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8 list-none p-0 px-2 sm:px-4 m-0 relative z-[3] justify-center text-sm sm:text-base"
            style={{
              color: 'var(--theme-text, #a8b2d1)',
              textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)'
            }}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                <a
                  href={item.to ?? item.href ?? '#'}
                  onClick={(e) => handleClickInternal(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="outline-none py-[0.5em] sm:py-[0.6em] px-[0.6em] sm:px-[1em] inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;
