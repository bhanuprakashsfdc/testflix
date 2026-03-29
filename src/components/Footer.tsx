import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const links = [
    ['Audio Description', 'Help Centre', 'Gift Cards', 'Media Centre'],
    ['Investor Relations', 'Jobs', 'Terms of Use', 'Privacy'],
    ['Legal Notices', 'Cookie Preferences', 'Corporate Information', 'Contact Us'],
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="px-4 md:px-12 py-10 md:py-16 bg-background border-t border-white/5" role="contentinfo">
      <div className="max-w-5xl mx-auto">
        {/* Social Links */}
        <div className="flex gap-5 mb-8">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="text-neutral-500 hover:text-white transition-colors focus-ring rounded-md p-1"
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {links.flat().map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs md:text-sm text-neutral-500 hover:text-neutral-300 hover:underline underline-offset-2 transition-colors focus-ring rounded"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Service Code */}
        <button className="border border-neutral-600 px-3 py-1.5 text-xs text-neutral-500 mb-6 hover:text-white hover:border-white transition-colors focus-ring rounded">
          Service Code
        </button>

        {/* Disclaimer */}
        <div className="mb-4 p-4 bg-surface-container rounded-lg border border-white/5">
          <p className="text-xs text-neutral-500 leading-relaxed">
            <strong className="text-neutral-400">Disclaimer:</strong> All videos displayed on this website are fetched from YouTube and are not hosted on our servers. We do not own, claim, or have any rights to the content. All videos belong to their respective owners and are shared for educational purposes only. If you own the content and wish to have it removed, please contact us.
          </p>
        </div>

        <p className="text-[11px] text-neutral-600">
          &copy; 1997-2026 TestFlix, Inc.
        </p>
      </div>
    </footer>
  );
}
