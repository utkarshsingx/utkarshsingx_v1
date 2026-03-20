import React from 'react';
import { motion, useInView } from 'framer-motion';
import Heading from '../ui/Heading';
import { FiGithub, FiLink } from 'react-icons/fi';
import { usePortfolioDataContext } from '../context/PortfolioDataContext';
import type { ProjectRow } from '../hooks/usePortfolioData';

const Projects: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { data } = usePortfolioDataContext();
  const projects = data.projects;

  if (!projects.length) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className='my-12 sm:my-20 md:my-24 lg:my-28 min-w-0'
      id='projects'
    >
      <div className='mb-6 sm:mb-8 md:mb-12'>
        <Heading index={'04'} title={"Some Things I've Built"} />
      </div>
      {projects?.map((item, index) => (
        <a key={item.id} href={item.link} target='_blank' rel='noreferrer'>
          <div
            className='relative md:hidden mb-10 sm:mb-16 rounded h-full duration-200'
            style={{ backgroundImage: `url(${item.img})` }}
          >
            <div className='py-6 px-4 sm:py-8 sm:px-6 justify-center flex flex-col bg-light_navy bg-opacity-80 rounded hover:drop-shadow-2xl'>
              <a href={item.link} target='_blank' rel='noreferrer'>
                <div className='font-bold text-off_white mb-2 text-xl sm:text-2xl md:text-3xl hover:text-primary cursor-pointer duration-200'>
                  {item.name}
                </div>
              </a>
              <div className='text-lightest_slate my-4 rounded shadow-lg'>{item.description}</div>
              <div className='flex gap-3 my-2 flex-wrap'>
                {item?.tech_used?.map((tech, i) => (
                  <div key={i} className='font-mono text-lightest_slate'>
                    {tech}
                  </div>
                ))}
              </div>
              <div className='flex text-xl gap-3 mt-5'>
                {item.git_link && (
                  <a href={item.git_link} target='_blank' rel='noreferrer'>
                    <FiGithub className='hover:text-primary cursor-pointer duration-200' />
                  </a>
                )}
                <a href={item.link} target='_blank' rel='noreferrer'>
                  <FiLink className='hover:text-primary cursor-pointer duration-200' />
                </a>
              </div>
            </div>
          </div>
        </a>
      ))}
      {projects?.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`md:flex hidden items-center my-16 lg:my-20 min-w-0 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}
        >
          <div className='z-1 relative min-w-0 max-w-full'>
            <img src={item.img} alt={`${item.name} Preview`} className='rounded max-w-full h-auto' loading='lazy' />
            <a href={item.link} target='_blank' rel='noreferrer'>
              <div className='duration-300 bg-primary absolute inset-0 opacity-[40%] rounded hover:opacity-0 cursor-pointer'></div>
            </a>
          </div>
          <div
            className={`relative w-full max-w-[480px] z-10 min-w-0 ${index % 2 !== 0 ? 'lg:translate-x-10' : 'lg:-translate-x-10'}`}
          >
            <a href={item.link} target='_blank' rel='noreferrer'>
              <div
                className={`font-bold text-off_white relative mb-8 text-3xl ${
                  index % 2 !== 0 ? '' : 'text-right'
                } hover:text-primary cursor-pointer duration-200`}
              >
                {item.name}
              </div>
            </a>
            <div
              className={`duration-200 bg-light_navy p-6 z-10 text-lightest_slate ${
                index % 2 !== 0 ? '' : 'text-right'
              } my-4 rounded shadow-lg hover:shadow-2xl`}
            >
              {item.description}
            </div>
            <div
              className={`flex gap-3 ${index % 2 !== 0 ? '' : 'justify-end'} my-2`}
            >
              {item?.tech_used?.map((tech, i) => (
                <div key={i} className='whitespace-nowrap font-mono text-lightest_slate'>
                  {tech}
                </div>
              ))}
            </div>
            <div className={`flex text-xl gap-3 ${index % 2 !== 0 ? '' : 'justify-end'}`}>
              {item.git_link && (
                <a href={item.git_link} target='_blank' rel='noreferrer'>
                  <FiGithub className='hover:text-primary cursor-pointer duration-200' />
                </a>
              )}
              <a href={item.link} target='_blank' rel='noreferrer'>
                <FiLink className='hover:text-primary cursor-pointer duration-200' />
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Projects;
