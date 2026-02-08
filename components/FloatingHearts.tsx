import React from 'react';
import { motion } from 'framer-motion';

const FloatingHearts: React.FC = () => {
  // Create an array of hearts to render
  const hearts = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-valentine-300 opacity-20"
          initial={{
            y: "110vh",
            x: Math.random() * 100 + "vw",
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0
          }}
          animate={{
            y: "-10vh",
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 10 + 10, // 10-20s duration
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{
            fontSize: `${Math.random() * 2 + 1}rem`
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
