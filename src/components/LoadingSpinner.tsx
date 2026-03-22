/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
      />
    </div>
  );
}
