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
const Projects = lazy(() => import('./Components/Projects'));
const Contact = lazy(() => import('./Components/Contact'));
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
          <div className='mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-24 pb-8 md:px-12'>
            <AboutMe />
            <Experience />
            <Projects />
            <Contact />
            <Footer />
          </div>
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
