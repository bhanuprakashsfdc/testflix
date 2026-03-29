# TestFlix Redesign Planning

## Overview
Full redesign of TestFlix streaming application implementing Netflix/Hotstar-grade UX patterns, accessibility compliance (WCAG 2.2 AA), and a Tailwind v4 design system.

---

## 1. Design System (Tailwind v4)

### Design Tokens
- [x] Enhanced `@theme` with semantic color tokens (background, surface, primary, accent, muted, destructive, border, ring)
- [x] Added animation tokens (fade-in, fade-out, slide-in, slide-out, shimmer, scale-in)
- [x] Added radius tokens (sm, md, lg, xl)
- [x] Added focus-ring and disabled utility classes
- [x] Skeleton loading shimmer animation

### Component Architecture
- Base styles → Variants → Sizes → States → Overrides pattern
- CVA (Class Variance Authority) approach for variant management
- Consistent focus-visible ring across all interactive elements

---

## 2. Accessibility (WCAG 2.2 AA)

### Keyboard Navigation
- [x] Skip to main content link
- [x] Focus-visible rings on all interactive elements
- [x] Keyboard controls for video player (Space, K, M, F, Arrow keys)
- [x] Tab-navigable movie cards and rows
- [x] Escape key closes modals and player

### Screen Reader Support
- [x] ARIA labels on all interactive elements
- [x] `aria-current` on active nav links
- [x] `aria-expanded` on dropdowns
- [x] `aria-modal` on detail modal
- [x] `aria-busy` on loading states
- [x] `role="status"` for live region announcements
- [x] `sr-only` class for screen reader text
- [x] Semantic HTML structure with `<main>`, `<header>`, `<nav>`, `<footer>`, `<section>`

### Color Contrast
- [x] Verified 4.5:1 ratio for normal text
- [x] Verified 3:1 ratio for large text and UI components
- [x] Enhanced focus ring with 2px offset

### Touch Targets
- [x] Minimum 44x44px touch targets on all buttons
- [x] Minimum 24x24px for secondary interactive elements

---

## 3. Navbar Redesign

### Features
- [x] Transparent to solid background on scroll
- [x] Enhanced search with autocomplete suggestions
- [x] Profile dropdown menu (instead of just link)
- [x] Mobile hamburger menu with slide-out drawer
- [x] Active link indicator (underline + bold)
- [x] Notification bell icon
- [x] Smooth transitions and animations

---

## 4. Banner/Hero Section

### Features
- [x] Auto-playing video preview after 2s delay
- [x] Mute/unmute toggle
- [x] Dynamic gradient vignette (bottom + left)
- [x] Maturity rating badge
- [x] Genre pills with dot separators
- [x] Match score in green
- [x] Duration and year display
- [x] Play + More Info buttons with proper accessibility
- [x] Netflix-style uppercase title with letter-spacing

---

## 5. Movie Card Redesign

### Features
- [x] Netflix-style hover expand (scale 1.15)
- [x] Video preview on hover (800ms delay)
- [x] Action buttons overlay (Play, Add to List, More Info, Like)
- [x] Match score, rating, duration badges
- [x] Genre pills display
- [x] Top 10 badge
- [x] Continue watching progress bar
- [x] Smooth spring animation on hover
- [x] Proper focus-visible states

---

## 6. Movie Row Redesign

### Features
- [x] Left/right navigation arrows (appear on hover)
- [x] Smooth horizontal scrolling with snap points
- [x] Fade edge indicators (gradient masks)
- [x] Hidden scrollbar
- [x] Section title with proper heading hierarchy
- [x] Row-level loading skeleton

---

## 7. Featured Grid

### Features
- [x] Top 10 with staggered rank numbers
- [x] Poster-style cards (2:3 aspect ratio)
- [x] Hover scale and play button overlay
- [x] Title and metadata on hover
- [x] Responsive grid (2 → 3 → 4 → 5 columns)

---

## 8. Detail Modal Redesign

### Features
- [x] Netflix-style modal with backdrop blur
- [x] Banner image with gradient overlay
- [x] Play, Add to List, Like, Volume buttons
- [x] Metadata: match score, year, rating, duration, HD badge
- [x] Cast and Genres metadata
- [x] "More Like This" with smart recommendations
- [x] Scrollable modal with proper focus management
- [x] Close button with proper accessibility
- [x] Escape key to close

---

## 9. Video Player Redesign

### Features
- [x] Full-screen immersive player
- [x] Auto-hiding controls (3s timeout)
- [x] Progress bar with seek capability
- [x] Volume slider with mute toggle
- [x] Play/Pause, Skip ±10s, Fullscreen
- [x] Settings menu (Quality selector)
- [x] Subtitles button
- [x] Skip Forward / Next Episode
- [x] Keyboard shortcuts (Space/K, M, F, Arrow keys)
- [x] Auto-play next video with countdown prompt
- [x] Watch progress saved to localStorage
- [x] Back button with proper close handler

---

## 10. Browse Page

### Features
- [x] Songs: Square grid with hover play overlay
- [x] Movies/TV: Category rows with MovieRow component
- [x] New & Popular: Sorted by year
- [x] Title count display
- [x] Empty state messaging

---

## 11. My List Page

### Features
- [x] Grid layout (2 → 6 columns responsive)
- [x] Infinite scroll with Intersection Observer
- [x] Loading more indicator
- [x] Empty state messaging
- [x] Movie card with metadata

---

## 12. Search Results Page

### Features
- [x] OTT-style categorized results (Matching Titles, Categories)
- [x] Grid display for matching titles
- [x] MovieRow for category browsing
- [x] Result count display
- [x] Empty state with navigation

---

## 13. Profile Selection

### Features
- [x] Netflix-style "Who's watching?" screen
- [x] Profile avatars with hover ring
- [x] Add Profile button
- [x] Manage Profiles button
- [x] Centered layout with fixed header

---

## 14. Footer

### Features
- [x] Social media links (Facebook, Instagram, Twitter, YouTube)
- [x] Footer links grid
- [x] Service Code button
- [x] Disclaimer text
- [x] Copyright notice

---

## 15. Mobile Experience

### Features
- [x] Bottom navigation bar (Home, Games, New & Hot, My List)
- [x] Hamburger menu for mobile navigation
- [x] Responsive breakpoints (sm, md, lg, xl)
- [x] Safe area padding for bottom nav
- [x] Touch-friendly targets

---

## 16. Loading States

### Features
- [x] Full-screen loading spinner
- [x] Skeleton shimmer animation
- [x] Lazy loading images with `loading="lazy"`
- [x] Smooth page transitions with AnimatePresence

---

## 17. Data Layer

### Features
- [x] Google Sheets CSV data source
- [x] MovieContext for global state
- [x] Watch history in localStorage
- [x] Continue Watching tracking
- [x] Smart related content recommendations (genre, type, year scoring)

---

## Implementation Priority

1. **Phase 1**: Design System CSS + Accessibility foundations
2. **Phase 2**: Navbar + Banner + MovieCard + MovieRow
3. **Phase 3**: DetailModal + FullPlayer
4. **Phase 4**: Browse + MyList + SearchResults + ProfileSelection
5. **Phase 5**: Footer + Mobile experience + Loading states
6. **Phase 6**: Polish, testing, and verification

---

## Tech Stack

- **React 19** - No forwardRef needed, ref as regular prop
- **TypeScript 5.8** - Strict type checking
- **Tailwind CSS v4** - CSS-first config with `@theme`
- **Vite 6** - Fast dev server and builds
- **Motion** - Page transitions and micro-interactions
- **Lucide React** - Icon library
- **React Router v7** - Client-side routing
- **PapaParse** - CSV parsing for Google Sheets data
