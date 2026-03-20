import React, { Suspense, lazy } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Introduction from './Components/Introduction';
import LeftSidebar from './Components/LeftSidebar';
import RightSidebar from './Components/RightSidebar';

const AboutMe = lazy(() => import('./Components/AboutMe').then((m) => ({ default: m.AboutMe })));
const Experience = lazy(() => import('./Components/Experience'));
const Projects = lazy(() => import('./Components/Projects'));
const Contact = lazy(() => import('./Components/Contact'));
const Footer = lazy(() => import('./Components/Footer'));

function App() {
  return (
    <div className='custom-scrollbar'>
      <Navbar />
      <LeftSidebar />
      <RightSidebar />
      <div className='flex flex-col items-center justify-center'>
        <Introduction />
        <Suspense fallback={<div className='min-h-[400px]' />}>
          <AboutMe />
          <Experience />
          <Projects />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
