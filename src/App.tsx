import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import GlitchLoadingText from './Components/GlitchLoadingText';
import Introduction from './Components/Introduction';
import LeftSidebar from './Components/LeftSidebar';
import RightSidebar from './Components/RightSidebar';
import NotFound from './Components/NotFound';
import { usePortfolioDataContext } from './context/PortfolioDataContext';
import { AdminLayout } from './Components/Admin/AdminLayout';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AboutMeAdmin from './Components/Admin/AboutMeAdmin';
import ExperienceAdmin from './Components/Admin/ExperienceAdmin';
import ProjectsAdmin from './Components/Admin/ProjectsAdmin';
import ContactAdmin from './Components/Admin/ContactAdmin';
import LinksAdmin from './Components/Admin/LinksAdmin';
import ResumeAdmin from './Components/Admin/ResumeAdmin';
import ProfileAdmin from './Components/Admin/ProfileAdmin';
import SectionsAdmin from './Components/Admin/SectionsAdmin';

const AboutMe = lazy(() => import('./Components/AboutMe').then((m) => ({ default: m.AboutMe })));
const Experience = lazy(() => import('./Components/Experience'));
const Contributions = lazy(() => import('./Components/Contributions'));
const Projects = lazy(() => import('./Components/Projects'));
const Footer = lazy(() => import('./Components/Footer'));

function HomePageContent() {
  const { data, loading } = usePortfolioDataContext();
  const sections = data.siteSections;
  const isEnabled = (key: string) => sections.find((s) => s.key === key)?.enabled ?? true;

  if (loading) {
    return (
      <div className='relative mx-auto flex w-full max-w-5xl min-w-0 flex-col items-center justify-center overflow-x-hidden px-4 pt-16 pb-0 sm:px-6 sm:pt-20 md:px-12 md:pt-24 min-h-[400px]'>
        <GlitchLoadingText className='text-lightest_slate font-mono text-lg' />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className='min-h-[400px]' />}>
      <div className='relative mx-auto flex w-full max-w-5xl min-w-0 flex-col items-center overflow-x-hidden px-4 pt-16 pb-0 sm:px-6 sm:pt-20 md:px-12 md:pt-24'>
        {isEnabled('about') && <AboutMe />}
        {isEnabled('experience') && <Experience />}
        {isEnabled('contributions') && <Contributions />}
        {isEnabled('projects') && <Projects />}
        <div
          className="absolute inset-x-0 bottom-0 h-48 sm:h-64 md:h-80 pointer-events-none content-to-footer-fade"
          aria-hidden
        />
      </div>
    </Suspense>
  );
}

function HomePage() {
  return (
    <>
      <Navbar />
      <LeftSidebar />
      <RightSidebar />
      <div className='flex min-w-0 flex-col items-center justify-center w-full overflow-x-hidden'>
        <Introduction />
        <HomePageContent />
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="about" element={<AboutMeAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="links" element={<LinksAdmin />} />
            <Route path="resume" element={<ResumeAdmin />} />
            <Route path="profile" element={<ProfileAdmin />} />
            <Route path="sections" element={<SectionsAdmin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
