import React from 'react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';

const iconMap = {
  github: FiGithub,
  twitter: FaXTwitter,
  linkedin: FiLinkedin,
  email: () => null
};

const LeftSidebar: React.FC = () => {
  const { data } = usePortfolioDataContext();
  const sidebarLinks = data.links.filter((l) => l.type !== 'email');

  return (
    <div className='p-2 max-w-fit flex-col items-center fixed bottom-0 text-lightest_slate lg:flex hidden'>
      <div className='flex flex-col gap-4 text-2xl'>
        {sidebarLinks.map((link) => {
          const Icon = iconMap[link.type];
          if (!Icon) return null;
          return (
            <a key={link.id} href={link.url} target='_blank' rel='noreferrer'>
              <Icon className='hover:text-primary cursor-pointer duration-200' />
            </a>
          );
        })}
      </div>
      <div className='h-[130px] bg-lightest_slate w-[1px] mt-8'></div>
    </div>
  );
};

export default LeftSidebar;
