/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie } from '../data/movies';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
}

export default function MovieRow({ title, movies, onPlay, onInfo }: MovieRowProps) {
  return (
    <section className="px-6 md:px-12 mb-12">
      <h2 className="font-headline text-xl font-bold mb-4 tracking-tight text-on-surface">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 -mx-2 px-2">
        {movies.map((movie) => (
          <div key={movie.id}>
            <MovieCard movie={movie} onPlay={onPlay} onInfo={onInfo} />
          </div>
        ))}
      </div>
    </section>
  );
}
