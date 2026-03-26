# User Stories - TestFlix Streaming Application

## Project Overview
- **Project Name**: TestFlix
- **Type**: Static Frontend Web Application (No Login, No Backend)
- **Target Users**: Streaming viewers, movie enthusiasts, TV show watchers
- **PI Planning Focus**: Multi-team development across 4 PIs
- **Current URL**: http://localhost:3000

---

## Current App Architecture

### Components Identified
- **Navbar**: Logo, navigation, search bar, notifications, profile
- **Banner**: Hero section with featured movie, play/info buttons
- **MovieRow**: Horizontal scrollable content rows
- **MovieCard**: Movie tiles with hover video preview
- **FullPlayer**: Full-screen video player with custom controls
- **DetailModal**: Movie details popup with related content
- **ProfileSelection**: Multiple user profile management
- **MyList**: Saved movies/watching later
- **Footer**: Links, social media, copyright
- **LoadingSpinner**: Loading state indicator

---

## PI 1: Core Streaming Experience

### Epic 1.1: Navigation & Header (Stories 1-15)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 1 | As a viewer, I want to see the TestFlix logo in the header so that I can identify the app | P0 | 1 |
| 2 | As a viewer, I want navigation links (Home, TV Shows, Movies, New & Popular, My List) so that I can browse content | P0 | 3 |
| 3 | As a viewer, I want a search bar in the header so that I can find movies/shows by title | P0 | 5 |
| 4 | As a viewer, I want to see notification bell so that I can check updates | P1 | 2 |
| 5 | As a viewer, I want to see my profile avatar in the header so that I can access account | P0 | 2 |
| 6 | As a viewer, I want the header to become semi-transparent on scroll so that it doesn't distract | P1 | 3 |
| 7 | As a viewer, I want a mobile hamburger menu so that I can navigate on mobile | P0 | 5 |
| 8 | As a viewer, I want a mobile bottom navigation bar so that I can access key pages | P0 | 5 |
| 9 | As a viewer, I want to click on navigation links so that I can go to different sections | P0 | 3 |
| 10 | As a viewer, I want the navbar to be sticky so that navigation is always accessible | P1 | 2 |
| 11 | As a viewer, I want active navigation state to be highlighted so that I know where I am | P1 | 2 |
| 12 | As a viewer, I want hover effects on navigation links so that I get visual feedback | P2 | 1 |
| 13 | As a viewer, I want to see social media icons in footer so that I can follow TestFlix | P2 | 1 |
| 14 | As a viewer, I want to see footer links (Help, Terms, Privacy) so that I can access legal info | P1 | 2 |
| 15 | As a viewer, I want the search to support autocomplete suggestions so that I can find content faster | P1 | 5 |

### Epic 1.2: Hero Banner (Stories 16-25)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 16 | As a viewer, I want to see a large hero banner with featured content so that I know what's popular | P0 | 5 |
| 17 | As a viewer, I want to see the movie title on the banner so that I know what to watch | P0 | 3 |
| 18 | As a viewer, I want to see match score (percentage) so that I know the relevance | P0 | 2 |
| 19 | As a viewer, I want to see year, rating, duration badges so that I know movie details | P0 | 2 |
| 20 | As a viewer, I want to see movie description so that I know what the movie is about | P0 | 3 |
| 21 | As a viewer, I want a "Play" button so that I can start watching | P0 | 3 |
| 22 | As a viewer, I want a "More Info" button so that I can see details | P0 | 3 |
| 23 | As a viewer, I want to see a muted video preview auto-play so that I can see previews | P1 | 5 |
| 24 | As a viewer, I want a mute/unmute toggle so that I can control audio | P1 | 2 |
| 25 | As a viewer, I want a vignette gradient effect so that text is more readable | P1 | 2 |

---

## PI 2: Content Browsing

### Epic 2.1: Movie Rows (Stories 26-40)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 26 | As a viewer, I want to see "Trending Now" row so that I can find popular content | P0 | 3 |
| 27 | As a viewer, I want to see "Top Rated" row so that I can find best content | P0 | 3 |
| 28 | As a viewer, I want to see "Action Movies" row so that I can browse genres | P0 | 3 |
| 29 | As a viewer, I want to see horizontal scrolling rows so that I can browse more content | P0 | 5 |
| 30 | As a viewer, I want to scroll horizontally to see more movies so that I can browse all | P0 | 3 |
| 31 | As a viewer, I want to see category titles so that I know what category I'm viewing | P0 | 2 |
| 32 | As a viewer, I want smooth scrolling so that browsing feels premium | P1 | 3 |
| 33 | As a viewer, I want to see "Continue Watching" row so that I can resume watching | P0 | 5 |
| 34 | As a viewer, I want progress bars on continue watching so that I see my progress | P1 | 3 |
| 35 | As a viewer, I want to hide scrollbars so that UI looks cleaner | P2 | 1 |
| 36 | As a viewer, I want responsive row layouts so that it works on all screen sizes | P0 | 5 |
| 37 | As a viewer, I want to see content rows with different categories so that I can explore genres | P0 | 3 |
| 38 | As a viewer, I want infinite scroll feel so that I can browse endlessly | P1 | 5 |
| 39 | As a viewer, I want lazy loading for images so that page loads faster | P1 | 5 |
| 40 | As a viewer, I want to see loading skeleton while content loads so that I know content is coming | P1 | 3 |

### Epic 2.2: Movie Cards (Stories 41-55)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 41 | As a viewer, I want to see movie thumbnail cards so that I can see what's available | P0 | 3 |
| 42 | As a viewer, I want hover effects on cards so that I get visual feedback | P0 | 3 |
| 43 | As a viewer, I want cards to scale up on hover so that I can focus on content | P0 | 3 |
| 44 | As a viewer, I want video preview on hover so that I can see previews | P0 | 8 |
| 45 | As a viewer, I want to see play button overlay on hover so that I know I can play | P0 | 2 |
| 46 | As a viewer, I want to see "Add to List" button on hover so that I can save for later | P0 | 3 |
| 47 | As a viewer, I want to see "More Info" button on hover so that I can get details | P0 | 2 |
| 48 | As a viewer, I want to see title on card hover so that I know what movie it is | P0 | 2 |
| 49 | As a viewer, I want to see match score on card so that I know relevance | P0 | 2 |
| 50 | As a viewer, I want to see rating badge on card so that I know content rating | P0 | 2 |
| 51 | As a viewer, I want to see duration on card so that I know movie length | P0 | 2 |
| 52 | As a viewer, I want to see genre tags on card so that I know the category | P1 | 2 |
| 53 | As a viewer, I want to see "TOP 10" badge on top cards so that I know trending content | P1 | 2 |
| 54 | As a viewer, I want smooth transition animations so that it feels premium | P1 | 3 |
| 55 | As a viewer, I want to click on card to play movie so that I can start watching | P0 | 3 |

---

## PI 3: Video Player & Details

### Epic 3.1: Full Video Player (Stories 56-70)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 56 | As a viewer, I want to click play and see full-screen player so that I can watch content | P0 | 5 |
| 57 | As a viewer, I want custom player controls so that I can control playback | P0 | 5 |
| 58 | As a viewer, I want play/pause button so that I can control playback | P0 | 3 |
| 59 | As a viewer, I want skip forward/backward buttons so that I can navigate | P0 | 3 |
| 60 | As a viewer, I want progress bar so that I can scrub through content | P0 | 5 |
| 61 | As a viewer, I want volume control so that I can adjust audio | P0 | 3 |
| 62 | As a viewer, I want mute/unmute toggle so that I can control audio | P0 | 2 |
| 63 | As a viewer, I want fullscreen toggle so that I can go fullscreen | P0 | 3 |
| 64 | As a viewer, I want "Back" button to exit player so that I can return to browsing | P0 | 2 |
| 65 | As a viewer, I want controls to auto-hide so that I can focus on video | P1 | 3 |
| 66 | As a viewer, I want controls to show on mouse movement so that I can interact | P1 | 2 |
| 67 | As a viewer, I want to see current time and duration so that I know progress | P0 | 2 |
| 68 | As a viewer, I want progress bar preview on hover so that I can preview position | P1 | 3 |
| 69 | As a viewer, I want click on progress bar to seek so that I can jump to position | P0 | 3 |
| 70 | As a viewer, I want to see "Episode Skip" button so that I can skip episodes | P1 | 2 |

### Epic 3.2: Detail Modal (Stories 71-85)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 71 | As a viewer, I want to click "More Info" and see detail modal so that I can get full details | P0 | 5 |
| 72 | As a viewer, I want to see movie title in modal so that I know what I'm viewing | P0 | 2 |
| 73 | As a viewer, I want to see movie banner image in modal so that I see visual | P0 | 3 |
| 74 | As a viewer, I want to see match score, year, rating in modal so that I see details | P0 | 2 |
| 75 | As a viewer, I want to see full description so that I understand the plot | P0 | 3 |
| 76 | As a viewer, I want to see cast list so that I know starring actors | P0 | 3 |
| 77 | As a viewer, I want to see genres so that I know the category | P0 | 2 |
| 78 | As a viewer, I want "Play" button in modal so that I can start watching | P0 | 3 |
| 79 | As a viewer, I want "Add to List" button in modal so that I can save | P0 | 3 |
| 80 | As a viewer, I want "Like" button in modal so that I can express preference | P1 | 2 |
| 81 | As a viewer, I want to see "More Like This" section so that I can find similar content | P0 | 5 |
| 82 | As a viewer, I want to click related content to play so that I can discover more | P0 | 3 |
| 83 | As a viewer, I want close button to close modal so that I can return to browsing | P0 | 2 |
| 84 | As a viewer, I want to click outside modal to close so that I have another close option | P1 | 2 |
| 85 | As a viewer, I want smooth modal animation so that it feels premium | P1 | 3 |

---

## PI 4: User Experience Features

### Epic 4.1: My List & Profiles (Stories 86-100)

| # | User Story | Priority | Story Points |
|---|------------|----------|--------------|
| 86 | As a viewer, I want "My List" page so that I can see saved content | P0 | 5 |
| 87 | As a viewer, I want to add movies to my list so that I can save for later | P0 | 3 |
| 88 | As a viewer, I want to remove movies from my list so that I can manage saved items | P0 | 3 |
| 89 | As a viewer, I want to see my list displayed as grid so that I can browse easily | P0 | 3 |
| 90 | As a viewer, I want to see movie details under each card so that I know what I'm saving | P0 | 3 |
| 91 | As a viewer, I want "Profile Selection" page so that I can choose my profile | P0 | 5 |
| 92 | As a viewer, I want to see multiple profile avatars so that I can select mine | P0 | 3 |
| 93 | As a viewer, I want to click on profile and go to home so that I can start watching | P0 | 3 |
| 94 | As a viewer, I want "Add Profile" option so that I can create new profiles | P1 | 3 |
| 95 | As a viewer, I want "Manage Profiles" button so that I can edit profiles | P1 | 2 |
| 96 | As a viewer, I want my watch progress to be saved so that I can resume later | P0 | 5 |
| 97 | As a viewer, I want continue watching row to show progress bars so that I know where I left off | P0 | 3 |
| 98 | As a viewer, I want loading spinner while content loads so that I know it's working | P0 | 3 |
| 99 | As a viewer, I want smooth page transitions so that navigation feels fluid | P1 | 5 |
| 100 | As a viewer, I want error state handling so that I know when something fails | P1 | 3 |

---

## PI Planning Summary

### Total Stories: 100
### Total Story Points: 268

### Distribution by Priority
| Priority | Count | Story Points |
|----------|-------|--------------|
| P0 (Critical) | 55 | 157 |
| P1 (High) | 35 | 91 |
| P2 (Medium/Low) | 10 | 20 |

### Distribution by PI
| PI | Stories | Points | Focus Area |
|----|---------|--------|------------|
| PI 1 | 25 | 72 | Core Streaming & Navigation |
| PI 2 | 30 | 86 | Content Browsing |
| PI 3 | 30 | 85 | Video Player & Details |
| PI 4 | 15 | 25 | User Experience Features |

### Team Assignments (Suggested)
| Team | Focus Areas | Stories |
|------|-------------|---------|
| Team A | Navbar, Banner, Footer | 1-25, 13-14 |
| Team B | MovieRow, MovieCard | 26-55 |
| Team C | FullPlayer, DetailModal | 56-85 |
| Team D | MyList, Profiles, Watch History | 86-100 |

### Dependencies
- **Story 22-23** (Banner actions): Requires Stories 16-21 (Banner setup)
- **Story 44** (Video preview on hover): Requires Stories 42-43 (Hover effects)
- **Story 56** (FullPlayer): Requires Stories 55 (Card click) and 41-54 (MovieCard)
- **Story 71** (DetailModal): Requires Stories 55 (Card click) and 41-54 (MovieCard)
- **Story 78-80** (Modal buttons): Requires Story 56 (FullPlayer ready)
- **Story 87-88** (My List): Requires Stories 41-54 (Add/Remove functionality)
- **Story 96-97** (Watch Progress): Requires Story 56 (FullPlayer)

### Risks & Mitigations
1. **Risk**: Video preview on hover (Story 44) may impact performance - **Mitigation**: Implement with delayed loading (800ms delay)
2. **Risk**: Custom video player (Stories 56-70) complex interactions - **Mitigation**: Use existing YouTube iframe API
3. **Risk**: Watch progress persistence - **Mitigation**: Use localStorage for persistence

---

## Current Website Status
- **URL**: http://localhost:3000
- **Running**: Yes
- **Tech Stack**: React 19 + Vite 6 + Tailwind CSS 4 + Motion
- **Data Source**: Google Sheets CSV (via PapaParse)

---

## Notes
- All features are frontend-only (no login, no backend required)
- Movie data is fetched from a public Google Sheet
- Focus on responsive design for mobile, tablet, and desktop
- Accessibility compliance: WCAG 2.1 AA standards
- Performance target: <3s initial load time