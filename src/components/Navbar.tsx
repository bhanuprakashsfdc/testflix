/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../data/movies';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { movies } = useMovies();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter movies based on search query (title, genres, or cast)
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genres.some(g => g.toLowerCase().includes(query)) ||
        movie.cast.some(c => c.toLowerCase().includes(query)) ||
        (movie.director && movie.director.toLowerCase().includes(query))
      ).slice(0, 6);
      setSearchResults(filtered);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, movies]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Songs', path: '/songs' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Movies', path: '/movies' },
    { name: 'New & Popular', path: '/new-popular' },
    { name: 'My List', path: '/my-list' },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (movie: Movie) => {
    // Navigate to search results page with the query
    navigate(`/search?q=${encodeURIComponent(movie.title)}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-colors duration-500 h-20 flex items-center px-6 md:px-12 ${
        isScrolled ? 'bg-background/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-10 w-full justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl font-black text-primary tracking-tighter uppercase font-headline">
            TESTFLIX
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 hover:text-neutral-300 ${
                  location.pathname === link.path ? 'text-on-surface font-bold' : 'text-on-surface-variant'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={searchRef}>
            <div className="hidden md:flex items-center bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg">
              <Search className="text-on-surface-variant w-5 h-5" />
              <input
                type="text"
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setShowSuggestions(false);
                  }
                }}
                className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface placeholder:text-on-surface-variant/50 ml-2"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="text-on-surface-variant hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-neutral-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                <div className="p-2">
                  <p className="text-xs text-on-surface-variant px-2 py-1">Suggestions</p>
                  {searchResults.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleSuggestionClick(movie)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="w-12 h-8 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{movie.title}</p>
                        <p className="text-xs text-on-surface-variant">{movie.year} • {movie.genres[0]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="text-on-surface hover:text-neutral-300 transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <Link to="/profile" className="h-8 w-8 rounded-lg overflow-hidden border-2 border-primary-container cursor-pointer">
            <img
              src="https://picsum.photos/seed/profile/100/100"
              alt="User Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>
          <button className="md:hidden text-on-surface">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
