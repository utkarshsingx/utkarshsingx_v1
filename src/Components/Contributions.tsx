import React, { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import 'react-github-calendar/tooltips.css';
import Heading from '../ui/Heading';
import { useTheme } from '../context/ThemeContext';
import DecryptedText from './DecryptedText';
import Shuffle from './Shuffle';
import CountUp from './CountUp';
import { contributionCalendarTheme } from '../lib/theme';

const formatTooltipDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const GITHUB_USER = 'utkarshsingx';
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

const Contributions: React.FC = () => {
  const { theme } = useTheme();
  const [totalContributions, setTotalContributions] = useState<number | null>(null);

  useEffect(() => {
    fetch(CONTRIB_API)
      .then((res) => res.json())
      .then((data) => {
        const total = data.contributions?.reduce((sum: number, a: { count: number }) => sum + a.count, 0) ?? 0;
        setTotalContributions(total);
      })
      .catch(() => setTotalContributions(0));
  }, []);

  return (
    <div className='mt-20 sm:mt-32 md:mt-44' id='contributions'>
      <Heading index={'03'} title={'My Contributions'} />
      <p className='text-lightest_slate mt-6 mb-8 text-base md:text-lg font-light max-w-2xl leading-relaxed'>
        <span className='text-primary font-medium'>When I&apos;m not answering,</span> I&apos;m probably{' '}
        <DecryptedText
          text='LOCKED-IN'
          animateOn='hover'
          speed={80}
          maxIterations={12}
          className='text-primary font-medium'
          encryptedClassName='text-primary/70 font-medium opacity-90'
        />
        . <Shuffle
          text='(jajajajaja)'
          tag='span'
          className='text-lightest_slate inline font-sans'
          triggerOnHover={true}
          triggerOnMount={false}
          triggerOnce={false}
          rootMargin='100px'
          loop={true}
          loopDelay={2000}
          shuffleDirection='right'
          duration={0.5}
          stagger={0.05}
          scrambleCharset='ja'
        />
      </p>
      <div className='contribution-calendar w-full overflow-x-auto [&_.react-activity-calendar]:!max-w-full [&_.react-activity-calendar]:!w-full'>
        <GitHubCalendar
          username={GITHUB_USER}
          colorScheme={theme}
          blockSize={12}
          blockRadius={4}
          blockMargin={4}
          showWeekdayLabels
          showTotalCount={false}
          theme={{
            dark: [...contributionCalendarTheme.dark],
            light: [...contributionCalendarTheme.light]
          }}
          tooltips={{
            activity: {
              text: (activity) =>
                activity.count === 0
                  ? `No contributions on ${formatTooltipDate(activity.date)}`
                  : `${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${formatTooltipDate(activity.date)}`,
              placement: 'top',
              withArrow: true
            }
          }}
        />
        {totalContributions !== null && (
          <p className='mt-4 text-lightest_slate text-sm md:text-base font-mono'>
            <CountUp
              to={totalContributions}
              from={0}
              duration={1.5}
              separator=','
              className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-semibold'
            />
            {' contributions in the last year'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Contributions;
