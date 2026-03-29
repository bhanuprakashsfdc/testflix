import { useState } from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../data/movies';
import { motion } from 'motion/react';

interface FeaturedGridProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  title: string;
}

export default function FeaturedGrid({ movies, onPlay, onInfo, title }: FeaturedGridProps) {
  const isTop10 = title.toLowerCase().includes('top 10');

  return (
    <section className="px-4 md:px-12 mb-8 md:mb-12" aria-label={title}>
      <h2 className="font-headline text-lg md:text-2xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h2>
      <div className={`grid gap-2 md:gap-3 ${
        isTop10
          ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      }`}>
        {movies.slice(0, isTop10 ? 10 : 10).map((movie, index) => (
          <motion.button
            key={movie.id}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`relative group cursor-pointer text-left focus-ring rounded-lg overflow-hidden ${
              isTop10 ? 'aspect-[2/3]' : 'aspect-[2/3]'
            }`}
            onClick={() => onInfo(movie)}
            aria-label={`${movie.title}${isTop10 ? `, ranked number ${index + 1}` : ''}`}
          >
            {/* Rank number for Top 10 - Netflix style side number */}
            {isTop10 && (
              <div className="absolute -left-1 md:-left-2 bottom-0 z-20 pointer-events-none" aria-hidden="true">
                <span className="text-[60px] md:text-[100px] font-black text-black/[0.08] leading-none select-none" style={{ WebkitTextStroke: '2px #404040' }}>
                  {index + 1}
                </span>
              </div>
            )}

            {/* Poster Image */}
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-surface-container">
              <img
                src={movie.thumbnail}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-black fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Top 10 Badge */}
              {movie.isTop10 && (
                <div className="absolute top-1.5 right-1.5 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-md z-10">
                  TOP 10
                </div>
              )}
            </div>

            {/* Title below poster */}
            <div className="mt-2 px-0.5">
              <h3 className="text-xs md:text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-neutral-500 mt-0.5">
                <span>{movie.year}</span>
                <span className="text-neutral-700">·</span>
                <span className="text-success">{movie.rating}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
