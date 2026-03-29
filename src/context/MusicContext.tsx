import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react';
import { Movie } from '../data/movies';
import { useMovies } from './MovieContext';

interface MusicContextType {
  isMusicMode: boolean;
  toggleMusicMode: () => void;
  songs: Movie[];
  currentSong: Movie | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Movie[];
  queueIndex: number;
  shuffle: boolean;
  toggleShuffle: () => void;
  reshuffleQueue: () => void;
  playSong: (song: Movie, list?: Movie[]) => void;
  playNext: () => void;
  playPrev: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  addToQueue: (song: Movie) => void;
  removeFromQueue: (index: number) => void;
  showQueue: boolean;
  setShowQueue: (show: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const { movies } = useMovies();
  const [isMusicMode, setIsMusicMode] = useState(false);
  const [currentSong, setCurrentSong] = useState<Movie | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState<Movie[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [songEnded, setSongEnded] = useState(false);

  const playerRef = useRef<any>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ytApiLoaded = useRef(false);
  const initAttempts = useRef(0);
  const volumeRef = useRef(80);
  const isMutedRef = useRef(false);
  const queueRef = useRef<Movie[]>([]);
  const queueIndexRef = useRef(0);
  const shuffleRef = useRef(false);
  const isPlayingRef = useRef(false);
  const songsRef = useRef<Movie[]>([]);
  const historyRef = useRef<string[]>([]);
  const songEndedRef = useRef(false);

  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { songEndedRef.current = songEnded; }, [songEnded]);

  const songs = useMemo(() => {
    const s = movies.filter(m => {
      const t = (m.type || '').toLowerCase();
      return t.includes('song') || t.includes('music');
    });
    songsRef.current = s;
    return s;
  }, [movies]);

  // Generate a fresh random queue from the full song pool
  const generateFreshQueue = useCallback((excludeSongId?: string): Movie[] => {
    const pool = songsRef.current;
    if (pool.length === 0) return [];

    const recentHistory = new Set(historyRef.current.slice(-30));
    if (excludeSongId) recentHistory.add(excludeSongId);

    let available = pool.filter(s => !recentHistory.has(s.id));
    // If too few available after filtering, use full pool
    if (available.length < 3) {
      available = pool.filter(s => s.id !== excludeSongId);
    }
    if (available.length === 0) available = pool;

    const batchSize = Math.min(20, available.length);
    return fisherYates<Movie>(available).slice(0, batchSize);
  }, []);

  // Load YouTube API
  useEffect(() => {
    if (ytApiLoaded.current) return;
    if (window.YT?.Player) { ytApiLoaded.current = true; return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
    ytApiLoaded.current = true;
  }, []);

  // Hidden player container
  useEffect(() => {
    if (document.getElementById('music-yt-player-container')) return;
    const container = document.createElement('div');
    container.id = 'music-yt-player-container';
    container.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;visibility:hidden';
    document.body.appendChild(container);
    const div = document.createElement('div');
    div.id = 'music-yt-player';
    container.appendChild(div);
  }, []);

  const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const stopProgressTracking = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    progressRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  }, [stopProgressTracking]);

  // initPlayer — NO state closures, only refs
  const initPlayer = useCallback((videoId: string) => {
    const createPlayer = () => {
      stopProgressTracking();
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
      const playerEl = document.getElementById('music-yt-player');
      if (!playerEl) return;
      playerEl.innerHTML = '';

      try {
        playerRef.current = new window.YT.Player('music-yt-player', {
          videoId,
          playerVars: {
            autoplay: 1, controls: 0, rel: 0, modestbranding: 1,
            showinfo: 0, iv_load_policy: 3, enablejsapi: 1,
            origin: window.location.origin, playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              setDuration(event.target.getDuration());
              event.target.setVolume(isMutedRef.current ? 0 : volumeRef.current);
              event.target.playVideo();
              setIsPlaying(true);
              startProgressTracking();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                try { setDuration(event.target.getDuration()); } catch {}
              }
              if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopProgressTracking();
                // Signal song ended — handled by useEffect below
                setSongEnded(true);
              }
            },
          },
        });
      } catch (e) {
        console.error('YT Player init error:', e);
      }
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      initAttempts.current = 0;
      const check = () => {
        initAttempts.current++;
        if (window.YT?.Player) createPlayer();
        else if (initAttempts.current < 30) setTimeout(check, 300);
      };
      check();
    }
  }, [startProgressTracking, stopProgressTracking]);

  // ===== AUTO-PLAY: react to songEnded state change =====
  useEffect(() => {
    if (!songEnded) return;
    setSongEnded(false);

    const q = queueRef.current;
    const idx = queueIndexRef.current;

    if (q.length === 0) return;

    const nextIdx = idx + 1;
    if (nextIdx < q.length) {
      // More songs in queue — advance
      if (shuffleRef.current) {
        setQueueIndex(Math.floor(Math.random() * q.length));
      } else {
        setQueueIndex(nextIdx);
      }
    } else {
      // Queue exhausted — generate FRESH batch
      const fresh = generateFreshQueue();
      if (fresh.length > 0) {
        setQueue(fresh);
        setQueueIndex(0);
      }
    }
  }, [songEnded, generateFreshQueue]);

  // When queue index changes → play that song
  useEffect(() => {
    if (queue.length > 0 && queueIndex >= 0 && queueIndex < queue.length) {
      const song = queue[queueIndex];
      setCurrentSong(song);
      setCurrentTime(0);
      setDuration(0);
      // Track history
      historyRef.current = [...historyRef.current.filter(id => id !== song.id), song.id].slice(-50);
      const videoId = getYoutubeId(song.youtubeUrl);
      if (videoId) {
        initAttempts.current = 0;
        initPlayer(videoId);
      }
    }
  }, [queueIndex, queue, initPlayer]);

  const playSong = useCallback((song: Movie, list?: Movie[]) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);
    historyRef.current = [...historyRef.current.filter(id => id !== song.id), song.id].slice(-50);

    let songList: Movie[];
    if (list && list.length > 0) {
      songList = list;
    } else {
      // Generate fresh random queue from full library
      songList = generateFreshQueue(song.id);
      songList = [song, ...songList.filter(s => s.id !== song.id)];
    }

    // Shuffle the queue if shuffle mode is on
    if (shuffleRef.current && songList.length > 1) {
      const others = songList.filter(s => s.id !== song.id);
      songList = [song, ...fisherYates(others)];
    }

    setQueue(songList);
    const idx = songList.findIndex(s => s.id === song.id);
    setQueueIndex(idx >= 0 ? idx : 0);

    const videoId = getYoutubeId(song.youtubeUrl);
    if (videoId) {
      initAttempts.current = 0;
      initPlayer(videoId);
    }
  }, [initPlayer, generateFreshQueue]);

  const playNext = useCallback(() => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;

    if (q.length === 0) {
      const fresh = generateFreshQueue();
      if (fresh.length > 0) { setQueue(fresh); setQueueIndex(0); }
      return;
    }

    const nextIdx = idx + 1;
    if (nextIdx < q.length) {
      if (shuffleRef.current) {
        setQueueIndex(Math.floor(Math.random() * q.length));
      } else {
        setQueueIndex(nextIdx);
      }
    } else {
      // Exhausted — fresh batch
      const fresh = generateFreshQueue();
      if (fresh.length > 0) { setQueue(fresh); setQueueIndex(0); }
    }
  }, [generateFreshQueue]);

  const playPrev = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    if (shuffleRef.current) {
      setQueueIndex(Math.floor(Math.random() * q.length));
    } else {
      setQueueIndex(prev => (prev - 1 + q.length) % q.length);
    }
  }, []);

  const reshuffleQueue = useCallback(() => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    const current = q[idx];
    const fresh = generateFreshQueue(current?.id);

    if (fresh.length > 0) {
      if (current) {
        const withCurrent = [current, ...fresh.filter(s => s.id !== current.id)];
        setQueue(withCurrent);
        setQueueIndex(0);
      } else {
        setQueue(fresh);
        setQueueIndex(0);
      }
    }
  }, [generateFreshQueue]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlayingRef.current) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      stopProgressTracking();
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      startProgressTracking();
    }
  }, [startProgressTracking, stopProgressTracking]);

  const seek = useCallback((time: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(time, true);
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    volumeRef.current = vol;
    if (playerRef.current?.setVolume) playerRef.current.setVolume(vol);
    if (vol > 0) { setIsMuted(false); isMutedRef.current = false; }
    localStorage.setItem('vf_volume', String(vol));
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMutedRef.current) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volumeRef.current);
      setIsMuted(false);
      isMutedRef.current = false;
    } else {
      playerRef.current.mute();
      setIsMuted(true);
      isMutedRef.current = true;
    }
  }, []);

  const addToQueue = useCallback((song: Movie) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const next = !prev;
      if (next) {
        // Turning shuffle ON — generate fresh shuffled queue
        const q = queueRef.current;
        const idx = queueIndexRef.current;
        const current = q[idx];
        const fresh = generateFreshQueue(current?.id);
        if (fresh.length > 0) {
          if (current) {
            setQueue([current, ...fresh.filter(s => s.id !== current.id)]);
            setQueueIndex(0);
          } else {
            setQueue(fresh);
            setQueueIndex(0);
          }
        }
      }
      return next;
    });
  }, [generateFreshQueue]);

  const toggleMusicMode = useCallback(() => {
    setIsMusicMode(prev => {
      if (prev) {
        if (playerRef.current) {
          try { playerRef.current.stopVideo(); } catch {}
        }
        stopProgressTracking();
        setIsPlaying(false);
        setCurrentSong(null);
        setCurrentTime(0);
        setDuration(0);
        setQueue([]);
        setQueueIndex(0);
        setShowQueue(false);
        setSongEnded(false);
      }
      return !prev;
    });
  }, [stopProgressTracking]);

  useEffect(() => {
    const savedVol = localStorage.getItem('vf_volume');
    if (savedVol) {
      const v = parseInt(savedVol);
      setVolumeState(v);
      volumeRef.current = v;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
      }
    };
  }, [stopProgressTracking]);

  const value = useMemo(() => ({
    isMusicMode, toggleMusicMode, songs, currentSong, isPlaying,
    currentTime, duration, volume, isMuted, queue, queueIndex,
    shuffle, toggleShuffle, reshuffleQueue, playSong, playNext, playPrev, togglePlay,
    seek, setVolume, toggleMute, addToQueue, removeFromQueue,
    showQueue, setShowQueue,
  }), [
    isMusicMode, songs, currentSong, isPlaying, currentTime, duration,
    volume, isMuted, queue, queueIndex, shuffle, showQueue,
    toggleMusicMode, toggleShuffle, reshuffleQueue, playSong, playNext, playPrev,
    togglePlay, seek, setVolume, toggleMute, addToQueue, removeFromQueue,
  ]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
}
