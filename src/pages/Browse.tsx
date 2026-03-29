import { useState, useMemo } from 'react';
import MovieRow from '../components/MovieRow';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { useMovies } from '../context/MovieContext';
import { Play } from 'lucide-react';

interface BrowsePageProps {
  type: 'songs' | 'movies' | 'tv-shows' | 'new-popular' | 'all';
  title: string;
}

export default function BrowsePage({ type, title }: BrowsePageProps) {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);

  const filteredMovies = useMemo(() => {
    if (type === 'all') return movies;
    switch (type) {
      case 'songs':
        return movies.filter(m => {
          const t = (m.type || '').toLowerCase();
          return t.includes('song') || t.includes('music') || t.includes('video');
        });
      case 'movies':
        return movies.filter(m => {
          const t = (m.type || '').toLowerCase();
          return t === 'movie' || t.includes('film');
        });
      case 'tv-shows':
        return movies.filter(m => {
          const t = (m.type || '').toLowerCase();
          return t.includes('tv') || t.includes('show') || t.includes('series');
        });
      case 'new-popular':
        return [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
      default:
        return movies;
    }
  }, [movies, type]);

  const categorizedMovies = useMemo(() => {
    const categories: Record<string, Movie[]> = {};
    filteredMovies.forEach(movie => {
      const cat = movie.category || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(movie);
    });
    return categories;
  }, [filteredMovies]);

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main id="main-content" className="pt-20 md:pt-28 pb-20 md:pb-24 px-4 md:px-12 min-h-screen">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-white">
          {title}
        </h1>
        <p className="text-neutral-500 mt-1.5 text-sm md:text-base">
          {filteredMovies.length} {type === 'songs' ? 'songs' : type === 'movies' ? 'movies' : type === 'tv-shows' ? 'TV shows' : 'titles'} available
        </p>
      </header>

      {/* Songs Grid */}
      {type === 'songs' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-8">
          {filteredMovies.map((movie) => (
            <button
              key={movie.id}
              className="group text-left focus-ring rounded-lg"
              onClick={() => handlePlay(movie)}
              aria-label={`Play ${movie.title}`}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-surface-container">
                <img
                  src={movie.thumbnail}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="font-headline font-bold text-xs md:text-sm text-white truncate">
                {movie.title}
              </h3>
              <p className="font-body text-[10px] md:text-xs text-neutral-500 mt-0.5">
                {movie.year} · {movie.duration}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Movies/TV Shows Rows */}
      {(type === 'movies' || type === 'tv-shows' || type === 'new-popular') && (
        <div className="space-y-6 md:space-y-8">
          {(Object.entries(categorizedMovies) as [string, Movie[]][]).map(([category, categoryMovies]) => (
            categoryMovies.length > 0 ? (
              <MovieRow
                key={category}
                title={category}
                movies={categoryMovies}
                onPlay={handlePlay}
                onInfo={handleInfo}
              />
            ) : null
          ))}

          {Object.keys(categorizedMovies).length === 0 && filteredMovies.length > 0 && (
            <MovieRow
              title="All"
              movies={filteredMovies}
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredMovies.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container mx-auto mb-4 flex items-center justify-center">
            <Play className="w-8 h-8 text-neutral-600" />
          </div>
          <p className="text-neutral-400 text-lg font-medium">No content found</p>
          <p className="text-neutral-600 mt-1 text-sm">Check back later for new content</p>
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
