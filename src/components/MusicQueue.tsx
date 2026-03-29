import { useState, useMemo } from 'react';
import { Play, Pause, X, Trash2, Music, Search, SkipForward } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { motion, AnimatePresence } from 'motion/react';

function formatDuration(d: string): string {
  if (!d) return '--:--';
  return d;
}

export default function MusicQueue() {
  const {
    isMusicMode, songs, currentSong, isPlaying, showQueue, setShowQueue,
    queue, queueIndex, playSong, removeFromQueue, addToQueue
  } = useMusic();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'queue' | 'browse'>('queue');

  const filteredSongs = useMemo(() => {
    if (!search.trim()) return songs;
    const q = search.toLowerCase();
    return songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.cast && s.cast.some(c => c.toLowerCase().includes(q))) ||
      s.category.toLowerCase().includes(q)
    );
  }, [songs, search]);

  // Hide completely when music mode is off — AFTER all hooks
  if (!isMusicMode) return null;

  return (
    <AnimatePresence>
      {showQueue && (
        <>
          {/* Backdrop */}
          <motion.div
            key="queue-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[205] bg-black/50"
            onClick={() => setShowQueue(false)}
          />
          {/* Panel */}
          <motion.div
            key="queue-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 z-[210] bg-neutral-900/98 backdrop-blur-xl border-l border-white/5 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
              <div className="flex gap-1">
                <button
                  onClick={() => setTab('queue')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    tab === 'queue' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Queue
                </button>
                <button
                  onClick={() => setTab('browse')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    tab === 'browse' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Browse
                </button>
              </div>
              <button
                onClick={() => setShowQueue(false)}
                className="p-2 text-neutral-400 hover:text-white transition-colors rounded-md"
                aria-label="Close queue"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search (Browse tab) */}
            {tab === 'browse' && (
              <div className="p-3 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-neutral-500 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {tab === 'queue' ? (
                <div className="p-2">
                  {queue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                      <Music className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-sm">Queue is empty</p>
                      <p className="text-xs text-neutral-600 mt-1">Browse and add songs to your queue</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {queue.map((song, index) => {
                        const isCurrent = index === queueIndex;
                        return (
                          <div
                            key={`${song.id}-${index}`}
                            className={`group flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                              isCurrent ? 'bg-[#e50914]/10' : 'hover:bg-neutral-800'
                            }`}
                            onClick={() => playSong(song, queue)}
                          >
                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative">
                              <img src={song.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              {isCurrent && isPlaying && (
                                <div className="absolute inset-0 bg-black/50 flex items-end justify-center gap-0.5 pb-1">
                                  <div className="w-0.5 bg-[#e50914] animate-[equalizer1_0.5s_ease-in-out_infinite]" />
                                  <div className="w-0.5 bg-[#e50914] animate-[equalizer2_0.6s_ease-in-out_infinite]" />
                                  <div className="w-0.5 bg-[#e50914] animate-[equalizer3_0.4s_ease-in-out_infinite]" />
                                </div>
                              )}
                              {isCurrent && !isPlaying && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Pause className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isCurrent ? 'text-[#e50914] font-medium' : 'text-white'}`}>
                                {song.title}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {song.cast?.[0] || song.category}
                              </p>
                            </div>
                            <span className="text-xs text-neutral-600 tabular-nums">{formatDuration(song.duration)}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeFromQueue(index); }}
                              className="p-1 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              aria-label="Remove from queue"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2">
                  {filteredSongs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                      <Search className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-sm">No songs found</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {filteredSongs.map((song) => {
                        const isCurrent = currentSong?.id === song.id;
                        return (
                          <div
                            key={song.id}
                            className={`group flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                              isCurrent ? 'bg-[#e50914]/10' : 'hover:bg-neutral-800'
                            }`}
                            onClick={() => playSong(song)}
                          >
                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative">
                              <img src={song.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              {isCurrent && isPlaying && (
                                <div className="absolute inset-0 bg-black/50 flex items-end justify-center gap-0.5 pb-1">
                                  <div className="w-0.5 bg-[#e50914] animate-[equalizer1_0.5s_ease-in-out_infinite]" />
                                  <div className="w-0.5 bg-[#e50914] animate-[equalizer2_0.6s_ease-in-out_infinite]" />
                                  <div className="w-0.5 bg-[#e50914] animate-[equalizer3_0.4s_ease-in-out_infinite]" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isCurrent ? 'text-[#e50914] font-medium' : 'text-white'}`}>
                                {song.title}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {song.cast?.[0] || song.category} · {song.year}
                              </p>
                            </div>
                            <span className="text-xs text-neutral-600 tabular-nums">{formatDuration(song.duration)}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); addToQueue(song); }}
                              className="p-1.5 text-neutral-600 hover:text-[#e50914] opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-[#e50914]/10"
                              aria-label="Add to queue"
                            >
                              <SkipForward className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {tab === 'queue' && queue.length > 0 && (
              <div className="p-3 border-t border-white/5 text-center flex-shrink-0">
                <p className="text-xs text-neutral-500">{queue.length} songs · Playing #{queueIndex + 1}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
