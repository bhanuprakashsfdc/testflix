import { useState, useCallback } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../data/movies';

interface FeaturedGridProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  title: string;
}

const PAGE_SIZE = 4;

export default function FeaturedGrid({ movies, onPlay, onInfo, title }: FeaturedGridProps) {
  const isTop10 = title.toLowerCase().includes('top 10');
  const [page, setPage] = useState(0);

  // Top 10 keeps showing all items — no pagination
  const displayMovies = isTop10 ? movies.slice(0, 10) : movies;
  const totalPages = isTop10 ? 1 : Math.ceil(displayMovies.length / PAGE_SIZE);
  const pagedMovies = isTop10
    ? displayMovies
    : displayMovies.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goNext = useCallback(() => {
    if (canNext) setPage(p => p + 1);
  }, [canNext]);

  const goPrev = useCallback(() => {
    if (canPrev) setPage(p => p - 1);
  }, [canPrev]);

  return (
    <section className="px-4 md:px-12 mb-8 md:mb-12" aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline text-lg md:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        {!isTop10 && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 mr-1">{page + 1}/{totalPages}</span>
            <button
              onClick={goPrev}
              disabled={!canPrev}
              className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              disabled={!canNext}
              className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className={`grid gap-2 md:gap-3 ${
        isTop10
          ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
          : 'grid-cols-2 md:grid-cols-4'
      }`}>
        {pagedMovies.map((movie, index) => {
          const globalIndex = isTop10 ? index : page * PAGE_SIZE + index;
          return (
            <button
              key={movie.id}
              className="relative group cursor-pointer text-left rounded-lg overflow-hidden focus-ring"
              onClick={() => onInfo(movie)}
              aria-label={`${movie.title}${isTop10 ? `, ranked number ${globalIndex + 1}` : ''}`}
            >
              {/* Rank number for Top 10 */}
              {isTop10 && (
                <div className="absolute -left-1 md:-left-2 bottom-0 z-20 pointer-events-none" aria-hidden="true">
                  <span className="text-[60px] md:text-[100px] font-black text-black/[0.08] leading-none select-none" style={{ WebkitTextStroke: '2px #404040' }}>
                    {globalIndex + 1}
                  </span>
                </div>
              )}

              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-neutral-800">
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

                {movie.isTop10 && (
                  <div className="absolute top-1.5 right-1.5 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-md z-10">
                    TOP 10
                  </div>
                )}
              </div>

              {/* Title */}
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
            </button>
          );
        })}
      </div>
    </section>
  );
}
