import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Introduction from './Components/Introduction';
import LeftSidebar from './Components/LeftSidebar';
import RightSidebar from './Components/RightSidebar';
import NotFound from './Components/NotFound';

const AboutMe = lazy(() => import('./Components/AboutMe').then((m) => ({ default: m.AboutMe })));
const Experience = lazy(() => import('./Components/Experience'));
const Contributions = lazy(() => import('./Components/Contributions'));
const Projects = lazy(() => import('./Components/Projects'));
const Footer = lazy(() => import('./Components/Footer'));

function HomePage() {
  return (
    <>
      <Navbar />
      <LeftSidebar />
      <RightSidebar />
      <div className='flex flex-col items-center justify-center w-full'>
        <Introduction />
        <Suspense fallback={<div className='min-h-[400px]' />}>
          <div className='relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-20 pb-0 sm:px-6 md:px-12 md:pt-24'>
            <AboutMe />
            <Experience />
            <Contributions />
            <Projects />
            {/* Fade from Projects into footer (What's Next) - uses theme */}
            <div
              className="absolute inset-x-0 bottom-0 h-48 sm:h-64 md:h-80 pointer-events-none content-to-footer-fade"
              aria-hidden
            />
          </div>
        </Suspense>
        <Suspense fallback={<div className="min-h-[600px]" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className='custom-scrollbar'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
