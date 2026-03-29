import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1,
  ListMusic, Heart, ChevronUp, ChevronDown, Shuffle, Music
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { motion, AnimatePresence } from 'motion/react';

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const {
    isMusicMode, currentSong, isPlaying, currentTime, duration,
    volume, isMuted, togglePlay, playNext, playPrev,
    seek, setVolume, toggleMute, showQueue, setShowQueue,
    queue, queueIndex, shuffle, toggleShuffle, reshuffleQueue,
  } = useMusic();

  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const bottomSeekRef = useRef<HTMLDivElement>(null);
  const expandedSeekRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const makeSeekHandler = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || duration === 0) return;
      const rect = ref.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      seek((x / rect.width) * duration);
    };
  }, [duration, seek]);

  const makeDragHandler = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    return (e: React.MouseEvent) => {
      if (duration === 0) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      seek((x / rect.width) * duration);

      const onMove = (me: MouseEvent) => {
        const r = ref.current?.getBoundingClientRect();
        if (r && duration > 0) {
          const mx = Math.max(0, Math.min(me.clientX - r.left, r.width));
          seek((mx / r.width) * duration);
        }
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };
  }, [duration, seek]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  }, [setVolume]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  // Hide completely when music mode is off
  if (!isMusicMode) return null;

  // Placeholder when no song
  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-neutral-900/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center h-16 md:h-20 px-4 md:px-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <Music className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-neutral-400 font-medium">Music Mode Active</p>
              <p className="text-xs text-neutral-600">Select a song to start playing</p>
            </div>
          </div>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-md transition-colors ${showQueue ? 'text-[#e50914] bg-[#e50914]/10' : 'text-neutral-400 hover:text-white'}`}
            aria-label="Toggle queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Expanded Now Playing */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="now-playing-expanded"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[250] bg-neutral-950 flex flex-col items-center justify-center p-6 md:p-10"
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
              aria-label="Collapse player"
            >
              <ChevronDown className="w-8 h-8" />
            </button>

            {/* Album Art */}
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl mb-8 relative">
              <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="text-center mb-6 max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white truncate">{currentSong.title}</h2>
              <p className="text-neutral-400 text-lg mt-1">{currentSong.cast?.[0] || currentSong.category}</p>
            </div>

            {/* Progress */}
            <div className="w-full max-w-md mb-6">
              <div
                ref={expandedSeekRef}
                className="relative h-1.5 bg-neutral-700 rounded-full cursor-pointer group"
                onClick={makeSeekHandler(expandedSeekRef)}
                onMouseDown={makeDragHandler(expandedSeekRef)}
              >
                <div className="absolute top-0 left-0 h-full bg-[#e50914] rounded-full" style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 8px)` }} />
              </div>
              <div className="flex justify-between text-xs text-neutral-500 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8">
              <button onClick={() => shuffle ? reshuffleQueue() : toggleShuffle()} className={`transition-colors ${shuffle ? 'text-[#e50914]' : 'text-neutral-400 hover:text-white'}`} aria-label={shuffle ? 'Shuffle new songs' : 'Enable shuffle'} title={shuffle ? 'Click to get fresh songs' : 'Enable shuffle'}>
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={playPrev} className="text-neutral-300 hover:text-white transition-colors" aria-label="Previous">
                <SkipBack className="w-8 h-8 fill-current" />
              </button>
              <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>
              <button onClick={playNext} className="text-neutral-300 hover:text-white transition-colors" aria-label="Next">
                <SkipForward className="w-8 h-8 fill-current" />
              </button>
              <button onClick={() => setLiked(!liked)} className={`transition-colors ${liked ? 'text-[#e50914]' : 'text-neutral-400 hover:text-white'}`} aria-label={liked ? 'Unlike' : 'Like'}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition-colors" aria-label="Toggle mute">
                <VolumeIcon className="w-5 h-5" />
              </button>
              <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-32 h-1 accent-[#e50914]" aria-label="Volume" />
            </div>

            <p className="text-neutral-600 text-xs mt-6">{queueIndex + 1} of {queue.length} in queue</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-neutral-900/95 backdrop-blur-xl border-t border-white/5">
        {/* Progress */}
        <div
          ref={bottomSeekRef}
          className="relative h-1 bg-neutral-700 cursor-pointer group hover:h-1.5 transition-all"
          onClick={makeSeekHandler(bottomSeekRef)}
          onMouseDown={makeDragHandler(bottomSeekRef)}
        >
          <div className="absolute top-0 left-0 h-full bg-[#e50914] rounded-r-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center h-16 md:h-20 px-3 md:px-6">
          {/* Left */}
          <div className="flex items-center gap-3 w-1/3 min-w-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
              <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
              <p className="text-xs text-neutral-400 truncate">{currentSong.cast?.[0] || currentSong.category}</p>
            </div>
            <button onClick={() => setLiked(!liked)} className={`flex-shrink-0 transition-colors ${liked ? 'text-[#e50914]' : 'text-neutral-500 hover:text-white'}`} aria-label={liked ? 'Unlike' : 'Like'}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Center */}
          <div className="flex items-center justify-center gap-3 md:gap-5 w-1/3">
            <button onClick={playPrev} className="text-neutral-400 hover:text-white transition-colors" aria-label="Previous">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button onClick={togglePlay} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-0.5" />}
            </button>
            <button onClick={playNext} className="text-neutral-400 hover:text-white transition-colors" aria-label="Next">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <span className="hidden lg:block text-xs text-neutral-500 tabular-nums min-w-[80px] text-center">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-2 md:gap-3 w-1/3">
            <div className="hidden md:flex items-center gap-2">
              <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition-colors" aria-label="Toggle mute">
                <VolumeIcon className="w-4 h-4" />
              </button>
              <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 h-1 accent-[#e50914]" aria-label="Volume" />
            </div>
            <button onClick={() => setShowQueue(!showQueue)} className={`p-2 rounded-md transition-colors ${showQueue ? 'text-[#e50914] bg-[#e50914]/10' : 'text-neutral-400 hover:text-white'}`} aria-label="Toggle queue">
              <ListMusic className="w-4 h-4" />
            </button>
            <button onClick={() => setExpanded(true)} className="p-2 text-neutral-400 hover:text-white transition-colors hidden md:block" aria-label="Expand player">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
