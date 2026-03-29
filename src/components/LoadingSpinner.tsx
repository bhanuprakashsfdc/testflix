import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div
      className="fixed inset-0 z-[300] bg-black flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-[3px] border-neutral-700 border-t-primary rounded-full"
      />
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
