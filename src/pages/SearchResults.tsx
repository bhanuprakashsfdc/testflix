import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { useMovies } from '../context/MovieContext';
import { Search, X } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);

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

  const categorizedResults = useMemo(() => {
    const categories: Record<string, Movie[]> = {
      'Matching Titles': [],
      'By Genre': [],
      'By Cast & Crew': [],
    };

    searchResults.forEach(movie => {
      if (movie.title.toLowerCase().includes(query.toLowerCase())) {
        categories['Matching Titles'].push(movie);
      }
      const matchingGenres = movie.genres.filter(g => g.toLowerCase().includes(query.toLowerCase()));
      if (matchingGenres.length > 0) {
        categories['By Genre'].push(movie);
      }
      const matchingCast = movie.cast.filter(c => c.toLowerCase().includes(query.toLowerCase()));
      if (matchingCast.length > 0 || (movie.director && movie.director.toLowerCase().includes(query.toLowerCase()))) {
        categories['By Cast & Crew'].push(movie);
      }
    });

    // Deduplicate
    Object.keys(categories).forEach(key => {
      categories[key] = [...new Map(categories[key].map(m => [m.id, m])).values()];
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
    <main id="main-content" className="pt-20 md:pt-28 pb-20 md:pb-24 min-h-screen">
      {/* Search Header */}
      <div className="px-4 md:px-12 mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-headline tracking-tight text-white">
              Search Results
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
            </p>
          </div>
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm focus-ring rounded-md px-3 py-1.5"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {searchResults.length > 0 ? (
        <div className="space-y-8">
          {/* Matching Titles Grid */}
          {categorizedResults['Matching Titles'].length > 0 && (
            <section className="px-4 md:px-12">
              <h2 className="font-headline text-lg md:text-xl font-bold mb-4 text-white">
                Matching Titles
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {categorizedResults['Matching Titles'].map(movie => (
                  <button
                    key={movie.id}
                    className="group text-left focus-ring rounded-lg"
                    onClick={() => handlePlay(movie)}
                    aria-label={`Play ${movie.title}`}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-surface-container">
                      <img
                        src={movie.thumbnail}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-xs md:text-sm text-white truncate">
                      {movie.title}
                    </h3>
                    <p className="font-body text-[10px] md:text-xs text-neutral-500">
                      {movie.year} · {movie.duration}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Genre Results */}
          {categorizedResults['By Genre'].length > 0 && (
            <MovieRow
              title="By Genre"
              movies={categorizedResults['By Genre']}
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          )}

          {/* Cast & Crew Results */}
          {categorizedResults['By Cast & Crew'].length > 0 && (
            <MovieRow
              title="By Cast & Crew"
              movies={categorizedResults['By Cast & Crew']}
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          )}
        </div>
      ) : (
        <div className="px-4 md:px-12 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-surface-container mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              No results found
            </h2>
            <p className="text-neutral-500 text-sm mb-6">
              Try searching with different keywords or browse our categories
            </p>
            <button
              onClick={handleClearSearch}
              className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus-ring font-medium text-sm"
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
