import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vf_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('vf_cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('vf_cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[300] p-3 md:p-4"
        >
          <div className="max-w-4xl mx-auto bg-neutral-900/98 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#e50914]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-5 h-5 text-[#e50914]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium mb-0.5">We value your privacy</p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
              <button
                onClick={decline}
                className="flex-1 md:flex-none px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 rounded-lg transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="flex-1 md:flex-none px-4 py-2 text-xs font-medium text-white bg-[#e50914] rounded-lg hover:bg-[#c40812] transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={decline}
                className="p-2 text-neutral-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
