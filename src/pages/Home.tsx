import { useState, useEffect, useMemo } from 'react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import FeaturedGrid from '../components/FeaturedGrid';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { getContinueWatchingMovies, saveWatchProgress, getWatchHistory } from '../utils/watchHistory';
import { useMovies } from '../context/MovieContext';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const { movies, loading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [continueWatching, setContinueWatching] = useState<(Movie & { progress: number })[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!loading && movies.length > 0) {
      setContinueWatching(getContinueWatchingMovies(movies));

      const history = getWatchHistory();
      if (history.length > 0) {
        const lastWatched = movies.find(m => m.id === history[0].movieId);
        setHeroMovie(lastWatched || movies[Math.floor(Math.random() * movies.length)]);
      } else {
        setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
    }
  }, [loading, movies]);

  const shuffledRows = useMemo(() => {
    if (movies.length === 0) return [];

    const trending = movies.filter(m => m.category === 'Trending Now');
    const action = movies.filter(m => m.category === 'Action Movies');
    const topRated = movies.filter(m => m.category === 'Top Rated');
    const newPopular = [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    const songs = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t.includes('song') || t.includes('music');
    });
    const tvShows = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t.includes('tv') || t.includes('show');
    });
    const movieType = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t === 'movie' || t.includes('film');
    });
    const comedy = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('comedy')));
    const drama = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('drama')));
    const thriller = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('thriller')));

    const rows: { title: string; movies: Movie[] }[] = [
      { title: 'Trending Now', movies: shuffleArray(trending) },
      { title: 'Top Rated', movies: shuffleArray(topRated) },
      { title: 'Action Movies', movies: shuffleArray(action) },
      { title: 'New & Popular', movies: newPopular.slice(0, 15) },
      { title: 'Comedy', movies: shuffleArray(comedy) },
      { title: 'Drama', movies: shuffleArray(drama) },
      { title: 'Thriller', movies: shuffleArray(thriller) },
      { title: 'Songs', movies: shuffleArray(songs) },
      { title: 'TV Shows', movies: shuffleArray(tvShows) },
      { title: 'Movies', movies: shuffleArray(movieType) },
    ].filter(row => row.movies.length > 0);

    return shuffleArray(rows);
  }, [movies]);

  const handlePlay = (movie: Movie) => {
    setHeroMovie(movie);
    saveWatchProgress(movie.id, 0);
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovieForDetail(movie);
  };

  const handleVideoEnd = (currentMovie: Movie) => {
    saveWatchProgress(currentMovie.id, 100);

    // Pick a random song to play next
    const songs = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t.includes('song') || t.includes('music');
    });

    if (songs.length > 0) {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      setSelectedMovie(randomSong);
      saveWatchProgress(randomSong.id, 0);
      return;
    }

    // Fallback: pick next movie if no songs available
    const allMovies: Movie[] = [];
    shuffledRows.forEach(row => {
      row.movies.forEach(m => {
        if (!allMovies.find(x => x.id === m.id)) {
          allMovies.push(m);
        }
      });
    });

    const currentIndex = allMovies.findIndex(m => m.id === currentMovie.id);
    if (currentIndex >= 0 && currentIndex < allMovies.length - 1) {
      setSelectedMovie(allMovies[currentIndex + 1]);
      saveWatchProgress(allMovies[currentIndex + 1].id, 0);
    }
  };

  const handlePlayerClose = () => {
    setSelectedMovie(null);
    setContinueWatching(getContinueWatchingMovies(movies));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main id="main-content" className="relative pb-20 md:pb-24">
      {movies.length > 0 && heroMovie && (
        <Banner movie={heroMovie} onPlay={handlePlay} onInfo={handleInfo} />
      )}

      <div className="relative -mt-16 md:-mt-24 z-10 space-y-2 md:space-y-4">
        {continueWatching.length > 0 && (
          <MovieRow
            title="Continue Watching"
            movies={continueWatching}
            onPlay={handlePlay}
            onInfo={handleInfo}
          />
        )}

        {/* Top 10 */}
        {movies.filter(m => m.isTop10).length > 0 && (
          <FeaturedGrid
            title="Top 10 TV Shows Today"
            movies={movies.filter(m => m.isTop10)}
            onPlay={handlePlay}
            onInfo={handleInfo}
          />
        )}

        {/* Featured */}
        <FeaturedGrid
          title="Featured Today"
          movies={shuffleArray([...movies]).slice(0, 10)}
          onPlay={handlePlay}
          onInfo={handleInfo}
        />

        {/* Director Spotlight */}
        {(() => {
          const directors = [...new Set(movies.filter(m => m.director).map(m => m.director))];
          const randomDirector = directors.length > 0 ? directors[Math.floor(Math.random() * directors.length)] : null;
          if (randomDirector) {
            const directorMovies = movies.filter(m => m.director === randomDirector);
            if (directorMovies.length > 2) {
              return (
                <FeaturedGrid
                  title={`Films by ${randomDirector}`}
                  movies={directorMovies}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                />
              );
            }
          }
          return null;
        })()}

        {/* Top Recommendations */}
        <FeaturedGrid
          title="Top Recommendations for You"
          movies={[...movies].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 10)}
          onPlay={handlePlay}
          onInfo={handleInfo}
        />

        {/* Dynamic Category Rows */}
        {shuffledRows.map((row) => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            onPlay={handlePlay}
            onInfo={handleInfo}
          />
        ))}
      </div>

      <FullPlayer
        movie={selectedMovie}
        onClose={handlePlayerClose}
        onVideoEnd={handleVideoEnd}
      />

      <DetailModal
        movie={selectedMovieForDetail}
        onClose={() => setSelectedMovieForDetail(null)}
        onPlay={handlePlay}
      />
    </main>
  );
}
