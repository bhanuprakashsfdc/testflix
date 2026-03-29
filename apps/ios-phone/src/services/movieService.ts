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
  type: string;
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

// Google Sheets CSV URL
const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1rasahcNkL9ibMkQ2rhjIZ5-nxbNd2RU8SJ0-kWAdbo8/export?format=csv';

let movieCache: Movie[] | null = null;

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

/**
 * Normalize YouTube URL to embed format
 */
export function normalizeYoutubeUrl(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

/**
 * Extract YouTube video ID from URL
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Parse CSV text to Movie array
 */
export function parseMoviesFromCSV(csvText: string): Movie[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return {
      id: row['ID'] || '',
      title: row['Title'] || '',
      description: row['Description'] || '',
      thumbnail: row['Thumbnail'] || '',
      bannerImage: row['Banner Image'] || '',
      youtubeUrl: normalizeYoutubeUrl(row['YouTube URL'] || ''),
      videoUrl: row['Video URL'] || '',
      category: row['Category'] || '',
      type: row['Type'] || 'Movie',
      year: row['Year'] || '',
      rating: row['Rating'] || '',
      duration: row['Duration'] || '',
      matchScore: row['Match Score'] || '',
      isTop10: row['Is Top 10'] === 'TRUE',
      genres: row['Genres'] ? row['Genres'].split(',').map((g: string) => g.trim()) : [],
      cast: row['Cast'] ? row['Cast'].split(',').map((c: string) => c.trim()) : [],
      language: row['Language'] || '',
      director: row['Director'] || ''
    } as Movie;
  });
}

/**
 * Fetch movies from Google Sheets
 */
export async function fetchMovies(): Promise<Movie[]> {
  if (movieCache) {
    return movieCache;
  }

  try {
    const response = await fetch(SPREADSHEET_CSV_URL);
    const csvText = await response.text();
    movieCache = parseMoviesFromCSV(csvText);
    return movieCache;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

/**
 * Search movies by query
 */
export function searchMovies(movies: Movie[], query: string): Movie[] {
  const lowerQuery = query.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.description.toLowerCase().includes(lowerQuery) ||
    movie.genres.some(g => g.toLowerCase().includes(lowerQuery)) ||
    movie.cast.some(c => c.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get movies by type
 */
export function getMoviesByType(movies: Movie[], type: string): Movie[] {
  return movies.filter(m => m.type === type);
}

/**
 * Get trending movies (Top 10)
 */
export function getTrendingMovies(movies: Movie[]): Movie[] {
  return movies.filter(m => m.isTop10).slice(0, 10);
}

/**
 * Get movie by ID
 */
export function getMovieById(movies: Movie[], id: string): Movie | undefined {
  return movies.find(m => m.id === id);
}

/**
 * Get featured movies for banner
 */
export function getFeaturedMovies(movies: Movie[], count: number = 5): Movie[] {
  const shuffled = [...movies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}