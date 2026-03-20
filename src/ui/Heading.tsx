import React from 'react';

interface HeadingProps {
  index: string;
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ index, title }) => {
  return (
    <div className='flex items-center text-off_white md:text-[26px] text-[20px] gap-4 whitespace-nowrap'>
      <div>
        <span className='font-mono text-primary'>{index}. </span>
        <span className='font-bold'>{title}</span>
      </div>
      <div className='h-[1px] w-full max-w-[300px] bg-lightest_navy'></div>
    </div>
  );
};

export default Heading;
