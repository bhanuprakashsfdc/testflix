/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMovies, getMovieById, Movie, extractVideoId } from '../../src/services/movieService';

const { width, height } = Dimensions.get('window');

const MY_LIST_KEY = '@testflix_mylist';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInMyList, setIsInMyList] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const movies = await fetchMovies();
      setAllMovies(movies);
      const found = getMovieById(movies, id as string);
      setMovie(found || null);
      
      // Check if in my list
      const saved = await AsyncStorage.getItem(MY_LIST_KEY);
      const myList = saved ? JSON.parse(saved) : [];
      setIsInMyList(myList.includes(id));
    } catch (error) {
      console.error('Error loading movie:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleMyList() {
    try {
      const saved = await AsyncStorage.getItem(MY_LIST_KEY);
      let myList = saved ? JSON.parse(saved) : [];
      
      if (isInMyList) {
        myList = myList.filter((mid: string) => mid !== id);
      } else {
        myList.push(id);
      }
      
      await AsyncStorage.setItem(MY_LIST_KEY, JSON.stringify(myList));
      setIsInMyList(!isInMyList);
    } catch (error) {
      console.error('Error toggling my list:', error);
    }
  }

  function handlePlay() {
    if (movie) {
      router.push(`/player/${movie.id}`);
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
        <Text style={styles.errorText}>Movie not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const videoId = extractVideoId(movie.youtubeUrl);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: movie.bannerImage || movie.thumbnail }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.heroContent}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{movie.year}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{movie.duration}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.ratingBadge}>{movie.rating}</Text>
              </View>
              
              <View style={styles.genreRow}>
                {movie.genres.slice(0, 3).map((genre, index) => (
                  <Text key={index} style={styles.genreText}>{genre}</Text>
                ))}
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                  <Text style={styles.playButtonText}>▶ Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={toggleMyList}>
                  <Text style={styles.addButtonText}>
                    {isInMyList ? '✓ Added' : '+ My List'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.description}>{movie.description}</Text>
        </View>

        {/* Cast */}
        {movie.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <Text style={styles.castText}>{movie.cast.join(', ')}</Text>
          </View>
        )}

        {/* Related Movies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Like This</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movie.genres.slice(0, 1).map((_, genreIndex) => {
              const related = allMovies
                .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
                .slice(0, 6);
              return related.map((m) => (
                <TouchableOpacity 
                  key={m.id} 
                  style={styles.relatedCard}
                  onPress={() => router.push(`/movie/${m.id}`)}
                >
                  <Image
                    source={{ uri: m.thumbnail }}
                    style={styles.relatedThumbnail}
                  />
                  <Text style={styles.relatedTitle} numberOfLines={1}>{m.title}</Text>
                </TouchableOpacity>
              ));
            })}
          </ScrollView>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#141414',
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
  heroContainer: {
    width: width,
    height: height * 0.55,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    color: '#fff',
    fontSize: 14,
  },
  metaDot: {
    color: '#808080',
    marginHorizontal: 8,
  },
  ratingBadge: {
    backgroundColor: '#ffa00a',
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  genreRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  genreText: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: 'rgba(128,128,128,0.6)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    color: '#b3b3b3',
    fontSize: 15,
    lineHeight: 22,
  },
  castText: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  relatedCard: {
    marginRight: 12,
    width: 120,
  },
  relatedThumbnail: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  relatedTitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});