/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Movies', path: '/movies' },
    { name: 'New & Popular', path: '/new-popular' },
    { name: 'My List', path: '/my-list' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-colors duration-500 h-20 flex items-center px-6 md:px-12 ${
        isScrolled ? 'bg-background/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-10 w-full justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl font-black text-red-600 tracking-tighter uppercase font-headline">
            NETFLIX
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
          <div className="hidden md:flex items-center bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg">
            <Search className="text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              placeholder="Titles, people, genres"
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface placeholder:text-on-surface-variant/50 ml-2"
            />
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
