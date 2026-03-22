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
const GitCityPage = lazy(() => import('./pages/GitCityPage'));

const SECTION_KEYS = ['about', 'experience', 'contributions', 'projects'] as const;

function HomePageContent() {
  const { data, loading } = usePortfolioDataContext();
  const siteSections = data?.siteSections ?? [];

  if (loading) {
    return (
      <div className='relative mx-auto flex w-full max-w-5xl min-w-0 flex-col items-center justify-center overflow-x-hidden px-4 pt-16 pb-0 sm:px-6 sm:pt-20 md:px-12 md:pt-24 min-h-[400px]'>
        <GlitchLoadingText className='text-lightest_slate font-mono text-lg' />
      </div>
    );
  }

  const enabledOrdered = SECTION_KEYS
    .map((key) => siteSections.find((s) => s.key === key))
    .filter((s): s is NonNullable<typeof s> => !!s && s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Suspense fallback={<div className='min-h-[400px]' />}>
      <div className='relative mx-auto flex w-full max-w-5xl min-w-0 flex-col items-center overflow-x-hidden px-4 pt-16 pb-0 sm:px-6 sm:pt-20 md:px-12 md:pt-24'>
        {enabledOrdered.map((section, i) => {
          const index = String(i + 1).padStart(2, '0');
          switch (section.key) {
            case 'about':
              return <AboutMe key="about" sectionIndex={index} />;
            case 'experience':
              return <Experience key="experience" sectionIndex={index} />;
            case 'contributions':
              return <Contributions key="contributions" sectionIndex={index} />;
            case 'projects':
              return <Projects key="projects" sectionIndex={index} />;
            default:
              return null;
          }
        })}
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
          <Route path="/git-city" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]"><p className="font-mono text-lightest_slate">Loading Git City...</p></div>}><GitCityPage /></Suspense>} />
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
