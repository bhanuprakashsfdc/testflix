/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Movie } from '../data/movies';
import MovieCard from '../components/MovieCard';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import { useMovies } from '../context/MovieContext';

export default function MyList() {
  const { movies } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  
  // For demo purposes, we'll just show all movies as "My List"
  const myListMovies = movies;

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface">
          My List
        </h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
        {myListMovies.map((movie) => (
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
