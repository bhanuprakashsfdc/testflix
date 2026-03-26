/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { fetchMovies, getMovieById, Movie, extractVideoId } from '../../src/services/movieService';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
  }, [id]);

  async function loadMovie() {
    try {
      const movies = await fetchMovies();
      const found = getMovieById(movies, id as string);
      setMovie(found || null);
    } catch (error) {
      console.error('Error loading movie:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    router.back();
  }

  function openInYouTube() {
    if (movie?.youtubeUrl) {
      // Extract the YouTube video ID and open in YouTube app
      const videoId = extractVideoId(movie.youtubeUrl);
      if (videoId) {
        Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Video not found</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const videoId = extractVideoId(movie.youtubeUrl);
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {movie.title}
        </Text>
      </View>

      {/* Video Player Placeholder - Opens YouTube App */}
      <View style={styles.playerContainer}>
        <TouchableOpacity style={styles.playButton} onPress={openInYouTube}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.playText}>Play in YouTube</Text>
        </TouchableOpacity>
        
        <Text style={styles.hintText}>
          Tap to open video in YouTube app for the best experience
        </Text>
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Now Playing</Text>
        <Text style={styles.infoMovieTitle}>{movie.title}</Text>
        <Text style={styles.infoMeta}>
          {movie.year} • {movie.duration} • {movie.rating}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  backLink: {
    color: '#e50914',
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  playButton: {
    backgroundColor: '#e50914',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playIcon: {
    color: '#fff',
    fontSize: 24,
    marginRight: 12,
  },
  playText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hintText: {
    color: '#808080',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  infoTitle: {
    color: '#808080',
    fontSize: 12,
    marginBottom: 8,
  },
  infoMovieTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoMeta: {
    color: '#808080',
    fontSize: 14,
  },
});