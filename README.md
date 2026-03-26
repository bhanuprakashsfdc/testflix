# TestFlix - Streaming Application

A modern streaming-style web application inspired by OTT platforms, built with React + Vite + Tailwind CSS.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

**Server runs at**: http://localhost:3000

---

## 🎯 Project Overview

### Current Features
- **Hero Banner**: Featured content with auto-playing video preview
- **Content Rows**: Trending, Top Rated, Action Movies categories
- **Video Player**: Full-screen YouTube embed with custom controls
- **Movie Details**: Modal with movie information and related suggestions
- **Profile Selection**: Multiple user profile support
- **My List**: Saved movies/watching later
- **Responsive Design**: Works on mobile, tablet, and desktop

### Tech Stack
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Data**: Google Sheets CSV via PapaParse

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Banner.tsx        # Hero banner with video
│   ├── MovieCard.tsx    # Movie tile with hover effects
│   ├── MovieRow.tsx     # Horizontal scroll row
│   ├── FullPlayer.tsx   # Video player modal
│   ├── DetailModal.tsx  # Movie details popup
│   ├── Navbar.tsx       # Navigation header
│   └── Footer.tsx       # Page footer
├── pages/            # Route pages
│   ├── Home.tsx         # Main landing page
│   ├── MyList.tsx       # Saved movies
│   └── ProfileSelection.tsx  # User profiles
├── context/          # React context
│   └── MovieContext.tsx     # Movie data provider
├── services/         # Data fetching
│   └── movieService.ts     # CSV to JSON conversion
├── utils/            # Helper functions
│   └── watchHistory.ts     # Watch progress tracking
└── data/             # Static data
    └── movies.ts         # Movie interface/types
```

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | TypeScript check |
| `npm run clean` | Remove build artifacts |

---

## 📋 User Stories (Future Development)

See [`stories.md`](stories.md) for 100 user stories for the **User Stores** e-commerce project - a future frontend-only application with no login/backend requirements.

---

## 🎨 Design System

- **Background**: `#131413` (Dark theme)
- **Primary**: `#e50914` (Accent red)
- **Typography**: 
  - Headlines: Be Vietnam Pro
  - Body: Inter
- **Animations**: Smooth hover effects, carousel scrolling

---

## 📄 License

This project is for educational/demonstration purposes. Movie data is fetched from a public Google Sheet.
