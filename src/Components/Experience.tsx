import React, { useState } from 'react';
import Heading from '../ui/Heading';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';
import type { ExperienceRow } from '../hooks/usePortfolioData';

const Experience: React.FC = () => {
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
      <Heading index={'02'} title={"Where I've Worked"} />
      <div className='flex mt-5 sm:mt-6 md:flex-row flex-col gap-6 sm:gap-8'>
        <div className='flex mr-0 sm:mr-4 md:mr-8 flex-row md:flex-col overflow-x-auto pb-2 md:pb-0 gap-0 md:gap-0 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x'>
          {experience?.map((item) => (
            <button
              key={item.id}
              type='button'
              role='tab'
              aria-selected={displayJob?.id === item.id}
              aria-controls='experience-detail'
              id={`experience-tab-${item.id}`}
              className={`font-mono py-3 px-3 shrink-0 md:shrink-auto md:border-l-4 border-b-4 md:border-b-0 text-left text-sm sm:text-base bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${
                displayJob?.id === item.id ? 'text-primary border-primary' : 'text-lightest_slate border-lightest_navy'
              } hover:bg-lightest_navy cursor-pointer hover:text-primary duration-[600ms] ease-in-out [touch-action:manipulation]`}
              onClick={() => onSelectHandle(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
        {displayJob && (
          <div id='experience-detail' role='tabpanel' aria-labelledby={`experience-tab-${displayJob.id}`} className='max-w-[600px] w-full'>
            <div className='text-off_white font-[600] text-[18px] sm:text-[20px] ease-in animate-smooth-render duration-200'>
              {displayJob.position}
              <span className='text-primary'> @ {displayJob.name}</span>
            </div>
            <div className='text-lightest_slate mb-8'>{displayJob.time_period}</div>
            <div className='duration-300'>
              {displayJob?.description?.map((item, index) => (
                <div key={index} className='flex'>
                  <div className='text-primary'>&#9656;</div>
                  <span className='text-lightest_slate'> {item}<br /> <br /></span>
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
