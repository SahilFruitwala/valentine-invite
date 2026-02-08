import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { LOVE_POEMS } from '../constants';
import { Sparkles, RefreshCw } from 'lucide-react';

interface CelebrationProps {
  onReset: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ onReset }) => {
  const [poem, setPoem] = useState<string>("");

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fb7185', '#f43f5e', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fb7185', '#f43f5e', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
    
    // Set initial poem
    pickRandomPoem();
  }, []);

  const pickRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * LOVE_POEMS.length);
    setPoem(LOVE_POEMS[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto z-10 relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <img 
          src="/celebration.png" 
          alt="Celebrating bears" 
          className="w-full max-w-sm mb-8"
        />
      </motion.div>

      <motion.h1 
        className="text-5xl font-handwriting text-valentine-600 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Yay! I knew you'd say yes! <br />
        <span className="text-3xl text-valentine-500 block mt-2">I love you so much! ❤️</span>
      </motion.h1>

      <motion.div
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl mt-4 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4 text-valentine-400">
           <Sparkles size={20} />
           <span className="text-sm font-semibold uppercase tracking-wider">Love Note</span>
           <Sparkles size={20} />
        </div>
        
        <p className="font-handwriting text-2xl text-gray-700 leading-relaxed italic whitespace-pre-line">
          "{poem}"
        </p>
      </motion.div>

      <motion.button
         className="mt-12 text-valentine-700 underline opacity-50 hover:opacity-100 text-sm"
         onClick={onReset}
         initial={{ opacity: 0 }}
         animate={{ opacity: 0.5 }}
         transition={{ delay: 2 }}
      >
        Restart (Just for fun)
      </motion.button>
    </div>
  );
};

export default Celebration;