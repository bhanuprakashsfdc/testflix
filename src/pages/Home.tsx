/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOVIES, Movie } from '../data/movies';
import { getContinueWatchingMovies } from '../utils/watchHistory';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [continueWatching, setContinueWatching] = useState<(Movie & { progress: number })[]>([]);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setContinueWatching(getContinueWatchingMovies(MOVIES));
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const trendingMovies = MOVIES.filter(m => m.category === 'Trending Now');
  const actionMovies = MOVIES.filter(m => m.category === 'Action Movies');
  const topRatedMovies = MOVIES.filter(m => m.category === 'Top Rated');

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="relative pb-24">
      <Banner 
        movie={MOVIES[0]} 
        onPlay={handlePlay} 
        onInfo={handleInfo}
      />
      
      <div className="relative -mt-32 z-10 space-y-4">
        {continueWatching.length > 0 && (
          <MovieRow 
            title="Continue Watching" 
            movies={continueWatching} 
            onPlay={handlePlay} 
            onInfo={handleInfo}
          />
        )}
        <MovieRow 
          title="Trending Now" 
          movies={trendingMovies} 
          onPlay={handlePlay} 
          onInfo={handleInfo}
        />
        <MovieRow 
          title="Top Rated" 
          movies={topRatedMovies} 
          onPlay={handlePlay} 
          onInfo={handleInfo}
        />
        <MovieRow 
          title="Action Movies" 
          movies={actionMovies} 
          onPlay={handlePlay} 
          onInfo={handleInfo}
        />
      </div>

      <FullPlayer 
        movie={selectedMovie} 
        onClose={() => {
          setSelectedMovie(null);
          // Refresh continue watching list
          setContinueWatching(getContinueWatchingMovies(MOVIES));
        }} 
      />

      <DetailModal
        movie={selectedMovieForDetail}
        onClose={() => setSelectedMovieForDetail(null)}
        onPlay={handlePlay}
      />
    </main>
  );
}
