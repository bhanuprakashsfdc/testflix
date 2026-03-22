/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyList from './pages/MyList';
import ProfileSelection from './pages/ProfileSelection';
import { AnimatePresence, motion } from 'motion/react';
import { MovieProvider } from './context/MovieContext';

function AppContent() {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-white">
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
                  transition={{ duration: 0.5 }}
                >
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/my-list" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <MyList />
                </motion.div>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProfileSelection />
                </motion.div>
              } 
            />
            {/* Fallback routes for other nav links */}
            <Route path="/tv-shows" element={<Home />} />
            <Route path="/movies" element={<Home />} />
            <Route path="/new-popular" element={<Home />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isProfilePage && <Footer />}

      {/* Mobile Bottom Nav */}
      {!isProfilePage && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe bg-neutral-950/80 backdrop-blur-lg">
          <button className="flex flex-col items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center text-neutral-500">
            <span className="material-symbols-outlined">sports_esports</span>
            <span className="text-[10px] font-medium">Games</span>
          </button>
          <button className="flex flex-col items-center justify-center text-neutral-500">
            <span className="material-symbols-outlined">video_library</span>
            <span className="text-[10px] font-medium">New & Hot</span>
          </button>
          <button className="flex flex-col items-center justify-center text-neutral-500">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-medium">My Netflix</span>
          </button>
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
