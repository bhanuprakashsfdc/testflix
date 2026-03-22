/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import { Movie } from '../data/movies';

const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1rasahcNkL9ibMkQ2rhjIZ5-nxbNd2RU8SJ0-kWAdbo8/export?format=csv';

export async function fetchMoviesFromSpreadsheet(): Promise<Movie[]> {
  try {
    const response = await fetch(SPREADSHEET_CSV_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const movies: Movie[] = results.data.map((row: any) => ({
            id: row['ID'],
            title: row['Title'],
            description: row['Description'],
            thumbnail: row['Thumbnail'],
            bannerImage: row['Banner Image'],
            youtubeUrl: row['YouTube URL'],
            category: row['Category'],
            year: row['Year'],
            rating: row['Rating'],
            duration: row['Duration'],
            matchScore: row['Match Score'],
            isTop10: row['Is Top 10'] === 'TRUE',
            genres: row['Genres'] ? row['Genres'].split(',').map((g: string) => g.trim()) : [],
            cast: row['Cast'] ? row['Cast'].split(',').map((c: string) => c.trim()) : [],
            language: row['Language']
          }));
          resolve(movies);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching movies from spreadsheet:', error);
    return [];
  }
}
