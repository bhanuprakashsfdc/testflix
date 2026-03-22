/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Play, Plus, ChevronDown } from 'lucide-react';
import { Movie } from '../data/movies';
import { motion } from 'motion/react';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
}

export default function MovieCard({ movie, onPlay, onInfo }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => setShowPreview(true), 800);
    } else {
      setShowPreview(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.15, zIndex: 40 }}
      transition={{ duration: 0.3 }}
      className="flex-none w-48 md:w-64 aspect-video rounded-md overflow-hidden bg-surface-container relative cursor-pointer group shadow-xl"
      onClick={() => onPlay(movie)}
    >
      {/* Thumbnail */}
      <img
        src={movie.thumbnail}
        alt={movie.title}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${showPreview ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
      />

      {/* Video Preview */}
      {showPreview && (
        <div className="absolute inset-0 bg-black">
          <iframe
            src={`${movie.youtubeUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.youtubeUrl.split('/').pop()}&rel=0`}
            className="w-full h-full pointer-events-none scale-150"
            allow="autoplay"
          />
        </div>
      )}
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button 
                className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors"
                onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
              <button className="h-8 w-8 rounded-full border border-neutral-500 text-white flex items-center justify-center hover:border-white transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              className="h-8 w-8 rounded-full border border-neutral-500 text-white flex items-center justify-center hover:border-white transition-colors"
              onClick={(e) => { e.stopPropagation(); onInfo(movie); }}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-xs uppercase tracking-wider text-white truncate">
              {movie.title}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="text-green-500">{movie.matchScore}</span>
              <span className="text-white border border-white/40 px-1 rounded-sm">{movie.rating}</span>
              <span className="text-white">{movie.duration}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre, i) => (
                <span key={genre} className="text-[10px] text-neutral-300">
                  {genre}{i < 2 && movie.genres.length > 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 Badge */}
      {movie.isTop10 && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm shadow-md z-10">
          TOP 10
        </div>
      )}
    </motion.div>
  );
}
