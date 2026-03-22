/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, MouseEvent, ChangeEvent } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, Maximize, Settings, Subtitles, Layers, SkipForward, VolumeX } from 'lucide-react';
import { Movie } from '../data/movies';
import { motion, AnimatePresence } from 'motion/react';
import { saveWatchProgress } from '../utils/watchHistory';

interface FullPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function FullPlayer({ movie, onClose }: FullPlayerProps) {
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
      const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
      };

      window.addEventListener('mousemove', handleMouseMove);
      handleMouseMove(); // Initial show

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        if (progressInterval.current) clearInterval(progressInterval.current);
      };
    }
  }, [movie]);

  // Initialize Player
  useEffect(() => {
    if (!movie || !window.YT) return;

    const getYoutubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(movie.youtubeUrl);
    if (!videoId) return;
    
    const initPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
            event.target.playVideo();
            setIsPlaying(true);
            
            // Start progress tracking
            progressInterval.current = setInterval(() => {
              if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
              }
            }, 500);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) setIsPlaying(false);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [movie]);

  const togglePlay = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const seek = (seconds: number, e?: MouseEvent) => {
    e?.stopPropagation();
    if (!playerRef.current) return;
    const newTime = playerRef.current.getCurrentTime() + seconds;
    playerRef.current.seekTo(newTime, true);
  };

  const handleTimelineClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!playerRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0) setIsMuted(false);
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (movie && duration > 0) {
      const progress = (currentTime / duration) * 100;
      saveWatchProgress(movie.id, progress);
    }
    onClose();
  };

  if (!movie) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
      >
        {/* The Video Container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div id="youtube-player" className="w-full h-full scale-[1.35]"></div>
        </div>

        {/* Custom Controls Overlay */}
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 cursor-none'}`}
          onClick={togglePlay}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
            <button 
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="flex items-center gap-4 text-white hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-8 h-8" />
              <span className="text-xl font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-6 text-white/80">
              <button className="hover:text-white" onClick={(e) => e.stopPropagation()}><Settings className="w-6 h-6" /></button>
              <button className="hover:text-white" onClick={(e) => e.stopPropagation()}><Subtitles className="w-6 h-6" /></button>
            </div>
          </div>

          {/* Center Info (Visible on pause) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <h2 className="text-6xl font-black mb-4 text-white drop-shadow-2xl">{movie.title}</h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto drop-shadow-lg">{movie.description}</p>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent" onClick={(e) => e.stopPropagation()}>
            {/* Progress Bar */}
            <div 
              className="group relative w-full h-1 bg-white/30 mb-8 cursor-pointer"
              onClick={handleTimelineClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-red-600" 
                style={{ width: `${progressPercent}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform"
                style={{ left: `${progressPercent}%` }}
              />
              <div 
                className="absolute -top-8 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ left: `${progressPercent}%` }}
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <button 
                  onClick={togglePlay}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
                </button>
                
                <button 
                  onClick={(e) => seek(-10, e)}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <RotateCcw className="w-8 h-8" />
                </button>
                <button 
                  onClick={(e) => seek(10, e)}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <RotateCw className="w-8 h-8" />
                </button>
                
                <div className="flex items-center gap-4 group">
                  <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform">
                    {isMuted || volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                  </button>
                  <div className="w-0 group-hover:w-24 h-1 bg-white/30 overflow-hidden transition-all duration-300 flex items-center">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={isMuted ? 0 : volume} 
                      onChange={handleVolumeChange}
                      className="w-full h-1 accent-red-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-white">
                <div className="text-lg font-medium hidden md:block">{movie.title}</div>
                <button className="hover:text-red-600 transition-colors"><SkipForward className="w-8 h-8" /></button>
                <button className="hover:text-red-600 transition-colors"><Layers className="w-8 h-8" /></button>
                <button className="hover:text-red-600 transition-colors" onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}><Maximize className="w-8 h-8" /></button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
