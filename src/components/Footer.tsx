/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const links = [
    'Audio Description', 'Help Centre', 'Gift Cards', 'Media Centre',
    'Investor Relations', 'Jobs', 'Terms of Use', 'Privacy',
    'Legal Notices', 'Cookie Preferences', 'Corporate Information', 'Contact Us'
  ];

  return (
    <footer className="px-6 md:px-12 py-12 bg-background border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-6 mb-8">
          <Facebook className="w-6 h-6 text-on-surface cursor-pointer hover:text-white transition-colors" />
          <Instagram className="w-6 h-6 text-on-surface cursor-pointer hover:text-white transition-colors" />
          <Twitter className="w-6 h-6 text-on-surface cursor-pointer hover:text-white transition-colors" />
          <Youtube className="w-6 h-6 text-on-surface cursor-pointer hover:text-white transition-colors" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {links.map((link) => (
            <a 
              key={link} 
              href="#" 
              className="text-sm text-on-surface-variant hover:underline transition-all"
            >
              {link}
            </a>
          ))}
        </div>
        
        <button className="border border-on-surface-variant/50 px-2 py-1 text-xs text-on-surface-variant mb-6 hover:text-on-surface hover:border-on-surface transition-colors">
          Service Code
        </button>
        
        {/* Copyright Disclaimer */}
        <div className="mb-4 p-3 bg-surface-container rounded-lg border border-white/5">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <strong className="text-white">Disclaimer:</strong> All videos displayed on this website are fetched from YouTube and are not hosted on our servers. We do not own, claim, or have any rights to the content. All videos belong to their respective owners and are shared for educational purposes only. If you own the content and wish to have it removed, please contact us.
          </p>
        </div>
        
        <p className="text-[11px] text-on-surface-variant/60">
          © 1997-2026 TestFlix, Inc.
        </p>
      </div>
    </footer>
  );
}
