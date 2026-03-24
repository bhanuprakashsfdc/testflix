/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Play, Plus, ThumbsUp, Volume2 } from 'lucide-react';
import { Movie } from '../data/movies';
import { motion, AnimatePresence } from 'motion/react';
import MovieCard from './MovieCard';
import { useMovies } from '../context/MovieContext';

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

export default function DetailModal({ movie, onClose, onPlay }: DetailModalProps) {
  const { movies } = useMovies();
  if (!movie) return null;

  const relatedMovies = movies.filter(m => m.category === movie.category && m.id !== movie.id).slice(0, 6);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto pt-10 pb-20 px-4 scrollbar-hide"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative w-full max-w-4xl bg-neutral-900 rounded-xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 h-10 w-10 bg-neutral-900/80 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Banner Section */}
          <div className="relative aspect-video w-full">
            <img
              src={movie.bannerImage || undefined}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10">
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-lg">
                {movie.title}
              </h1>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onPlay(movie)}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded font-bold hover:bg-white/90 transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Play
                </button>
                <button className="h-12 w-12 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
                  <Plus className="w-6 h-6" />
                </button>
                <button className="h-12 w-12 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
                  <ThumbsUp className="w-6 h-6" />
                </button>
                <div className="flex-grow" />
                <button className="h-12 w-12 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3 text-lg">
                <span className="text-green-500 font-bold">{movie.matchScore}</span>
                <span className="text-neutral-400">{movie.year}</span>
                <span className="px-1.5 py-0.5 border border-neutral-600 text-xs rounded text-neutral-300">
                  {movie.rating}
                </span>
                <span className="text-neutral-400">{movie.duration}</span>
                <span className="px-1.5 py-0.5 border border-neutral-600 text-[10px] rounded text-neutral-300 font-bold">
                  HD
                </span>
              </div>
              
              <p className="text-lg text-white leading-relaxed">
                {movie.description}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-neutral-500">Cast:</span>{' '}
                <span className="text-neutral-300">{movie.cast.join(', ')}</span>
              </div>
              <div>
                <span className="text-neutral-500">Genres:</span>{' '}
                <span className="text-neutral-300">{movie.genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-neutral-500">This movie is:</span>{' '}
                <span className="text-neutral-300 italic">Exciting, Mind-bending, Visual Masterpiece</span>
              </div>
            </div>
          </div>

          {/* More Like This Section */}
          <div className="px-10 pb-10">
            <h3 className="text-2xl font-bold text-white mb-6">More Like This</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {relatedMovies.map(m => (
                <div key={m.id} className="bg-neutral-800 rounded-md overflow-hidden group cursor-pointer" onClick={() => onPlay(m)}>
                  <div className="relative aspect-video">
                    <img 
                      src={m.thumbnail || undefined} 
                      alt={m.title} 
                      loading="lazy"
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-current" />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-500 font-bold text-sm">{m.matchScore}</span>
                      <span className="px-1.5 py-0.5 border border-neutral-600 text-[10px] rounded text-neutral-300">
                        {m.rating}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs line-clamp-3">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
