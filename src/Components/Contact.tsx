import React from 'react';
import Button from '../ui/Button';
import Heading from '../ui/Heading';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';

interface ContactProps {
  sectionIndex?: string;
}

const Contact: React.FC<ContactProps> = ({ sectionIndex = '05' }) => {
  const { data } = usePortfolioDataContext();
  const contact = data.contact;

  if (!contact) return null;

  return (
    <div className='w-full min-w-0 flex flex-col items-center py-5 sm:py-6 md:py-8 overflow-visible' id='contact'>
      <div className='w-full flex justify-center'>
        <Heading index={sectionIndex} title={contact.section_title} />
      </div>
      <div className='text-lightest_slate text-sm sm:text-base mt-4 sm:mt-6 mb-6 sm:mb-8 md:mb-12 max-w-[720px] w-full text-left'>
        {contact.body_text}
      </div>
      <a href={contact.cta_url} target='_blank' rel='noreferrer' className='mt-4'>
        <Button title={contact.cta_label} />
      </a>
    </div>
  );
};

export default Contact;
