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
  category: string;
  year: string;
  rating: string;
  duration: string;
  matchScore: string;
  isTop10?: boolean;
  genres: string[];
  cast: string[];
  language?: string;
}

export const MOVIES: Movie[] = [];
