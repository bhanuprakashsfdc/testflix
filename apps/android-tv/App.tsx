/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { fetchMovies, getTrendingMovies, getMoviesByType, Movie } from './src/services/movieService';

const { width, height } = Dimensions.get('window');

// Theme colors for TV
const colors = {
  background: '#000000',
  primary: '#e50914',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  accent: '#ffa00a',
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [focusedIndex, setFocusedIndex] = useState(0);

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

  const trendingMovies = getTrendingMovies(movies);
  const moviesList = getMoviesByType(movies, 'Movie');
  const tvShowsList = getMoviesByType(movies, 'TV Show');

  const categories = [
    { key: 'trending', label: '🔥 Trending' },
    { key: 'movies', label: '🎬 Movies' },
    { key: 'tvshows', label: '📺 TV Shows' },
  ];

  const currentContent = selectedCategory === 'trending' 
    ? trendingMovies 
    : selectedCategory === 'movies' 
      ? moviesList 
      : tvShowsList;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading TestFlix...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>TestFlix</Text>
        <View style={styles.headerNav}>
          <Text style={styles.navText}>Home</Text>
          <Text style={styles.navText}>TV Shows</Text>
          <Text style={styles.navText}>Movies</Text>
          <Text style={styles.navText}>My List</Text>
        </View>
      </View>

      {/* Featured Banner */}
      {trendingMovies.length > 0 && (
        <View style={styles.featuredContainer}>
          <Image
            source={{ uri: trendingMovies[0].bannerImage || trendingMovies[0].thumbnail }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTitle}>{trendingMovies[0].title}</Text>
            <View style={styles.featuredButtons}>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>▶ Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoButtonText}>ℹ More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Category Tabs */}
      <View style={styles.categoriesContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === cat.key && styles.categoryTextActive,
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Movie Grid */}
      <FlatList
        data={currentContent}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.movieCard,
              index === focusedIndex && styles.movieCardFocused,
            ]}
            onPress={() => console.log('Selected:', item.title)}
            onFocus={() => setFocusedIndex(index)}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.movieThumbnail}
              resizeMode="cover"
            />
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            )}
            <Text style={styles.movieTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 18,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 20,
  },
  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerNav: {
    flexDirection: 'row',
    gap: 30,
  },
  navText: {
    color: colors.text,
    fontSize: 16,
  },
  featuredContainer: {
    width: width,
    height: height * 0.45,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuredButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  playButton: {
    backgroundColor: colors.text,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  playButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  infoButton: {
    backgroundColor: 'rgba(128,128,128,0.6)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  infoButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 20,
    gap: 16,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: '#2a2a2a',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.text,
  },
  gridContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    maxWidth: (width - 96) / 4 - 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  movieCardFocused: {
    borderColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  movieThumbnail: {
    width: '100%',
    height: 200,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  ratingText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  movieTitle: {
    color: colors.text,
    fontSize: 14,
    padding: 8,
  },
});
