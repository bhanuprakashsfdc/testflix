import { useState, useMemo } from 'react';
import { Play, Pause, Search, Music, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Movie } from '../data/movies';

export default function MusicLibrary() {
  const { songs, currentSong, isPlaying, playSong, queue, addToQueue } = useMusic();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Get unique categories from songs
  const categories = useMemo(() => {
    const cats = new Set<string>();
    songs.forEach(s => { if (s.category) cats.add(s.category); });
    return ['all', ...Array.from(cats)];
  }, [songs]);

  // Filter songs
  const filteredSongs = useMemo(() => {
    let result = songs;
    if (activeCategory !== 'all') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        (s.cast && s.cast.some(c => c.toLowerCase().includes(q))) ||
        s.category.toLowerCase().includes(q) ||
        s.year.includes(q)
      );
    }
    return result;
  }, [songs, activeCategory, search]);

  const isSongPlaying = (song: Movie) => currentSong?.id === song.id && isPlaying;

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      playSong(filteredSongs[0], filteredSongs);
    }
  };

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 md:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e50914] to-[#b81d24] flex items-center justify-center shadow-lg shadow-[#e50914]/20">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Music</h1>
              <p className="text-sm text-neutral-400">{songs.length} songs available</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-neutral-800/60 border border-white/5 rounded-xl px-4 py-2.5 mb-4 focus-within:border-[#e50914]/30 transition-colors">
            <Search className="w-5 h-5 text-neutral-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search songs, artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder:text-neutral-500 outline-none w-full text-sm"
              aria-label="Search songs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#e50914] text-white shadow-md shadow-[#e50914]/20'
                    : 'bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {cat === 'all' ? 'All Songs' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Play All Bar */}
      {filteredSongs.length > 0 && (
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center hover:bg-[#c40812] hover:scale-105 transition-all shadow-lg shadow-[#e50914]/20"
              aria-label="Play all"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
            <div>
              <p className="text-white font-medium text-sm">
                {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
              </p>
              <p className="text-xs text-neutral-500">
                {activeCategory === 'all' ? 'All categories' : activeCategory}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Song List */}
      <div className="px-4 md:px-8">
        {filteredSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Music className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No songs found</p>
            <p className="text-sm text-neutral-600 mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredSongs.map((song, index) => {
              const isActive = currentSong?.id === song.id;
              const playing = isSongPlaying(song);
              return (
                <div
                  key={song.id}
                  className={`flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl group cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#e50914]/10 border border-[#e50914]/20'
                      : 'hover:bg-neutral-800/50 border border-transparent'
                  }`}
                  onClick={() => playSong(song, filteredSongs)}
                >
                  {/* Track Number / Play Icon */}
                  <div className="w-8 md:w-10 text-center flex-shrink-0">
                    {playing ? (
                      <div className="flex items-end justify-center gap-0.5 h-5">
                        <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer1_0.5s_ease-in-out_infinite]" />
                        <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer2_0.6s_ease-in-out_infinite]" />
                        <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer3_0.4s_ease-in-out_infinite]" />
                        <div className="w-1 bg-[#e50914] rounded-full animate-[equalizer4_0.7s_ease-in-out_infinite]" />
                      </div>
                    ) : isActive ? (
                      <Pause className="w-4 h-4 text-[#e50914] mx-auto" />
                    ) : (
                      <span className="text-sm text-neutral-500 group-hover:hidden">{index + 1}</span>
                    )}
                    {!playing && !isActive && (
                      <Play className="w-4 h-4 text-white mx-auto hidden group-hover:block" />
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={song.thumbnail}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm md:text-base font-medium truncate ${isActive ? 'text-[#e50914]' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs md:text-sm text-neutral-500 truncate">
                      {song.cast?.slice(0, 2).join(', ') || song.category}
                      {song.year ? ` · ${song.year}` : ''}
                    </p>
                  </div>

                  {/* Category Badge */}
                  <span className="hidden md:inline-block text-[10px] text-neutral-600 bg-neutral-800/50 px-2 py-0.5 rounded-full">
                    {song.category}
                  </span>

                  {/* Duration */}
                  <span className="text-xs md:text-sm text-neutral-500 tabular-nums min-w-[40px] text-right">
                    {song.duration}
                  </span>

                  {/* Add to Queue */}
                  <button
                    onClick={(e) => { e.stopPropagation(); addToQueue(song); }}
                    className="p-2 text-neutral-600 hover:text-[#e50914] opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-[#e50914]/10 flex-shrink-0"
                    aria-label="Add to queue"
                  >
                    <ListMusic className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
