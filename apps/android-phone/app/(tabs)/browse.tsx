/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { fetchMovies, getMoviesByType, Movie } from '../../src/services/movieService';

const { width } = Dimensions.get('window');

type CategoryType = 'Movie' | 'TV Show' | 'Song';

const categories: { key: CategoryType; label: string }[] = [
  { key: 'Movie', label: 'Movies' },
  { key: 'TV Show', label: 'TV Shows' },
  { key: 'Song', label: 'Songs' },
];

export default function BrowseScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Movie');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMovies = getMoviesByType(movies, selectedCategory);

  function handleMoviePress(movie: Movie) {
    router.push(`/movie/${movie.id}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse</Text>
      </View>

      <View style={styles.categoryTabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryTab, selectedCategory === cat.key && styles.categoryTabActive]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat.key && styles.categoryTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredMovies.map((movie) => (
            <TouchableOpacity 
              key={movie.id} 
              style={styles.movieCard}
              onPress={() => handleMoviePress(movie)}
            >
              <Image
                source={{ uri: movie.thumbnail }}
                style={styles.thumbnail}
              />
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              <Text style={styles.movieYear}>{movie.year}</Text>
            </TouchableOpacity>
          ))}
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
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  categoryTabActive: {
    backgroundColor: '#e50914',
  },
  categoryText: {
    color: '#808080',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  movieCard: {
    width: (width - 48) / 2,
    margin: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  movieYear: {
    color: '#808080',
    fontSize: 12,
    marginTop: 4,
  },
  bottomPadding: {
    height: 100,
  },
});