/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { useMovies } from '../context/MovieContext';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);

  // Filter movies based on search query (title, genres, cast, director, category, year)
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(q) ||
      movie.genres.some(g => g.toLowerCase().includes(q)) ||
      movie.cast.some(c => c.toLowerCase().includes(q)) ||
      (movie.director && movie.director.toLowerCase().includes(q)) ||
      movie.category.toLowerCase().includes(q) ||
      movie.year.includes(q)
    );
  }, [movies, query]);

  // Group by category for OTT-style display
  const categorizedResults = useMemo(() => {
    const categories: Record<string, Movie[]> = {
      'Matching Titles': [],
      'Genres': [],
      'Cast & Crew': [],
      'Directors': [],
      'Categories': []
    };
    
    searchResults.forEach(movie => {
      // Check if title matches
      if (movie.title.toLowerCase().includes(query.toLowerCase())) {
        categories['Matching Titles'].push(movie);
      }
      // Check genres
      const matchingGenres = movie.genres.filter(g => g.toLowerCase().includes(query.toLowerCase()));
      if (matchingGenres.length > 0) {
        categories['Genres'].push(movie);
      }
      // Check cast
      const matchingCast = movie.cast.filter(c => c.toLowerCase().includes(query.toLowerCase()));
      if (matchingCast.length > 0) {
        categories['Cast & Crew'].push(movie);
      }
      // Check director
      if (movie.director && movie.director.toLowerCase().includes(query.toLowerCase())) {
        categories['Directors'].push(movie);
      }
      // Add to categories section
      categories['Categories'].push(movie);
    });
    
    // Remove duplicates from categories
    Object.keys(categories).forEach(key => {
      if (key !== 'Matching Titles') {
        categories[key] = [...new Map(categories[key].map(m => [m.id, m])).values()];
      }
    });
    
    return categories;
  }, [searchResults, query]);

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  const handleClearSearch = () => {
    navigate('/');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="pt-32 pb-24 min-h-screen">
      {/* Search Header */}
      <div className="px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-headline tracking-tight text-on-surface">
              Search Results
            </h1>
            <p className="text-on-surface-variant mt-2">
              {searchResults.length} results for "{query}"
            </p>
          </div>
          <button 
            onClick={handleClearSearch}
            className="text-on-surface-variant hover:text-white transition-colors text-sm"
          >
            Clear Search
          </button>
        </div>
      </div>

      {/* OTT-style Search Results */}
      {searchResults.length > 0 ? (
        <div className="space-y-8">
          {/* Top Results - Large Grid */}
          {categorizedResults['Matching Titles'].length > 0 && (
            <section className="px-6 md:px-12">
              <h2 className="font-headline text-xl font-bold mb-4 tracking-tight text-on-surface">
                Matching Titles
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {categorizedResults['Matching Titles'].map(movie => (
                  <div 
                    key={movie.id}
                    className="cursor-pointer group"
                    onClick={() => handlePlay(movie)}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-sm text-on-surface truncate">
                      {movie.title}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant">
                      {movie.year} • {movie.duration}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* By Category - Movie Rows */}
          {categorizedResults['Categories'].length > 0 && (
            <MovieRow 
              title="Browse by Category"
              movies={categorizedResults['Categories']}
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          )}
        </div>
      ) : (
        /* No Results */
        <div className="px-6 md:px-12 py-20 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-on-surface mb-4">
              No results found
            </h2>
            <p className="text-on-surface-variant mb-6">
              Try searching with different keywords or browse our categories
            </p>
            <button 
              onClick={handleClearSearch}
              className="px-6 py-2 bg-primary-container text-white rounded-lg hover:bg-primary-container/80 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

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