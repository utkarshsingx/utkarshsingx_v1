import React from 'react';
import Button from '@/ui/Button';
import GlitchText from './GlitchText';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';

const Contact: React.FC = () => {
  const { data } = usePortfolioDataContext();
  const contact = data.contact;

  if (!contact) return null;

  return (
    <div className='text-center max-w-[720px] w-full flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8 overflow-visible' id='contact'>
      <div className='text-primary text-lg font-mono mb-2'>05. What&apos;s Next?</div>
      <div className='min-h-[4rem] flex items-center justify-center overflow-visible'>
        <GlitchText speed={1} enableShadows enableOnHover={false} className='text-off_white'>
          {contact.section_title}
        </GlitchText>
      </div>
      <div className='text-lightest_slate text-sm sm:text-base my-3 mb-8 sm:mb-12'>
        {contact.body_text}
      </div>
      <a href={contact.cta_url} target='_blank' rel='noreferrer'>
        <Button title={contact.cta_label} />
      </a>
    </div>
  );
};

export default Contact;
