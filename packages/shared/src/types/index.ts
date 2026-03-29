/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  bannerImage: string;
  youtubeUrl: string;
  videoUrl: string;
  category: string;
  type: 'Movie' | 'TV Show' | 'Song' | string;
  year: string;
  rating: string;
  duration: string;
  matchScore: string;
  isTop10?: boolean;
  genres: string[];
  cast: string[];
  language?: string;
  director?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isKid: boolean;
}

export interface WatchHistory {
  movieId: string;
  watchedAt: number;
  progress?: number;
}

export interface AppState {
  user: User | null;
  favorites: string[];
  watchHistory: WatchHistory[];
  myList: string[];
}

export type ContentCategory = 'movies' | 'tv-shows' | 'songs' | 'new-popular';

export interface NavigationParams {
  home: undefined;
  browse: { type: ContentCategory };
  search: undefined;
  myList: undefined;
  movieDetail: { movieId: string };
  player: { movieId: string };
  profile: undefined;
}