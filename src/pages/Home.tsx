/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import FeaturedGrid from '../components/FeaturedGrid';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { getContinueWatchingMovies, saveWatchProgress, getWatchHistory } from '../utils/watchHistory';
import { useMovies } from '../context/MovieContext';

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [continueWatching, setContinueWatching] = useState<(Movie & { progress: number })[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  // Initialize on mount - load from cache or random
  useEffect(() => {
    if (!loading && movies.length > 0) {
      // Load continue watching from localStorage
      setContinueWatching(getContinueWatchingMovies(movies));
      
      // Check if there's a last viewed movie for hero
      const history = getWatchHistory();
      if (history.length > 0) {
        const lastWatched = movies.find(m => m.id === history[0].movieId);
        if (lastWatched) {
          setHeroMovie(lastWatched);
        } else {
          setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
        }
      } else {
        // Random hero on first visit
        setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
    }
  }, [loading, movies]);

  // Shuffled categories for variety on each visit
  const shuffledRows = useMemo(() => {
    if (movies.length === 0) return [];
    
    // Group movies by different criteria
    const trending = movies.filter(m => m.category === 'Trending Now');
    const action = movies.filter(m => m.category === 'Action Movies');
    const topRated = movies.filter(m => m.category === 'Top Rated');
    const newPopular = [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    const songs = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t.includes('song') || t.includes('music');
    });
    const tvShows = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t.includes('tv') || t.includes('show');
    });
    const movieType = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t === 'movie' || t.includes('film');
    });
    const comedy = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('comedy')));
    const drama = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('drama')));
    const thriller = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('thriller')));
    
    // Create row definitions with shuffled order
    const rows = [
      { title: 'Trending Now', movies: shuffleArray(trending) },
      { title: 'Top Rated', movies: shuffleArray(topRated) },
      { title: 'Action Movies', movies: shuffleArray(action) },
      { title: 'New & Popular', movies: newPopular.slice(0, 15) },
      { title: 'Comedy', movies: shuffleArray(comedy) },
      { title: 'Drama', movies: shuffleArray(drama) },
      { title: 'Thriller', movies: shuffleArray(thriller) },
      { title: 'Songs', movies: shuffleArray(songs) },
      { title: 'TV Shows', movies: shuffleArray(tvShows) },
      { title: 'Movies', movies: shuffleArray(movieType) },
    ].filter(row => row.movies.length > 0);
    
    // Shuffle the rows themselves
    return shuffleArray(rows);
  }, [movies]);

  const handlePlay = (movie: Movie) => {
    // Update hero to show this movie
    setHeroMovie(movie);
    // Save watch progress
    saveWatchProgress(movie.id, 0);
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  const handleVideoEnd = (currentMovie: Movie) => {
    // Find next movie from shuffled rows
    const allMovies: Movie[] = [];
    shuffledRows.forEach(row => {
      row.movies.forEach(m => {
        if (!allMovies.find(x => x.id === m.id)) {
          allMovies.push(m);
        }
      });
    });
    
    const currentIndex = allMovies.findIndex(m => m.id === currentMovie.id);
    if (currentIndex >= 0 && currentIndex < allMovies.length - 1) {
      setSelectedMovie(allMovies[currentIndex + 1]);
      // Save progress
      saveWatchProgress(currentMovie.id, 100);
      saveWatchProgress(allMovies[currentIndex + 1].id, 0);
    }
  };

  // Update continue watching when player closes
  const handlePlayerClose = () => {
    setSelectedMovie(null);
    // Refresh continue watching
    setContinueWatching(getContinueWatchingMovies(movies));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="relative pb-24">
      {movies.length > 0 && heroMovie && (
        <Banner 
          movie={heroMovie} 
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
        
        {/* Top 10 Grid - Only movies with isTop10 flag */}
        {movies.filter(m => m.isTop10).length > 0 && (
          <FeaturedGrid 
            title="Top 10" 
            movies={movies.filter(m => m.isTop10)} 
            onPlay={handlePlay} 
            onInfo={handleInfo}
          />
        )}
        
        {/* Hero/Featured Grid - Random selection */}
        <FeaturedGrid 
          title="Featured" 
          movies={shuffleArray([...movies]).slice(0, 10)} 
          onPlay={handlePlay} 
          onInfo={handleInfo}
        />
        
        {/* Director Grid - Group by director */}
        {(() => {
          const directors = [...new Set(movies.filter(m => m.director).map(m => m.director))];
          const randomDirector = directors.length > 0 ? directors[Math.floor(Math.random() * directors.length)] : null;
          if (randomDirector) {
            const directorMovies = movies.filter(m => m.director === randomDirector);
            if (directorMovies.length > 2) {
              return (
                <FeaturedGrid 
                  title={`Films by ${randomDirector}`} 
                  movies={directorMovies} 
                  onPlay={handlePlay} 
                  onInfo={handleInfo}
                />
              );
            }
          }
          return null;
        })()}
        
        {/* Top Recommendations - Based on rating */}
        <FeaturedGrid 
          title="Top Recommendations" 
          movies={[...movies].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 10)} 
          onPlay={handlePlay} 
          onInfo={handleInfo}
        />
        
        {/* Dynamic shuffled rows */}
        {shuffledRows.map((row) => (
          <div key={row.title}>
            <MovieRow 
              title={row.title}
              movies={row.movies}
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          </div>
        ))}
      </div>

      <FullPlayer 
        movie={selectedMovie} 
        onClose={handlePlayerClose} 
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
