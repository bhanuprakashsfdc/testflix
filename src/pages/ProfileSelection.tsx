/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <header className="fixed top-0 w-full z-50 h-20 flex items-center justify-center">
        <div className="text-3xl font-black text-primary tracking-tighter uppercase font-headline">
          TESTFLIX
        </div>
      </header>

      <div className="text-center mb-12">
        <h1 className="font-headline font-bold text-4xl md:text-6xl text-on-surface tracking-tight mb-4">
          Who's watching?
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-5xl w-full">
        {profiles.map((profile) => (
          <button
            key={profile.name}
            onClick={handleProfileSelect}
            className="group flex flex-col items-center space-y-4 transition-transform duration-250 ease-in-out hover:scale-105 outline-none"
          >
            <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-xl transition-all duration-200 shadow-xl group-hover:ring-4 group-hover:ring-on-surface">
              <img
                src={profile.avatar || undefined}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-label text-lg md:text-xl text-on-surface-variant transition-colors duration-200 group-hover:text-on-surface">
              {profile.name}
            </span>
          </button>
        ))}

        <button className="group flex flex-col items-center space-y-4 transition-transform duration-250 ease-in-out hover:scale-105 outline-none">
          <div className="relative aspect-square w-full max-w-[160px] flex items-center justify-center bg-surface-container-high rounded-xl transition-all duration-200 hover:bg-surface-bright shadow-xl group-hover:bg-on-surface/10">
            <PlusCircle className="w-16 h-16 text-on-surface-variant/40 group-hover:text-on-surface transition-colors" />
          </div>
          <span className="font-label text-lg md:text-xl text-on-surface-variant transition-colors group-hover:text-on-surface">
            Add Profile
          </span>
        </button>
      </div>

      <div className="mt-20">
        <button className="px-8 py-2 border-2 border-on-surface-variant/40 text-on-surface-variant/80 font-label tracking-[0.2em] uppercase text-sm hover:border-on-surface hover:text-on-surface transition-all duration-200 rounded-sm">
          Manage Profiles
        </button>
      </div>
    </main>
  );
}
