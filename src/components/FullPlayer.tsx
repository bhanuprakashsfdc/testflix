/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, Maximize, Settings, Subtitles, Layers, SkipForward } from 'lucide-react';
import { Movie } from '../data/movies';
import { motion, AnimatePresence } from 'motion/react';
import { saveWatchProgress } from '../utils/watchHistory';

interface FullPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function FullPlayer({ movie, onClose }: FullPlayerProps) {
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

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
      };
    }
  }, [movie]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const message = isPlaying ? '{"event":"command","func":"playVideo","args":""}' : '{"event":"command","func":"pauseVideo","args":""}';
      iframeRef.current.contentWindow?.postMessage(message, '*');
    }
  }, [isPlaying]);

  const handleClose = () => {
    if (movie) {
      // Simulate progress (e.g., 45% watched)
      saveWatchProgress(movie.id, 45);
    }
    onClose();
  };

  if (!movie) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
      >
        {/* The Video (Iframe) */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          <iframe
            ref={iframeRef}
            src={`${movie.youtubeUrl}?autoplay=1&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&enablejsapi=1`}
            title={movie.title}
            className="w-full h-full scale-[1.35] pointer-events-none" // Scale to hide YouTube controls
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Custom Controls Overlay */}
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 cursor-none'}`}
          onClick={() => setIsPlaying(!isPlaying)}
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
              <button className="hover:text-white"><Settings className="w-6 h-6" /></button>
              <button className="hover:text-white"><Subtitles className="w-6 h-6" /></button>
            </div>
          </div>

          {/* Center Info (Visible on pause or initial load) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <h2 className="text-6xl font-black mb-4 text-white">{movie.title}</h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">{movie.description}</p>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
            {/* Progress Bar */}
            <div className="group relative w-full h-1 bg-white/30 mb-8 cursor-pointer">
              <div className="absolute top-0 left-0 h-full bg-red-600 w-[45%]" />
              <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform" />
              <div className="absolute -top-8 left-[45%] -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                45:12 / 1:42:00
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
                </button>
                
                <button className="text-white hover:scale-110 transition-transform"><RotateCcw className="w-8 h-8" /></button>
                <button className="text-white hover:scale-110 transition-transform"><RotateCw className="w-8 h-8" /></button>
                
                <div className="flex items-center gap-4 group">
                  <Volume2 className="w-8 h-8 text-white" />
                  <div className="w-0 group-hover:w-24 h-1 bg-white/30 overflow-hidden transition-all duration-300">
                    <div className="h-full bg-white w-[80%]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-white">
                <div className="text-lg font-medium">{movie.title}</div>
                <button className="hover:text-red-600 transition-colors"><SkipForward className="w-8 h-8" /></button>
                <button className="hover:text-red-600 transition-colors"><Layers className="w-8 h-8" /></button>
                <button className="hover:text-red-600 transition-colors"><Maximize className="w-8 h-8" /></button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
