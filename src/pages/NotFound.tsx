import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md"
      >
        <h1 className="text-8xl md:text-9xl font-black text-primary leading-none mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-[#e50914] text-white rounded-lg font-medium hover:bg-[#c40812] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-xs text-neutral-600 mb-3">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Movies', 'TV Shows', 'Songs', 'New & Popular', 'My List'].map(page => (
              <Link
                key={page}
                to={page === 'Movies' ? '/movies' : page === 'TV Shows' ? '/tv-shows' : page === 'Songs' ? '/songs' : page === 'New & Popular' ? '/new-popular' : '/my-list'}
                className="text-xs text-neutral-500 hover:text-white px-3 py-1.5 bg-neutral-800/50 rounded-full transition-colors"
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
