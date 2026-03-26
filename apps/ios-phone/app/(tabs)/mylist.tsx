/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { fetchMovies, getMovieById, Movie } from '../../src/services/movieService';

const { width } = Dimensions.get('window');

const MY_LIST_KEY = '@testflix_mylist';

export default function MyListScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [myListIds, setMyListIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchMovies();
      setMovies(data);
      await loadMyList();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyList = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(MY_LIST_KEY);
      if (saved) {
        setMyListIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading my list:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload my list when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMyList();
    }, [loadMyList])
  );

  const myListMovies = myListIds
    .map(id => getMovieById(movies, id))
    .filter((m): m is Movie => m !== undefined);

  function handleMoviePress(movie: Movie) {
    // Navigate to movie detail - will be handled by router
    console.log('Navigate to:', movie.id);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My List</Text>
      </View>

      {myListMovies.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>❤️ Your list is empty</Text>
          <Text style={styles.emptySubtext}>Add movies and shows to your list to see them here</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {myListMovies.map((movie) => (
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
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.bottomPadding} />
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptySubtext: {
    color: '#808080',
    fontSize: 14,
    textAlign: 'center',
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
  bottomPadding: {
    height: 100,
  },
});