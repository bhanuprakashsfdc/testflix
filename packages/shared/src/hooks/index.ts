/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Movie, ContentCategory } from '../types';
import * as movieService from '../services/movieService';

export interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.fetchMovies();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
}

export function useSearchMovies(movies: Movie[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const searchResults = movieService.searchMovies(movies, query);
    setResults(searchResults);
  }, [query, movies]);

  return { query, setQuery, results };
}

export function useMovieCategory(movies: Movie[], category: ContentCategory) {
  return movieService.getMoviesByCategory(movies, category);
}

export function useTrendingMovies(movies: Movie[]) {
  return movieService.getTrendingMovies(movies);
}

export function useMovieDetail(movies: Movie[]) {
  return useCallback((id: string) => {
    return movieService.getMovieById(movies, id);
  }, [movies]);
}

export function useFeaturedMovies(movies: Movie[], count: number = 5) {
  return movieService.getFeaturedMovies(movies, count);
}