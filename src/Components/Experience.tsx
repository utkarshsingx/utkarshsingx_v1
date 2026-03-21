import React, { useState } from 'react';
import Heading from '../ui/Heading';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';
import type { ExperienceRow } from '../hooks/usePortfolioData';

interface ExperienceProps {
  sectionIndex?: string;
}

const Experience: React.FC<ExperienceProps> = ({ sectionIndex = '02' }) => {
  const { data } = usePortfolioDataContext();
  const experience = data.experience;
  const [selectedJob, setselectedJob] = useState<ExperienceRow | null>(null);

  const displayJob = selectedJob || experience[0] || null;

  const onSelectHandle = (item: ExperienceRow) => {
    setselectedJob(item);
  };

  if (!experience.length) return null;

  return (
    <div className='mt-14 sm:mt-24 md:mt-32 lg:mt-44 min-w-0' id='experience'>
      <Heading index={sectionIndex} title={"Where I've Worked"} />
      <div className='flex mt-5 sm:mt-6 md:flex-row flex-col gap-6 sm:gap-8'>
        <div className='flex mr-0 sm:mr-4 md:mr-8 flex-row md:flex-col overflow-x-auto pb-2 md:pb-0 gap-0 md:gap-0 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x min-h-[48px] md:min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {experience?.map((item) => (
            <button
              key={item.id}
              type='button'
              role='tab'
              aria-selected={displayJob?.id === item.id}
              aria-controls='experience-detail'
              id={`experience-tab-${item.id}`}
              className={`font-mono py-3 px-4 md:px-3 shrink-0 md:shrink-auto md:border-l-4 border-b-2 md:border-b-0 min-h-[48px] md:min-h-0 text-left text-sm sm:text-base bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-navy touch-manipulation ${
                displayJob?.id === item.id ? 'text-primary border-primary' : 'text-lightest_slate border-lightest_navy'
              } hover:bg-lightest_navy cursor-pointer hover:text-primary active:bg-lightest_navy/80 duration-[600ms] ease-in-out [touch-action:manipulation]`}
              onClick={() => onSelectHandle(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
        {displayJob && (
          <div id='experience-detail' role='tabpanel' aria-labelledby={`experience-tab-${displayJob.id}`} className='max-w-[600px] w-full min-w-0'>
            <div className='text-off_white font-[600] text-[19px] sm:text-[20px] ease-in animate-smooth-render duration-200 leading-tight'>
              {displayJob.position}
              <span className='text-primary'> @ {displayJob.name}</span>
            </div>
            <div className='text-lightest_slate text-sm sm:text-base mb-6 sm:mb-8 mt-1'>{displayJob.time_period}</div>
            <div className='duration-300 space-y-3'>
              {displayJob?.description?.map((item, index) => (
                <div key={index} className='flex gap-2 sm:gap-2'>
                  <span className='text-primary shrink-0 mt-0.5'>&#9656;</span>
                  <span className='text-lightest_slate text-sm sm:text-base leading-relaxed'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experience;
