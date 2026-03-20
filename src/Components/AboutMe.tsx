import React, { useState } from 'react';
import Heading from '../ui/Heading';
import PixelTransition from './PixelTransition';
import profileImageFallback from '../Assets/Images/profile.png';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';

export const AboutMe: React.FC = () => {
  const [isHovered, setisHovered] = useState(false);
  const { data } = usePortfolioDataContext();
  const about = data.aboutMe;

  if (!about) return null;

  const profileSrc = about.profile_image_url || profileImageFallback;
  const paragraphs = about.content.split('\n\n').filter(Boolean);

  return (
    <div className='text-lightest_slate text-base sm:text-lg' id='about'>
      <Heading index={'01'} title={'About Me'} />
      <div className='flex mt-8 flex-col lg:flex-row gap-12 items-center'>
        <div className='max-w-[540px] w-full'>
          <div>
            {paragraphs.map((p, i) => {
              const lines = p.split('\n');
              return (
                <p key={i} className={i > 0 ? 'mt-4' : ''}>
                  {lines.map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono mt-4'>
              {about.tech_list.map((tech, i) => (
                <li key={i}>
                  <span className='text-primary'>&#9656;</span> {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          onMouseEnter={() => setisHovered(true)}
          onMouseLeave={() => setisHovered(false)}
          className='relative'
        >
          <div
            className={`${
              isHovered ? 'translate-x-1 translate-y-1' : 'translate-x-0 translate-y-0'
            } duration-300 absolute top-4 -right-4 -bottom-4 left-4 border-2 border-primary`}
          ></div>
          <div
            className={`${
              isHovered ? '-translate-x-1 -translate-y-1' : '-translate-x-0 -translate-y-0'
            } duration-300`}
          >
            <PixelTransition
              firstContent={
                <div className='relative w-full h-full'>
                  <img
                    src={profileSrc}
                    alt='Profile'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    className='absolute inset-0 bg-primary/30 mix-blend-soft-light pointer-events-none'
                    aria-hidden
                  />
                </div>
              }
              secondContent={
                <div
                  className='flex w-full h-full items-center justify-center bg-navy px-4 text-center'
                  style={{ width: '100%', height: '100%' }}
                >
                  <p className='font-bold text-lg md:text-xl text-primary'>Yeah! It&apos;s me ^_^</p>
                </div>
              }
              gridSize={8}
              pixelColor='#64ffda'
              once={false}
              animationStepDuration={0.4}
              className='!h-[240px] !w-[192px] sm:!h-[300px] sm:!w-[240px] shrink-0 border-2 border-primary rounded-none'
              aspectRatio='125%'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
