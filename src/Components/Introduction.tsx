import React from 'react';
import Button from '../ui/Button';
import { Link } from 'react-scroll';
import LetterGlitch from './LetterGlitch';
import ShinyText from './ShinyText';
import Shuffle from './Shuffle';

const Introduction: React.FC = () => {
  return (
    <section className='relative min-h-screen h-screen w-full overflow-hidden' id='intro'>
      {/* LetterGlitch background */}
      <div className='absolute inset-0 z-0'>
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Smooth fade to About Me section - matches body bg */}
      <div
        className='absolute inset-x-0 bottom-0 z-[1] h-[70%] pointer-events-none'
        aria-hidden
      >
        <div className='absolute inset-0 bg-gradient-to-t from-navy to-transparent dark:from-navy light:from-page_bg_light' />
      </div>

      {/* Center-aligned content overlay */}
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center'>
        <div className='font-mono text-primary text-md'>Hi, my name is</div>
        <div className='font-[700] md:text-[70px] text-[40px] font-sans text-lightest_slate leading-[1.2] pb-3'>
          <ShinyText
            text='Utkarsh Singh.'
            className='font-[700] font-sans md:text-[70px] text-[40px] text-lightest_slate'
            color='#a8b2d1'
            shineColor='#64ffda'
            speed={2}
            spread={120}
            direction='left'
          />
          <br />
          <span className='text-slate'>
            I build things for{' '}
            <Shuffle
              text='the web'
              tag='span'
              className='normal-case text-slate font-sans font-[700] md:text-[70px] text-[40px]'
              shuffleDirection='right'
              duration={0.35}
              animationMode='evenodd'
              shuffleTimes={1}
              ease='power3.out'
              stagger={0.03}
              threshold={0.1}
              triggerOnce={false}
              triggerOnHover={true}
              triggerOnMount={true}
              respectReducedMotion={true}
              loop={true}
              loopDelay={2}
              style={{ fontKerning: 'none' }}
            />
            .
          </span>
        </div>
        <div className='text-base sm:text-lg text-lightest_slate max-w-[580px] mb-6 sm:mb-8 px-1'>
          I'm a software engineer specializing in <span className='text-primary'>building </span>and
          <span className='text-primary'> designing </span> exceptional digital experiences.
          I love to <span className='text-primary'>code</span> and looking for new ideas to
          implement in real life. Continuously striving to merge creativity with technology to deliver impactful solutions.
        </div>
        <Link to='projects' spy={true} smooth={true} duration={500} offset={-100}>
          <Button title='Check out my projects!' />
        </Link>
      </div>
    </section>
  );
};

export default Introduction;
