import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import FeaturedGrid from '../components/FeaturedGrid';
import FullPlayer from '../components/FullPlayer';
import DetailModal from '../components/DetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../data/movies';
import { getContinueWatchingMovies, saveWatchProgress, getWatchHistory } from '../utils/watchHistory';
import { useMovies } from '../context/MovieContext';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, Music, Search, ListMusic, SkipForward, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';

function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


/* =============================================
   SONG CARD — stable, no re-renders from shuffle
   ============================================= */
function SongCard({ song, list }: { key?: React.Key; song: Movie; list: Movie[] }) {
  const { currentSong, isPlaying, playSong } = useMusic();
  const active = currentSong?.id === song.id;

  return (
    <button onClick={() => playSong(song, list)} className="flex-none w-36 md:w-44 text-left group">
      <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden mb-2 shadow-lg">
        <img src={song.thumbnail} alt={song.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${active && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {active && isPlaying ? (
            <div className="flex items-end gap-0.5 h-6">
              <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer1_0.5s_ease-in-out_infinite]" />
              <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer2_0.6s_ease-in-out_infinite]" />
              <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer3_0.4s_ease-in-out_infinite]" />
              <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer4_0.7s_ease-in-out_infinite]" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 text-black fill-current ml-0.5" />
            </div>
          )}
        </div>
        {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#e50914]" />}
      </div>
      <p className={`text-sm font-medium truncate ${active ? 'text-[#e50914]' : 'text-white'}`}>{song.title}</p>
      <p className="text-xs text-neutral-500 truncate">{song.cast?.[0] || song.category}</p>
    </button>
  );
}


/* =============================================
   SONG ROW — flat list item with group hover
   ============================================= */
function SongRow({ song, index, list }: { key?: React.Key; song: Movie; index: number; list: Movie[] }) {
  const { currentSong, isPlaying, playSong, addToQueue } = useMusic();
  const active = currentSong?.id === song.id;
  const playing = active && isPlaying;

  return (
    <div
      onClick={() => playSong(song, list)}
      className={`group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-[#e50914]/10' : 'hover:bg-neutral-800/60'
      }`}
    >
      <div className="w-8 text-center flex-shrink-0">
        {playing ? (
          <div className="flex items-end justify-center gap-0.5 h-5">
            <div className="w-0.5 bg-[#e50914] rounded-full animate-[equalizer1_0.5s_ease-in-out_infinite]" />
            <div className="w-0.5 bg-[#e50914] rounded-full animate-[equalizer2_0.6s_ease-in-out_infinite]" />
            <div className="w-0.5 bg-[#e50914] rounded-full animate-[equalizer3_0.4s_ease-in-out_infinite]" />
          </div>
        ) : active ? (
          <Pause className="w-4 h-4 text-[#e50914] mx-auto" />
        ) : (
          <>
            <span className="text-sm text-neutral-500 group-hover:hidden">{index + 1}</span>
            <Play className="w-4 h-4 text-white mx-auto hidden group-hover:block" />
          </>
        )}
      </div>
      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
        <img src={song.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${active ? 'text-[#e50914]' : 'text-white'}`}>{song.title}</p>
        <p className="text-xs text-neutral-500 truncate">{song.cast?.slice(0, 2).join(', ') || song.category}</p>
      </div>
      <span className="text-xs text-neutral-600 tabular-nums">{song.duration}</span>
      <button
        onClick={e => { e.stopPropagation(); addToQueue(song); }}
        className="p-2 text-neutral-600 hover:text-[#e50914] opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-[#e50914]/10"
        aria-label="Add to queue"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


/* =============================================
   MUSIC MODE VIEW
   ============================================= */
function MusicHomeView() {
  const { songs, currentSong, isPlaying, playSong, setShowQueue, shuffle, toggleShuffle, reshuffleQueue } = useMusic();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  // Stable 10 featured songs — set ONCE on mount, only changes when songs first load
  const [featuredSongs, setFeaturedSongs] = useState<Movie[]>([]);
  const songsLengthRef = useRef(0);

  useEffect(() => {
    if (songs.length > 0 && songsLengthRef.current === 0) {
      songsLengthRef.current = songs.length;
      setFeaturedSongs(shuffleArray(songs).slice(0, 10));
    }
  }, [songs.length]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    songs.forEach(s => { if (s.category) cats.add(s.category); });
    return ['all', ...Array.from(cats)];
  }, [songs]);

  const filtered = useMemo(() => {
    let r = songs;
    if (activeCat !== 'all') r = r.filter(s => s.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(s =>
        s.title.toLowerCase().includes(q) ||
        (s.cast && s.cast.some(c => c.toLowerCase().includes(q)))
      );
    }
    return r;
  }, [songs, activeCat, search]);

  // Stable category rows — sorted alphabetically, NO random shuffle
  const rows = useMemo(() => {
    const map: Record<string, Movie[]> = {};
    songs.forEach(s => {
      const cat = s.category || 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, list]) => ({ title: cat, songs: list }));
  }, [songs]);

  const handlePlayAll = () => {
    if (filtered.length > 0) playSong(filtered[0], filtered);
  };

  return (
    <div className="min-h-screen pb-40">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[45vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e50914]/20 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#e50914] to-[#b81d24] flex items-center justify-center shadow-2xl shadow-[#e50914]/30 mb-6">
            <Music className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Music Mode</h1>
          <p className="text-neutral-400 text-sm md:text-base mb-6">{songs.length} songs available</p>
          <div className="w-full max-w-md flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#e50914]/50 transition-colors">
            <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <input type="text" placeholder="Search songs, artists..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-white placeholder:text-neutral-500 outline-none w-full text-sm" />
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="px-4 md:px-8 py-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCat === cat ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/20' : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'}`}>
            {cat === 'all' ? 'All Songs' : cat}
          </button>
        ))}
      </div>

      {/* Play All + Shuffle + Queue */}
      {filtered.length > 0 && (
        <div className="px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayAll} className="w-14 h-14 rounded-full bg-[#e50914] text-white flex items-center justify-center hover:bg-[#c40812] hover:scale-105 transition-all shadow-lg shadow-[#e50914]/30" aria-label="Play all">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>
            <div>
              <p className="text-white font-bold">{filtered.length} songs</p>
              <p className="text-xs text-neutral-500">{activeCat === 'all' ? 'All categories' : activeCat}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => shuffle ? reshuffleQueue() : toggleShuffle()} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${shuffle ? 'bg-[#e50914] text-white shadow-md shadow-[#e50914]/20' : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'}`} aria-label={shuffle ? 'Get fresh songs' : 'Enable shuffle'} aria-pressed={shuffle} title={shuffle ? 'Click for new songs' : 'Enable shuffle'}>
              <Shuffle className="w-4 h-4" /> Shuffle
            </button>
            <button onClick={() => setShowQueue(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors text-sm">
              <ListMusic className="w-4 h-4" /> Queue
            </button>
          </div>
        </div>
      )}

      {/* Featured / Playing Next — with refresh */}
      {!search.trim() && featuredSongs.length > 0 && (
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Trending Now</h2>
            <button
              onClick={() => setFeaturedSongs(shuffleArray(songs).slice(0, 10))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              aria-label="Refresh trending songs"
            >
              <Shuffle className="w-3 h-3" />
              Refresh
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {featuredSongs.map(song => (
              <SongCard key={song.id} song={song} list={featuredSongs} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {search.trim() && (
        <div className="px-4 md:px-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Search Results</h2>
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-sm py-8 text-center">No songs found for "{search}"</p>
          ) : (
            <div className="space-y-0.5">
              {filtered.slice(0, 30).map((song, i) => (
                <SongRow key={song.id} song={song} index={i} list={filtered} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Rows — stable order */}
      {!search.trim() && (
        <div className="space-y-6">
          {rows.map(row => (
            <div key={row.title}>
              <h2 className="px-4 md:px-8 text-lg font-bold text-white mb-3">{row.title}</h2>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 md:px-8 pb-2">
                {row.songs.map(song => (
                  <SongCard key={song.id} song={song} list={row.songs} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/* =============================================
   VIDEO MODE VIEW — stable, no random re-renders
   ============================================= */
function VideoHomeView() {
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
        setHeroMovie(lastWatched || movies[0]);
      } else {
        setHeroMovie(movies[0]);
      }
    }
  }, [loading, movies]);

  // STABLE rows — sorted by category, NO random shuffle
  const rows = useMemo(() => {
    if (movies.length === 0) return [];
    const trending = movies.filter(m => m.category === 'Trending Now');
    const action = movies.filter(m => m.category === 'Action Movies');
    const topRated = movies.filter(m => m.category === 'Top Rated');
    const newPopular = [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    const songs = movies.filter(m => { const t = (m.type || '').toLowerCase(); return t.includes('song') || t.includes('music'); });
    const tvShows = movies.filter(m => { const t = (m.type || '').toLowerCase(); return t.includes('tv') || t.includes('show'); });
    const movieType = movies.filter(m => { const t = (m.type || '').toLowerCase(); return t === 'movie' || t.includes('film'); });
    const comedy = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('comedy')));
    const drama = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('drama')));
    const thriller = movies.filter(m => m.genres.some(g => g.toLowerCase().includes('thriller')));
    return [
      { title: 'Trending Now', movies: trending },
      { title: 'Top Rated', movies: topRated },
      { title: 'Action Movies', movies: action },
      { title: 'New & Popular', movies: newPopular.slice(0, 15) },
      { title: 'Comedy', movies: comedy },
      { title: 'Drama', movies: drama },
      { title: 'Thriller', movies: thriller },
      { title: 'Songs', movies: songs },
      { title: 'TV Shows', movies: tvShows },
      { title: 'Movies', movies: movieType },
    ].filter(row => row.movies.length > 0);
  }, [movies]);

  // STABLE featured — just first 10 movies, no shuffle
  const featuredMovies = useMemo(() => movies.slice(0, 10), [movies]);

  // STABLE top rated — sorted by rating
  const topRatedMovies = useMemo(() => [...movies].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 10), [movies]);

  const handlePlay = (movie: Movie) => {
    setHeroMovie(movie);
    saveWatchProgress(movie.id, 0);
    setSelectedMovie(movie);
    setSelectedMovieForDetail(null);
  };

  const handleInfo = (movie: Movie) => setSelectedMovieForDetail(movie);

  const handleVideoEnd = (currentMovie: Movie) => {
    saveWatchProgress(currentMovie.id, 100);
    const songList = movies.filter(m => { const t = (m.type || '').toLowerCase(); return t.includes('song') || t.includes('music'); });
    if (songList.length > 0) {
      const randomSong = songList[Math.floor(Math.random() * songList.length)];
      setSelectedMovie(randomSong);
      saveWatchProgress(randomSong.id, 0);
      return;
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
          <MovieRow title="Continue Watching" movies={continueWatching} onPlay={handlePlay} onInfo={handleInfo} />
        )}
        {movies.filter(m => m.isTop10).length > 0 && (
          <FeaturedGrid title="Top 10 TV Shows Today" movies={movies.filter(m => m.isTop10)} onPlay={handlePlay} onInfo={handleInfo} />
        )}
        <FeaturedGrid title="Featured Today" movies={featuredMovies} onPlay={handlePlay} onInfo={handleInfo} />
        <FeaturedGrid title="Top Recommendations for You" movies={topRatedMovies} onPlay={handlePlay} onInfo={handleInfo} />
        {rows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} onPlay={handlePlay} onInfo={handleInfo} />
        ))}
      </div>
      <FullPlayer movie={selectedMovie} onClose={handlePlayerClose} onVideoEnd={handleVideoEnd} />
      <DetailModal movie={selectedMovieForDetail} onClose={() => setSelectedMovieForDetail(null)} onPlay={handlePlay} />
    </main>
  );
}


/* =============================================
   MAIN HOME — switches between modes
   ============================================= */
export default function Home() {
  const { isMusicMode } = useMusic();
  if (isMusicMode) return <MusicHomeView />;
  return <VideoHomeView />;
}
