import { useState, useEffect } from 'react';
import { Movie } from '../data/movies';
import { getWatchHistory } from '../utils/watchHistory';

interface FeaturedGridProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  title: string;
}

export default function FeaturedGrid({ movies, onPlay, onInfo, title }: FeaturedGridProps) {
  return (
    <div className="px-4 md:px-8 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {movies.slice(0, 10).map((movie, index) => (
          <div 
            key={movie.id} 
            className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20"
            onClick={() => onInfo(movie)}
          >
            {/* Rank number for Top 10 */}
            {title.includes('Top 10') && (
              <div className="absolute top-2 left-2 z-30">
                <span className="text-4xl font-black text-black/80 drop-shadow-lg leading-none">
                  {index + 1}
                </span>
              </div>
            )}
            
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Play button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(movie);
                  }}
                  className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-2">
              <h3 className="text-sm font-medium text-white truncate group-hover:text-red-500 transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{movie.year}</span>
                <span>•</span>
                <span className="text-green-400">{movie.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}