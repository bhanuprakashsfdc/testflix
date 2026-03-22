/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Movie } from '../data/movies';

interface BannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
}

export default function Banner({ movie, onPlay, onInfo }: BannerProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 2000);
    return () => clearTimeout(timer);
  }, [movie]);

  return (
    <section className="relative h-[80vh] md:h-[870px] w-full overflow-hidden">
      {/* Background Image / Video */}
      <div className="absolute inset-0">
        <img
          src={movie.bannerImage}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
          referrerPolicy="no-referrer"
        />
        
        {showVideo && (
          <div className="absolute inset-0 bg-black">
            <iframe
              src={`${movie.youtubeUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${movie.youtubeUrl.split('/').pop()}&rel=0&modestbranding=1`}
              className="w-full h-full scale-[1.5] pointer-events-none"
              allow="autoplay"
            />
          </div>
        )}
        
        <div className="absolute inset-0 hero-vignette"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-24 z-10">
        <div className="max-w-2xl">
          <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface mb-4 tracking-tighter uppercase drop-shadow-2xl">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-4 text-sm font-semibold drop-shadow-md">
            <span className="text-green-500">{movie.matchScore}</span>
            <span className="text-on-surface-variant">{movie.year}</span>
            <span className="border border-on-surface-variant/50 px-1 text-[10px] rounded">{movie.rating}</span>
            <span className="text-on-surface-variant">{movie.duration}</span>
            <span className="bg-surface-bright/50 px-1.5 py-0.5 rounded text-[10px]">4K Ultra HD</span>
          </div>
          
          <p className="text-on-surface-variant text-base md:text-lg mb-8 line-clamp-3 font-body leading-relaxed drop-shadow-md">
            {movie.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 bg-on-surface text-background px-8 py-3 rounded font-bold hover:bg-neutral-300 transition-all duration-300 scale-100 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>
            <button 
              onClick={() => onInfo(movie)}
              className="flex items-center gap-2 bg-surface-variant/60 backdrop-blur-md text-on-surface px-8 py-3 rounded font-bold hover:bg-surface-variant/80 transition-all duration-300 scale-100 active:scale-95"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
            
            <div className="flex-grow md:flex-none" />
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="h-12 w-12 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:bg-white/10 transition-colors ml-auto"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
