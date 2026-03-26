/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import MovieRow from '../components/MovieRow';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { useMovies } from '../context/MovieContext';

interface BrowsePageProps {
  type: 'songs' | 'movies' | 'tv-shows' | 'new-popular' | 'all';
  title: string;
}

export default function BrowsePage({ type, title }: BrowsePageProps) {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);

  // Filter movies based on type
  const filteredMovies = useMemo(() => {
    if (type === 'all') return movies;
    
    switch (type) {
      case 'songs':
        return movies.filter(m => {
          const t = (m.type || '').toLowerCase();
          return t.includes('song') || t.includes('music') || t.includes('video');
        });
      case 'movies':
        return movies.filter(m => {
          const t = (m.type || '').toLowerCase();
          return t === 'movie' || t.includes('film');
        });
      case 'tv-shows':
        return movies.filter(m => {
          const t = (m.type || '').toLowerCase();
          return t.includes('tv') || t.includes('show') || t.includes('series');
        });
      case 'new-popular':
        // Show all content sorted by year (newest first)
        return [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
      default:
        return movies;
    }
  }, [movies, type]);

  // Group by category for display
  const categorizedMovies = useMemo(() => {
    const categories: Record<string, Movie[]> = {};
    filteredMovies.forEach(movie => {
      const cat = movie.category || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(movie);
    });
    return categories as Record<string, Movie[]>;
  }, [filteredMovies]);

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface">
          {title}
        </h1>
        <p className="text-on-surface-variant mt-2">
          {filteredMovies.length} {type === 'songs' ? 'songs' : type === 'movies' ? 'movies' : type === 'tv-shows' ? 'TV shows' : 'titles'} available
        </p>
      </header>

      {/* For Songs - show as grid */}
      {type === 'songs' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {filteredMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="cursor-pointer group"
              onClick={() => handlePlay(movie)}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-headline font-bold text-sm text-on-surface truncate">
                {movie.title}
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                {movie.year} • {movie.duration}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* For Movies/TV Shows - show as rows */}
      {(type === 'movies' || type === 'tv-shows' || type === 'new-popular') && (
        <div className="space-y-8">
          {Object.entries(categorizedMovies).map(([category, categoryMovies]: [string, Movie[]]) => (
            categoryMovies.length > 0 ? (
              <div key={category}>
                <MovieRow 
                  title={category}
                  movies={categoryMovies}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                />
              </div>
            ) : null
          ))}
          
          {/* Fallback if no category matches */}
          {Object.keys(categorizedMovies).length === 0 && filteredMovies.length > 0 && (
            <MovieRow 
              title="All"
              movies={filteredMovies}
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          )}
        </div>
      )}

      {/* Empty state */}
      {filteredMovies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-xl">No content found</p>
          <p className="text-on-surface-variant/60 mt-2">Check back later for new content</p>
        </div>
      )}

      <FullPlayer 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />

      <DetailModal
        movie={selectedMovieForDetail}
        onClose={() => setSelectedMovieForDetail(null)}
        onPlay={handlePlay}
      />
    </main>
  );
}