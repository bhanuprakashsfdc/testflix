import { Movie } from '../data/movies';

const WATCH_HISTORY_KEY = 'testflix_watch_history';
const MY_LIST_KEY = 'testflix_my_list';
const LIKED_KEY = 'testflix_liked';

export interface WatchProgress {
  movieId: string;
  progress: number; // 0 to 100
  lastWatched: number; // timestamp
}

// --- Watch History ---
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

  // Keep only last 20
  const updatedHistory = history.sort((a, b) => b.lastWatched - a.lastWatched).slice(0, 20);
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getContinueWatchingMovies = (allMovies: Movie[]): (Movie & { progress: number })[] => {
  const history = getWatchHistory();
  return history
    .filter(h => h.progress > 0 && h.progress < 100)
    .map(h => {
      const movie = allMovies.find(m => m.id === h.movieId);
      if (movie) {
        return { ...movie, progress: h.progress };
      }
      return null;
    })
    .filter((m): m is (Movie & { progress: number }) => m !== null);
};

// --- My List ---
export const getMyList = (): string[] => {
  const list = localStorage.getItem(MY_LIST_KEY);
  return list ? JSON.parse(list) : [];
};

export const isInMyList = (movieId: string): boolean => {
  return getMyList().includes(movieId);
};

export const addToMyList = (movieId: string) => {
  const list = getMyList();
  if (!list.includes(movieId)) {
    list.push(movieId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
  }
};

export const removeFromMyList = (movieId: string) => {
  const list = getMyList().filter(id => id !== movieId);
  localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
};

export const getMyListMovies = (allMovies: Movie[]): Movie[] => {
  const list = getMyList();
  return allMovies.filter(m => list.includes(m.id));
};

// --- Liked ---
export const getLikedMovies = (): string[] => {
  const liked = localStorage.getItem(LIKED_KEY);
  return liked ? JSON.parse(liked) : [];
};

export const isLiked = (movieId: string): boolean => {
  return getLikedMovies().includes(movieId);
};

export const toggleLiked = (movieId: string): boolean => {
  const liked = getLikedMovies();
  if (liked.includes(movieId)) {
    const updated = liked.filter(id => id !== movieId);
    localStorage.setItem(LIKED_KEY, JSON.stringify(updated));
    return false;
  } else {
    liked.push(movieId);
    localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
    return true;
  }
};
