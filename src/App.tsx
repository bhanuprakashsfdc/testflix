import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyList from './pages/MyList';
import ProfileSelection from './pages/ProfileSelection';
import Browse from './pages/Browse';
import SearchResults from './pages/SearchResults';
import MusicLibrary from './pages/MusicLibrary';
import NotFound from './pages/NotFound';
import MusicToggle from './components/MusicToggle';
import MusicPlayer from './components/MusicPlayer';
import MusicQueue from './components/MusicQueue';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';
import { AnimatePresence, motion } from 'motion/react';
import { MovieProvider } from './context/MovieContext';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Home as HomeIcon, Flame, ListVideo, User, Music as MusicIcon } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const { isMusicMode } = useMusic();

  const mobileNavItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'New & Hot', path: '/new-popular', icon: Flame },
    { label: 'Music', path: '/music', icon: MusicIcon },
    { label: 'My List', path: '/my-list', icon: ListVideo },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const showBottomPlayer = isMusicMode;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {!isProfilePage && <MusicToggle />}
      {!isProfilePage && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Home /></motion.div>} />
            <Route path="/my-list" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><MyList /></motion.div>} />
            <Route path="/profile" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }}><ProfileSelection /></motion.div>} />
            <Route path="/tv-shows" element={<Browse type="tv-shows" title="TV Shows" />} />
            <Route path="/movies" element={<Browse type="movies" title="Movies" />} />
            <Route path="/new-popular" element={<Browse type="new-popular" title="New & Popular" />} />
            <Route path="/songs" element={<Browse type="songs" title="Songs" />} />
            <Route path="/music" element={<MusicLibrary />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Footer — hidden when music mode */}
      {!isProfilePage && !isMusicMode && <Footer />}

      {/* Mobile Nav */}
      {!isProfilePage && (
        <nav
          className={`md:hidden fixed left-0 w-full z-50 flex justify-around items-center h-16 bg-background/90 backdrop-blur-xl border-t border-white/5 ${showBottomPlayer ? 'bottom-[64px]' : 'bottom-0'}`}
          aria-label="Mobile navigation"
        >
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center gap-1 min-w-[48px] py-2 transition-colors ${isActive ? 'text-white' : 'text-neutral-500'}`} aria-current={isActive ? 'page' : undefined} aria-label={item.label}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-neutral-600'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Music Player & Queue — always mounted, visibility handled internally */}
      <MusicPlayer />
      <MusicQueue />

      {/* Cookie Consent (SE-03) */}
     {/* <CookieConsent /> */}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MovieProvider>
        <MusicProvider>
          <Router>
            <AppContent />
          </Router>
        </MusicProvider>
      </MovieProvider>
    </ErrorBoundary>
  );
}
