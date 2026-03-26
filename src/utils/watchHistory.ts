/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie } from '../data/movies';

const WATCH_HISTORY_KEY = 'testflix_watch_history';

export interface WatchProgress {
  movieId: string;
  progress: number; // 0 to 100
  lastWatched: number; // timestamp
}

export const getWatchHistory = (): WatchProgress[] => {
  const history = localStorage.getItem(WATCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const saveWatchProgress = (movieId: string, progress: number) => {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(h => h.movieId === movieId);
  
  const newEntry: WatchProgress = {
    movieId,
    progress,
    lastWatched: Date.now()
  };

  if (existingIndex > -1) {
    history[existingIndex] = newEntry;
  } else {
    history.unshift(newEntry);
  }

  // Keep only last 10
  const updatedHistory = history.sort((a, b) => b.lastWatched - a.lastWatched).slice(0, 10);
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getContinueWatchingMovies = (allMovies: Movie[]): (Movie & { progress: number })[] => {
  const history = getWatchHistory();
  return history
    .map(h => {
      const movie = allMovies.find(m => m.id === h.movieId);
      if (movie) {
        return { ...movie, progress: h.progress };
      }
      return null;
    })
    .filter((m): m is (Movie & { progress: number }) => m !== null);
};
