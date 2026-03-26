/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Movie } from '../data/movies';
import MovieCard from '../components/MovieCard';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMovies } from '../context/MovieContext';

const ITEMS_PER_PAGE = 12;

export default function MyList() {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // For demo purposes, we'll just show all movies as "My List"
  const myListMovies = movies;
  const hasMore = displayedCount < myListMovies.length;

  // Reset displayed count when movies change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [movies.length]);

  // Infinite scroll using Intersection Observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate loading delay
      setTimeout(() => {
        setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, myListMovies.length));
        setIsLoadingMore(false);
      }, 500);
    }
  }, [hasMore, isLoadingMore, myListMovies.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

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
          My List
        </h1>
        <p className="text-on-surface-variant mt-2">
          {myListMovies.length} items saved
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
        {myListMovies.slice(0, displayedCount).map((movie) => (
          <div key={movie.id} className="flex flex-col gap-3">
            <MovieCard 
              movie={movie} 
              onPlay={handlePlay} 
              onInfo={handleInfo}
            />
            <div>
              <h3 className="font-headline font-bold text-sm text-on-surface truncate">
                {movie.title}
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                {movie.year} • {movie.rating} • {movie.duration}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator / infinite scroll trigger */}
      {hasMore && (
        <div ref={loaderRef} className="py-8 flex justify-center">
          {isLoadingMore ? (
            <LoadingSpinner />
          ) : (
            <div className="h-10" /> // Invisible trigger area
          )}
        </div>
      )}

      {!hasMore && myListMovies.length > 0 && (
        <div className="py-8 text-center text-on-surface-variant">
          You've reached the end of your list
        </div>
      )}

      {myListMovies.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-on-surface-variant text-xl">Your list is empty</p>
          <p className="text-on-surface-variant/60 mt-2">Add movies to see them here</p>
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
