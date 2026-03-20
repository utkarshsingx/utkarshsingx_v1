import React from 'react';

interface HeadingProps {
  index: string;
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ index, title }) => {
  return (
    <div className='flex min-w-0 items-center text-off_white text-[18px] sm:text-[20px] md:text-[26px] gap-2 sm:gap-4'>
      <div className='shrink-0'>
        <span className='font-mono text-primary'>{index}. </span>
        <span className='font-bold'>{title}</span>
      </div>
      <div className='h-[1px] min-w-[20px] flex-1 max-w-[200px] sm:max-w-[300px] bg-lightest_navy'></div>
    </div>
  );
};

export default Heading;
