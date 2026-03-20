import React from 'react';
import Shuffle from './Shuffle';
import FallingText from './FallingText';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center dark:bg-navy light:bg-white px-4 py-16">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-8">
        <Shuffle
          text="404 Not Found"
          tag="h1"
          className="text-primary font-extrabold text-5xl md:text-7xl font-mono"
          textAlign="center"
          shuffleDirection="right"
          triggerOnMount={true}
          triggerOnHover={true}
        />
        <div className="w-full h-[350px] md:h-[500px]">
          <FallingText
            text="oops lost error page missing gone wrong whoops sorry nope nada nothing here try again elsewhere"
            trigger="auto"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="2rem"
            mouseConstraintStiffness={0.9}
            highlightClass="text-primary font-extrabold"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
