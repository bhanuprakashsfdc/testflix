/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { fetchMovies, getTrendingMovies, getFeaturedMovies, getMoviesByType, Movie } from '../../src/services/movieService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [movieContent, setMovieContent] = useState<Movie[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      const data = await fetchMovies();
      setMovies(data);
      setFeaturedMovies(getFeaturedMovies(data, 5));
      setTrendingMovies(getTrendingMovies(data));
      setMovieContent(getMoviesByType(data, 'Movie').slice(0, 20));
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleMoviePress(movie: Movie) {
    router.push(`/movie/${movie.id}`);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Featured Banner */}
      {featuredMovies.length > 0 && (
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: featuredMovies[0].bannerImage || featuredMovies[0].thumbnail }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{featuredMovies[0].title}</Text>
            <View style={styles.bannerButtons}>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>▶ Play</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.infoButton}
                onPress={() => handleMoviePress(featuredMovies[0])}
              >
                <Text style={styles.infoButtonText}>ℹ More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Trending Row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {trendingMovies.map((movie) => (
            <TouchableOpacity 
              key={movie.id} 
              style={styles.movieCard}
              onPress={() => handleMoviePress(movie)}
            >
              <Image
                source={{ uri: movie.thumbnail }}
                style={styles.movieThumbnail}
              />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{movie.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Movies Row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎬 Popular Movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {movieContent.map((movie) => (
            <TouchableOpacity 
              key={movie.id} 
              style={styles.movieCard}
              onPress={() => handleMoviePress(movie)}
            >
              <Image
                source={{ uri: movie.thumbnail }}
                style={styles.movieThumbnail}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* TV Shows Row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📺 TV Shows</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {getMoviesByType(movies, 'TV Show').slice(0, 10).map((movie) => (
            <TouchableOpacity 
              key={movie.id} 
              style={styles.movieCard}
              onPress={() => handleMoviePress(movie)}
            >
              <Image
                source={{ uri: movie.thumbnail }}
                style={styles.movieThumbnail}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  bannerContainer: {
    width: width,
    height: 400,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    backgroundColor: 'rgba(128,128,128,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingRight: 16,
    gap: 12,
  },
  movieCard: {
    width: 120,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  movieThumbnail: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffa00a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  ratingText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
});