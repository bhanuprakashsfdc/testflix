import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyList from './pages/MyList';
import ProfileSelection from './pages/ProfileSelection';
import Browse from './pages/Browse';
import SearchResults from './pages/SearchResults';
import { AnimatePresence, motion } from 'motion/react';
import { MovieProvider } from './context/MovieContext';
import { Home as HomeIcon, Flame, ListVideo, User } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  const mobileNavItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'New & Hot', path: '/new-popular', icon: Flame },
    { label: 'My List', path: '/my-list', icon: ListVideo },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Skip to Main Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {!isProfilePage && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.div key={location.pathname}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/my-list"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <MyList />
                </motion.div>
              }
            />
            <Route
              path="/profile"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProfileSelection />
                </motion.div>
              }
            />
            <Route path="/tv-shows" element={<Browse type="tv-shows" title="TV Shows" />} />
            <Route path="/movies" element={<Browse type="movies" title="Movies" />} />
            <Route path="/new-popular" element={<Browse type="new-popular" title="New & Popular" />} />
            <Route path="/songs" element={<Browse type="songs" title="Songs" />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isProfilePage && <Footer />}

      {/* Mobile Bottom Navigation */}
      {!isProfilePage && (
        <nav
          className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe bg-background/90 backdrop-blur-xl border-t border-white/5"
          aria-label="Mobile navigation"
        >
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 transition-colors focus-ring rounded-md ${
                  isActive ? 'text-white' : 'text-neutral-500'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-neutral-600'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <Router>
        <AppContent />
      </Router>
    </MovieProvider>
  );
}
