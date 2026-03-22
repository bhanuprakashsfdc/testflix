/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MOVIES } from '../data/movies';
import { fetchMoviesFromSpreadsheet } from '../services/movieService';

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(MOVIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const fetchedMovies = await fetchMoviesFromSpreadsheet();
        if (fetchedMovies.length > 0) {
          setMovies(fetchedMovies);
        }
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Failed to load movies. Using offline data.');
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, loading, error }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
}
