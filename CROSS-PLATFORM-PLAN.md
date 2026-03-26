# TestFlix - Cross-Platform Application Plan

## Executive Summary

This document outlines the comprehensive architecture and implementation strategy for building TestFlix (a Netflix-style streaming application) across four platforms:
- **Website** (Web - Responsive Web App)
- **Android Phone** (Native Android App)
- **iOS Phone** (Native iOS App)
- **Android TV** (Native Android TV App)

---

## 1. Current Technology Stack Analysis

### Existing Stack (Web)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI Framework |
| TypeScript | ~5.8.2 | Type Safety |
| Vite | 6.2.0 | Build Tool |
| Tailwind CSS | 4.1.14 | Styling |
| React Router | 7.13.1 | Navigation |
| Motion | 12.23.24 | Animations |
| Lucide React | 0.546.0 | Icons |

### Data Layer
- Google Sheets as CMS (CSV export)
- YouTube embeds for video playback
- Local storage for user preferences

---

## 2. Recommended Cross-Platform Architecture

### Strategy: **Monorepo with Shared Core**

```
testflix/
├── apps/
│   ├── web/              # Current Vite + React app
│   ├── android-phone/   # React Native (Expo)
│   ├── ios-phone/       # React Native (Expo)
│   └── android-tv/      # React Native TV (Expo)
├── packages/
│   ├── shared/          # Shared business logic, types, services
│   ├── ui/              # Shared UI components library
│   └── config/          # Shared configuration
└── turbo.json           # Monorepo orchestration
```

### Technology Selection

| Platform | Framework | Rationale |
|----------|-----------|-----------|
| Web | React + Vite (existing) | Already implemented |
| Android Phone | React Native (Expo) | Code sharing with web |
| iOS Phone | React Native (Expo) | Code sharing with web |
| Android TV | React Native TV (Expo) | TV-optimized, code sharing |

### Why React Native for All Platforms?
1. **Code Reusability**: 70-90% code sharing between platforms
2. **Team Efficiency**: Single team can maintain all apps
3. **Web Skills Transfer**: React knowledge applies directly
4. **Expo Ecosystem**: Simplified build/deployment
5. **Native Modules**: Access to native APIs when needed

---

## 3. Shared Core Architecture

### Package Structure

#### 3.1 `@testflix/shared` - Business Logic
```
packages/shared/
├── src/
│   ├── types/
│   │   ├── movie.ts
│   │   ├── user.ts
│   │   └── navigation.ts
│   ├── services/
│   │   ├── movieService.ts    # Modified for each platform
│   │   ├── authService.ts
│   │   └── storageService.ts
│   ├── hooks/
│   │   ├── useMovies.ts
│   │   ├── useSearch.ts
│   │   └── useUser.ts
│   └── utils/
│       ├── youtube.ts
│       └── formatters.ts
```

#### 3.2 `@testflix/ui` - Shared Components
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── MovieCard/
│   │   ├── MovieRow/
│   │   ├── Banner/
│   │   ├── SearchBar/
│   │   └── VideoPlayer/
│   ├── screens/
│   │   ├── HomeScreen/
│   │   ├── BrowseScreen/
│   │   ├── SearchScreen/
│   │   └── PlayerScreen/
│   └── theme/
│       ├── colors.ts
│       ├── spacing.ts
│       └── typography.ts
```

---

## 4. Platform-Specific Implementations

### 4.1 Website (Web)
**Location**: `apps/web/`

#### Current Implementation (Keep as-is)
- Vite + React 19 + Tailwind CSS
- Responsive design (mobile-first)
- Desktop: Full navbar with hover effects
- Mobile: Bottom navigation bar

#### Enhancements Needed
| Feature | Priority | Description |
|---------|----------|-------------|
| PWA Support | High | Service worker, offline caching, manifest |
| SEO Optimization | High | Meta tags, Open Graph, structured data |
| Performance | Medium | Code splitting, lazy loading, image optimization |

#### Build Output
```
web/
├── dist/              # Static files for deployment
│   ├── index.html
│   ├── assets/
│   └── manifest.json
```

---

### 4.2 Android Phone
**Location**: `apps/android-phone/`

#### Technology Stack
- **Framework**: Expo SDK 52+ (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context + Zustand
- **Video Player**: Expo AV or React Native Video

#### App Structure
```
android-phone/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Home
│   │   ├── search.tsx
│   │   ├── browse.tsx
│   │   └── profile.tsx
│   ├── movie/
│   │   └── [id].tsx
│   └── player/
│       └── [id].tsx
├── src/
│   └── native/           # Android-specific code
├── android/               # Native Android project
└── package.json
```

#### Required Packages
```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-av": "~15.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-screen-orientation": "~8.0.0",
    "expo-haptics": "~14.0.0",
    "@react-native-async-storage/async-storage": "2.1.0"
  }
}
```

#### Platform-Specific Features
| Feature | Implementation |
|---------|---------------|
| Gesture Navigation | React Native Gesture Handler |
| Status Bar | expo-status-bar (transparent on player) |
| Haptic Feedback | expo-haptics on button press |
| Offline Mode | AsyncStorage for favorites/history |
| Video Playback | expo-av with fullscreen support |

---

### 4.3 iOS Phone
**Location**: `apps/ios-phone/`

#### Technology Stack
- **Framework**: Expo SDK 52+ (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Context + Zustand
- **Video Player**: Expo AV or React Native Video

#### App Structure (Similar to Android Phone)
```
ios-phone/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── search.tsx
│   │   ├── browse.tsx
│   │   └── profile.tsx
│   ├── movie/
│   │   └── [id].tsx
│   └── player/
│       └── [id].tsx
├── ios/                   # Native iOS project
└── package.json
```

#### Required Packages
```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-av": "~15.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-screen-orientation": "~8.0.0",
    "expo-haptics": "~14.0.0",
    "@react-native-async-storage/async-storage": "2.1.0"
  }
}
```

#### Platform-Specific Features
| Feature | Implementation |
|---------|---------------|
| Native Feel | iOS-specific animations (UIKit) |
| Safe Area | SafeAreaView for notch handling |
| Haptic Feedback | expo-haptics |
| Video Playback | expo-av with AirPlay support |
| App Icon | iOS-optimized icons |

#### Key Differences from Android
- Different splash screen
- iOS-specific permissions (Info.plist)
- Apple TV integration (AirPlay)
- Different haptic patterns
- TestFlight distribution

---

### 4.4 Android TV
**Location**: `apps/android-tv/`

#### Technology Stack
- **Framework**: React Native TV (Expo with expo-tv)
- **Language**: TypeScript
- **Navigation**: React Navigation (TV-focused)
- **State Management**: React Context + Zustand
- **Video Player**: React Native Video

#### TV-Specific Packages
```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-tv": "~14.0.0",
    "@react-navigation/native": "~7.0.0",
    "@react-navigation/native-stack": "~7.0.0",
    "react-native-video": "^6.9.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "expo-haptics": "~14.0.0"
  }
}
```

#### App Structure
```
android-tv/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── BrowseScreen.tsx
│   │   ├── MovieDetailScreen.tsx
│   │   └── PlayerScreen.tsx
│   ├── components/
│   │   ├── TVMovieCard.tsx     # Focusable, larger touch targets
│   │   ├── TVBanner.tsx
│   │   ├── TVRemoteControl.tsx
│   │   └── TVNavigationMenu.tsx
│   ├── navigation/
│   │   └── TVRootNavigator.tsx
│   └── hooks/
│       ├── useTVFocus.ts
│       ├── useRemoteControl.ts
│       └── useTVDimensions.ts
├── android-tv/                  # Native Android TV project
└── package.json
```

#### TV-Specific Features
| Feature | Implementation |
|---------|---------------|
| 10-foot UI | Large fonts, high contrast, big buttons |
| D-Pad Navigation | React Native TV focus system |
| Remote Control | Gesture handling for D-pad |
| Leanback | Android TV Leanback integration |
| HDR Support | react-native-video HDR |
| 4K Support | Native video decoding |
| Bluetooth Audio | Standard Android audio APIs |

#### TV Remote Key Handling
```typescript
// Example: D-pad navigation handling
const handleRemoteKey = (key: string) => {
  switch (key) {
    case 'up': navigateFocus('up');
    case 'down': navigateFocus('down');
    case 'left': navigateFocus('left');
    case 'right': navigateFocus('right');
    case 'enter': selectCurrentItem();
    case 'back': goBack();
  }
};
```

---

## 5. Data Synchronization Strategy

### 5.1 Offline-First Architecture
```
┌─────────────────────────────────────────────┐
│                 Cloud Backend               │
│         (Google Sheets / Database)          │
└─────────────────────┬───────────────────────┘
                      │
              ┌───────┴───────┐
              │  Sync Service  │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │  Phone  │   │  Phone  │   │   Web   │
   │  (SQL)  │   │  (SQL)  │   │ (Local) │
   └─────────┘   └─────────┘   └─────────┘
```

### 5.2 Data Storage
| Data Type | Storage | Sync |
|-----------|---------|------|
| Movie Catalog | In-memory + caching | On app launch |
| User Preferences | AsyncStorage | Local only |
| Watch History | AsyncStorage | Local only |
| Favorites | AsyncStorage + optional backend | Local + cloud |
| Profiles | AsyncStorage | Local only |

### 5.3 Movie Service Adaptation
```typescript
// packages/shared/src/services/movieService.ts
export class MovieService {
  // Web: Fetch from Google Sheets CSV
  static async fetchMovies(): Promise<Movie[]>
  
  // Mobile: Cache locally, sync periodically
  static async fetchMoviesFromCache(): Promise<Movie[]>
  static async syncMovies(): Promise<void>
  
  // All platforms
  static searchMovies(query: string): Movie[]
  static getMovieById(id: string): Movie | undefined
  static getTrendingMovies(): Movie[]
}
```

---

## 6. Video Playback Strategy

### 6.1 Platform Comparison
| Feature | Web | Android | iOS | Android TV |
|---------|-----|---------|-----|------------|
| Player | YouTube Embed | expo-av | expo-av | react-native-video |
| Quality | 1080p | 1080p | 1080p | 4K HDR |
| Offline | No | Yes | Yes | Limited |
| Controls | Custom | Native | Native | D-pad |
| Background | No | No | No | No |

### 6.2 YouTube Integration
```typescript
// Web: Direct embed
<iframe src="https://www.youtube.com/embed/{videoId}" />

// Mobile: YouTube Native SDK or WebView
import { YouTube } from 'expo-youtube';

// TV: Dedicated player
import Video from 'react-native-video';
```

---

## 7. Build & Deployment Pipeline

### 7.1 Development Workflow
```
┌────────────────────────────────────────────────────────────┐
│                     Development                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Write   │───▶│  Test    │───▶│  Debug   │              │
│  │  Code    │    │  (Expo)  │    │  (Logs)  │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│       │                                        │             │
└───────┼────────────────────────────────────────┼─────────────┘
        │                                        │
        ▼                                        ▼
┌────────────────────────────────────────────────────────────┐
│                      Build                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │   Web    │    │ Android  │    │   iOS    │    Android TV│
│  │  Build   │    │  Build   │    │  Build   │    Build     │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
└───────┼──────────────┼───────────────┼───────────────┼────────
        │              │               │               │
        ▼              ▼               ▼               ▼
┌────────────────────────────────────────────────────────────┐
│                    Deployment                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐│
│  │ Vercel/  │    │  Google  │    │  App     │    │ Google││
│  │  Netlify │    │  Play    │    │  Store   │    │  Play ││
│  └──────────┘    └──────────┘    └──────────┘    └───────┘│
└────────────────────────────────────────────────────────────┘
```

### 7.2 Build Commands
```bash
# Web
npm run build                     # Vite production build
npx expo export --platform web    # If using Expo for web

# Android Phone
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease

# iOS Phone
npx expo prebuild --platform ios
cd ios && xcodebuild -workspace

# Android TV
npx expo prebuild --platform android
# Modify for TV in android/gradle.properties
cd android-tv && ./gradlew assembleRelease
```

### 7.3 Distribution
| Platform | Store | Format | Certificate |
|----------|-------|--------|-------------|
| Web | Vercel/Netlify | Static files | HTTPS |
| Android Phone | Google Play | APK/AAB | Google Play signing |
| iOS Phone | App Store | IPA | Apple distribution |
| Android TV | Google Play | AAB | Google Play signing |

---

## 8. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up monorepo structure with Turborepo
- [ ] Extract shared packages (@testflix/shared, @testflix/ui)
- [ ] Configure package publishing
- [ ] Set up CI/CD pipeline

### Phase 2: Mobile Apps (Weeks 3-6)
- [ ] Initialize Expo project for Android phone
- [ ] Implement navigation and core screens
- [ ] Integrate video playback
- [ ] Add platform-specific features
- [ ] Test on physical devices

### Phase 3: TV App (Weeks 7-8)
- [ ] Set up React Native TV project
- [ ] Implement TV-specific navigation (D-pad)
- [ ] Optimize UI for 10-foot experience
- [ ] Implement TV remote control handling
- [ ] Test with Android TV emulator

### Phase 4: Polish & Deploy (Weeks 9-10)
- [ ] Performance optimization
- [ ] App store compliance (stores, metadata)
- [ ] Beta testing
- [ ] Final releases

---

## 9. Key Considerations

### 9.1 Performance Targets
| Metric | Target |
|--------|--------|
| App Launch | < 2 seconds |
| Screen Transition | < 300ms |
| Video Start | < 1 second (cached) |
| Memory Usage | < 200MB |

### 9.2 Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Detox for mobile, custom for TV
- **Manual Testing**: Device lab for various screens

### 9.3 Maintenance
- Monthly dependency updates
- Quarterly feature releases
- Annual platform review

---

## 10. Estimated Code Reuse

| Layer | Web → Mobile | Mobile → TV |
|-------|--------------|-------------|
| Business Logic | 100% | 100% |
| Services | 100% | 100% |
| Types/Interfaces | 100% | 100% |
| UI Components | 60% | 40% |
| Navigation | 0% (different routers) | 0% |
| Platform APIs | 0% | 0% |

**Total Code Reuse: ~70-80%**

---

## 11. Next Steps

1. **Immediate**: Set up monorepo and extract shared code
2. **Short-term**: Build Android phone app (MVP)
3. **Medium-term**: Add iOS and TV support
4. **Long-term**: Add backend, authentication, offline sync

---

## Appendix A: Package.json Template for Mobile Apps

### Expo App (android-phone or ios-phone)
```json
{
  "name": "testflix-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "build:android": "expo prebuild --platform android && cd android && ./gradlew assembleDebug",
    "lint": "eslint .",
    "test": "jest"
  },
  "dependencies": {
    "@testflix/shared": "*",
    "@testflix/ui": "*",
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "typescript": "~5.3.0"
  }
}
```

### Android TV App
```json
{
  "name": "testflix-tv",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "react-native start",
    "android:tv": "react-native run-android --variant=tvdebug",
    "build:android:tv": "cd android && ./gradlew assembleTvDebug"
  },
  "dependencies": {
    "@testflix/shared": "*",
    "@testflix/ui": "*",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-video": "^6.9.0",
    "react-native-tv-controls": "^1.0.0"
  }
}
```

---

*Document Version: 1.0*
*Last Updated: 2026-03-26*
