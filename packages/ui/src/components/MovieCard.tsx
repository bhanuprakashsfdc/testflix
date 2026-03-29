/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Movie } from '@testflix/shared/types';

export interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
  onLongPress?: (movie: Movie) => void;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
  showRating?: boolean;
  testID?: string;
}

export function MovieCard({
  movie,
  onPress,
  onLongPress,
  size = 'medium',
  showTitle = false,
  showRating = true,
  testID,
}: MovieCardProps) {
  const sizeStyles = {
    small: { width: 100, height: 150 },
    medium: { width: 140, height: 210 },
    large: { width: 180, height: 270 },
  };

  const dimensions = sizeStyles[size];

  const handlePress = () => {
    onPress?.(movie);
  };

  const handleLongPress = () => {
    onLongPress?.(movie);
  };

  return (
    <div
      testID={testID}
      onClick={handlePress}
      onContextMenu={handleLongPress}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <img
        src={movie.thumbnail || movie.bannerImage}
        alt={movie.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loading="lazy"
      />
      
      {/* Overlay gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      
      {showTitle && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            color: 'white',
            fontSize: 12,
            fontWeight: 500,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {movie.title}
        </div>
      )}
      
      {showRating && movie.rating && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#ffa00a',
            color: 'black',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 2,
          }}
        >
          {movie.rating}
        </div>
      )}
    </div>
  );
}

// For React Native compatibility
export const MovieCardDisplay = React.memo(MovieCard);