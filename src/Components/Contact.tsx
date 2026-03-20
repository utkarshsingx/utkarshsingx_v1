import React from 'react';
import Button from '@/ui/Button';
import GlitchText from './GlitchText';

const Contact: React.FC = () => {
  return (
    <div className='text-center max-w-[720px] w-full flex flex-col items-center px-6 py-8 overflow-visible' id='contact'>
      <div className='text-primary text-lg font-mono mb-2'>05. What&apos;s Next?</div>
      <div className='min-h-[4rem] flex items-center justify-center overflow-visible'>
        <GlitchText speed={1} enableShadows enableOnHover={false} className='text-off_white'>
          Get In Touch
        </GlitchText>
      </div>
      <div className='text-lightest_slate my-3 mb-12'>
        Feel free to reach out! I'm currently open to new freelancing projects and eager to explore exciting opportunities. Let's connect and discuss how we can collaborate on innovative and impactful ventures. Looking forward to hearing from you!
      </div>
      <a href='https://www.linkedin.com/in/utkarsh-singh-0b9090227/' target='_blank' rel='noreferrer'>
        <Button title='Say Hello!' />
      </a>
    </div>
  );
};

export default Contact;
