import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfileSelection() {
  const navigate = useNavigate();

  const profiles = [
    { name: 'User 1', avatar: 'https://picsum.photos/seed/user1/200/200' },
    { name: 'Kids', avatar: 'https://picsum.photos/seed/kids/200/200' },
    { name: 'Guest', avatar: 'https://picsum.photos/seed/guest/200/200' },
  ];

  const handleProfileSelect = () => {
    navigate('/');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      <header className="fixed top-0 w-full z-50 h-16 md:h-20 flex items-center justify-center bg-gradient-to-b from-black/40 to-transparent">
        <div className="text-2xl md:text-3xl font-black text-primary tracking-tighter uppercase font-headline">
          TESTFLIX
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-14"
      >
        <h1 className="font-headline font-bold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight">
          Who's watching?
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl w-full"
      >
        {profiles.map((profile, index) => (
          <motion.button
            key={profile.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
            onClick={handleProfileSelect}
            className="group flex flex-col items-center space-y-3 outline-none focus-ring rounded-xl p-2"
            aria-label={`Select profile: ${profile.name}`}
          >
            <div className="relative aspect-square w-full max-w-[140px] md:max-w-[160px] overflow-hidden rounded-lg transition-all duration-200 group-hover:ring-2 group-hover:ring-white/70 group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <img
                src={profile.avatar}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm md:text-lg text-neutral-400 group-hover:text-white transition-colors duration-200 font-medium">
              {profile.name}
            </span>
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="group flex flex-col items-center space-y-3 outline-none focus-ring rounded-xl p-2"
          aria-label="Add new profile"
        >
          <div className="relative aspect-square w-full max-w-[140px] md:max-w-[160px] flex items-center justify-center bg-surface-container rounded-lg transition-all duration-200 group-hover:bg-surface-container-high group-hover:ring-2 group-hover:ring-white/70">
            <PlusCircle className="w-14 h-14 text-neutral-600 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm md:text-lg text-neutral-400 group-hover:text-white transition-colors duration-200 font-medium">
            Add Profile
          </span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 md:mt-20"
      >
        <button className="px-8 py-2.5 border border-neutral-600 text-neutral-400 tracking-[0.2em] uppercase text-xs md:text-sm hover:border-white hover:text-white transition-all duration-200 rounded focus-ring font-medium">
          Manage Profiles
        </button>
      </motion.div>
    </main>
  );
}
