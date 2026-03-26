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
import { Movie } from '../data/movies';
import { getContinueWatchingMovies } from '../utils/watchHistory';
import { useMovies } from '../context/MovieContext';

export default function Home() {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [continueWatching, setContinueWatching] = useState<(Movie & { progress: number })[]>([]);

  useEffect(() => {
    if (!loading) {
      setContinueWatching(getContinueWatchingMovies(movies));
    }
  }, [loading, movies]);

  const trendingMovies = movies.filter(m => m.category === 'Trending Now');
  const actionMovies = movies.filter(m => m.category === 'Action Movies');
  const topRatedMovies = movies.filter(m => m.category === 'Top Rated');
  const newPopularMovies = [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  const songMovies = movies.filter(m => m.type === 'Song' || m.type === 'Music');
  const tvShows = movies.filter(m => m.type === 'TV Show');
  const movieType = movies.filter(m => m.type === 'Movie');

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  const handleVideoEnd = (currentMovie: Movie) => {
    // Find next movie in the same category or genre
    const allMovies = [...trendingMovies, ...actionMovies, ...topRatedMovies, ...newPopularMovies, ...songMovies, ...tvShows, ...movieType];
    const currentIndex = allMovies.findIndex(m => m.id === currentMovie.id);
    if (currentIndex >= 0 && currentIndex < allMovies.length - 1) {
      const nextMovie = allMovies[currentIndex + 1];
      setSelectedMovie(nextMovie);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="relative pb-24">
      {movies.length > 0 && (
        <Banner 
          movie={movies[0]} 
          onPlay={handlePlay} 
          onInfo={handleInfo}
        />
      )}
      
      <div className="relative mt-4 z-10 space-y-4">
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
        {newPopularMovies.length > 0 && (
          <MovieRow 
            title="New & Popular" 
            movies={newPopularMovies.slice(0, 10)} 
            onPlay={handlePlay} 
            onInfo={handleInfo}
          />
        )}
        {songMovies.length > 0 && (
          <MovieRow 
            title="Songs" 
            movies={songMovies} 
            onPlay={handlePlay} 
            onInfo={handleInfo}
          />
        )}
        {tvShows.length > 0 && (
          <MovieRow 
            title="TV Shows" 
            movies={tvShows} 
            onPlay={handlePlay} 
            onInfo={handleInfo}
          />
        )}
        {movieType.length > 0 && (
          <MovieRow 
            title="Movies" 
            movies={movieType} 
            onPlay={handlePlay} 
            onInfo={handleInfo}
          />
        )}
      </div>

      <FullPlayer 
        movie={selectedMovie} 
        onClose={() => {
          setSelectedMovie(null);
          // Refresh continue watching list
          setContinueWatching(getContinueWatchingMovies(movies));
        }} 
        onVideoEnd={handleVideoEnd}
      />

      <DetailModal
        movie={selectedMovieForDetail}
        onClose={() => setSelectedMovieForDetail(null)}
        onPlay={handlePlay}
      />
    </main>
  );
}
