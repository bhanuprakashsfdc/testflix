import { Music, X } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { motion } from 'motion/react';

export default function MusicToggle() {
  const { isMusicMode, toggleMusicMode, songs } = useMusic();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleMusicMode}
      className={`fixed top-20 md:top-24 right-4 md:right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg ${
        isMusicMode
          ? 'bg-[#e50914] text-white shadow-[#e50914]/30'
          : 'bg-neutral-800/90 backdrop-blur text-neutral-300 hover:bg-neutral-700 hover:text-white border border-white/10'
      }`}
      aria-label={isMusicMode ? 'Disable music mode' : 'Enable music mode'}
      aria-pressed={isMusicMode}
    >
      {isMusicMode ? (
        <>
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Music</span>
        </>
      ) : (
        <>
          <Music className="w-4 h-4" />
          <span className="hidden sm:inline">Music Mode</span>
          {songs.length > 0 && (
            <span className="bg-[#e50914]/20 text-[#e50914] text-xs px-1.5 py-0.5 rounded-full font-bold">
              {songs.length}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}
