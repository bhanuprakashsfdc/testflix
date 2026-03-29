import { useState, useEffect, useRef, useCallback } from 'react';
import { Movie } from '../data/movies';
import MovieCard from '../components/MovieCard';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMovies } from '../context/MovieContext';
import { getMyListMovies } from '../utils/watchHistory';
import { ListVideo } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function MyList() {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const myListMovies = getMyListMovies(movies);
  const hasMore = displayedCount < myListMovies.length;

  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [movies.length]);

  // Infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, myListMovies.length));
        setIsLoadingMore(false);
      }, 400);
    }
  }, [hasMore, isLoadingMore, myListMovies.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
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
    <main id="main-content" className="pt-20 md:pt-28 pb-20 md:pb-24 px-4 md:px-12 min-h-screen">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-white">
          My List
        </h1>
        <p className="text-neutral-500 mt-1.5 text-sm md:text-base">
          {myListMovies.length} {myListMovies.length === 1 ? 'item' : 'items'} saved
        </p>
      </header>

      {myListMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-10">
            {myListMovies.slice(0, displayedCount).map((movie) => (
              <div key={movie.id} className="flex flex-col gap-2">
                <MovieCard
                  movie={movie}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                />
                <div className="px-0.5">
                  <h3 className="font-headline font-bold text-xs md:text-sm text-white truncate">
                    {movie.title}
                  </h3>
                  <p className="font-body text-[10px] md:text-xs text-neutral-500 mt-0.5">
                    {movie.year} · {movie.rating} · {movie.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loaderRef} className="py-8 flex justify-center">
              {isLoadingMore ? (
                <div className="w-8 h-8 border-2 border-neutral-700 border-t-primary rounded-full animate-spin" />
              ) : (
                <div className="h-10" />
              )}
            </div>
          )}

          {!hasMore && myListMovies.length > ITEMS_PER_PAGE && (
            <div className="py-8 text-center text-neutral-600 text-sm">
              You've reached the end of your list
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container mx-auto mb-6 flex items-center justify-center">
            <ListVideo className="w-10 h-10 text-neutral-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your list is empty</h2>
          <p className="text-neutral-500 text-sm max-w-sm mx-auto">
            Browse our catalog and add movies and TV shows to your list by clicking the + button.
          </p>
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
