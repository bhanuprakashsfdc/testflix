/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  bannerImage: string;
  youtubeUrl: string;
  category: string;
  year: string;
  rating: string;
  duration: string;
  matchScore: string;
  isTop10?: boolean;
  genres: string[];
  cast: string[];
}

export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    thumbnail: "https://picsum.photos/seed/inception-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/inception-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    category: "Trending Now",
    year: "2010",
    rating: "13+",
    duration: "2h 28m",
    matchScore: "98% Match",
    isTop10: true,
    genres: ["Sci-Fi", "Action", "Adventure"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]
  },
  {
    id: "2",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    thumbnail: "https://picsum.photos/seed/interstellar-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/interstellar-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    category: "Trending Now",
    year: "2014",
    rating: "13+",
    duration: "2h 49m",
    matchScore: "95% Match",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
  },
  {
    id: "3",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    thumbnail: "https://picsum.photos/seed/darkknight-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/darkknight-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    category: "Action Movies",
    year: "2008",
    rating: "13+",
    duration: "2h 32m",
    matchScore: "99% Match",
    isTop10: true,
    genres: ["Action", "Crime", "Drama"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
  },
  {
    id: "4",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    thumbnail: "https://picsum.photos/seed/oppenheimer-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/oppenheimer-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    category: "Trending Now",
    year: "2023",
    rating: "R",
    duration: "3h",
    matchScore: "97% Match",
    genres: ["Biography", "Drama", "History"],
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"]
  },
  {
    id: "5",
    title: "Dunkirk",
    description: "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
    thumbnail: "https://picsum.photos/seed/dunkirk-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/dunkirk-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/F-eMt3SrfFU",
    category: "Action Movies",
    year: "2017",
    rating: "13+",
    duration: "1h 46m",
    matchScore: "92% Match",
    genres: ["Action", "Drama", "History"],
    cast: ["Fionn Whitehead", "Barry Keoghan", "Mark Rylance"]
  },
  {
    id: "6",
    title: "Tenet",
    description: "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
    thumbnail: "https://picsum.photos/seed/tenet-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/tenet-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/LdOM0x0xdRo",
    category: "Top Rated",
    year: "2020",
    rating: "13+",
    duration: "2h 30m",
    matchScore: "88% Match",
    genres: ["Action", "Sci-Fi", "Thriller"],
    cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"]
  },
  {
    id: "7",
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    thumbnail: "https://picsum.photos/seed/matrix-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/matrix-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
    category: "Top Rated",
    year: "1999",
    rating: "R",
    duration: "2h 16m",
    matchScore: "99% Match",
    genres: ["Action", "Sci-Fi"],
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
  },
  {
    id: "8",
    title: "Blade Runner 2049",
    description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    thumbnail: "https://picsum.photos/seed/bladerunner-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/bladerunner-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/gCcx85zbxz4",
    category: "Top Rated",
    year: "2017",
    rating: "R",
    duration: "2h 44m",
    matchScore: "94% Match",
    genres: ["Action", "Drama", "Sci-Fi"],
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"]
  },
  {
    id: "9",
    title: "Arrival",
    description: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    thumbnail: "https://picsum.photos/seed/arrival-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/arrival-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/tFMo3UJ4B4g",
    category: "Action Movies",
    year: "2016",
    rating: "13+",
    duration: "1h 56m",
    matchScore: "96% Match",
    genres: ["Drama", "Sci-Fi"],
    cast: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"]
  },
  {
    id: "10",
    title: "The Prestige",
    description: "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    thumbnail: "https://picsum.photos/seed/prestige-thumb/400/600",
    bannerImage: "https://picsum.photos/seed/prestige-banner/1920/1080",
    youtubeUrl: "https://www.youtube.com/embed/o4gHCmTQDVI",
    category: "Top Rated",
    year: "2006",
    rating: "13+",
    duration: "2h 10m",
    matchScore: "93% Match",
    genres: ["Drama", "Mystery", "Sci-Fi"],
    cast: ["Hugh Jackman", "Christian Bale", "Michael Caine"]
  }
];
