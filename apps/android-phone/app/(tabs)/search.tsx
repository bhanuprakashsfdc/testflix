/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { fetchMovies, searchMovies, Movie } from '../../src/services/movieService';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
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

  useEffect(() => {
    if (query.trim()) {
      const results = searchMovies(movies, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query, movies]);

  function handleMoviePress(movie: Movie) {
    router.push(`/movie/${movie.id}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, shows, actors..."
          placeholderTextColor="#808080"
          value={query}
          onChangeText={setQuery}
          autoFocus={false}
        />
      </View>

      {query.trim() === '' ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>🔍 Search for your favorite movies and shows</Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.movieCard}
              onPress={() => handleMoviePress(item)}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: 60,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#808080',
    fontSize: 16,
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    maxWidth: (width - 48) / 3,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
});