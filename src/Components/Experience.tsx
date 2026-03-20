import React, { useState } from 'react';
import Heading from '../ui/Heading';
import experienceData from '../Assets/Data/experience.json';
import type { ExperienceItem } from '../types';

const experience = experienceData as ExperienceItem[];

const Experience: React.FC = () => {
  const [selectedJob, setselectedJob] = useState<ExperienceItem>(experience[0]);

  const onSelectHandle = (item: ExperienceItem) => {
    setselectedJob(item);
  };

  return (
    <div className='mt-44' id='experience'>
      <Heading index={'02'} title={"Where I've Worked"} />
      <div className='flex mt-6 md:flex-row flex-col gap-8'>
        <div className='flex mr-8 flex-row md:flex-col'>
          {experience?.map((item) => (
            <div
              key={item.j_no}
              className={`font-mono py-3 px-3 md:border-l-4 border-b-4 md:border-b-0 ${
                selectedJob === item ? 'text-primary border-primary' : 'text-lightest_slate border-lightest_navy'
              } hover:bg-lightest_navy cursor-pointer hover:text-primary duration-[600ms] ease-in-out`}
              onClick={() => onSelectHandle(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className='max-w-[600px]'>
          <div className='text-off_white font-[600] text-[20px] ease-in animate-smooth-render duration-200'>
            {selectedJob.position}
            <span className='text-primary'> @ {selectedJob.name}</span>
          </div>
          <div className='text-lightest_slate mb-8'>{selectedJob.time_period}</div>
          <div className='duration-300'>
            {selectedJob?.description?.map((item, index) => (
              <div key={index} className='flex'>
                <div className='text-primary'>&#9656;</div>
                <span className='text-lightest_slate'> {item}<br /> <br /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
