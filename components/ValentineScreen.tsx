import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NO_PHRASES, IMAGES } from "../constants";
import { Heart, AlertTriangle } from "lucide-react";

interface ValentineScreenProps {
  onSuccess: () => void;
}

const ValentineScreen: React.FC<ValentineScreenProps> = ({ onSuccess }) => {
  const [noCount, setNoCount] = useState(0);
  const [noStyle, setNoStyle] = useState<{
    top: string;
    left: string;
    position: "absolute" | "relative";
  }>({
    top: "auto",
    left: "auto",
    position: "relative",
  });
  const [showFunnyModal, setShowFunnyModal] = useState(false);
  const [isYesDisabled, setIsYesDisabled] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(0);

  // After 5 attempts, the button stops running away
  const MAX_RUN_AWAY_ATTEMPTS = 5;

  const moveButton = () => {
    let newX, newY;
    let attempts = 0;

    // Try to find a position that is far enough from the last position
    do {
      // Constrain within 5% to 80% to keep it on screen
      newX = Math.random() * 75 + 5;
      newY = Math.random() * 75 + 5;

      const deltaX = newX - lastPos.current.x;
      const deltaY = newY - lastPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Avoid the "Danger Zone" (Center of screen where Yes button usually is)
      // Yes button is typically around Left 20-80% and Top 40-60%
      // We define a box in the middle to avoid
      const inDangerZoneX = newX > 25 && newX < 75;
      const inDangerZoneY = newY > 40 && newY < 60;

      // Conditions to accept new position:
      // 1. Must be far enough from last position
      // 2. AND Should not be in the center danger zone (unless we really can't find a spot)
      const isFarEnough = distance > 25 || attempts >= 10;
      const isSafeZone = !inDangerZoneX || !inDangerZoneY || attempts >= 15;

      if (isFarEnough && isSafeZone) {
        break;
      }
      attempts++;
    } while (true);

    lastPos.current = { x: newX, y: newY };

    setNoStyle({
      position: "absolute",
      top: `${newY}%`,
      left: `${newX}%`,
    });
  };

  const handleInteraction = (
    source: "mouse" | "touch",
    e?: React.SyntheticEvent,
  ) => {
    if (showFunnyModal) return;

    // CRITICAL FIX: Disable Yes button briefly to prevent ghost clicks
    // triggering the Yes button after No moves away
    setIsYesDisabled(true);
    setTimeout(() => setIsYesDisabled(false), 800);

    // Prevent default behavior on touch to stop emulated mouse events
    if (source === "touch" && noCount < MAX_RUN_AWAY_ATTEMPTS) {
      e?.preventDefault();
      e?.stopPropagation(); // Also stop propagation
    }

    // Throttle interactions
    const now = Date.now();
    if (now - lastInteractionTime.current < 400) return;
    lastInteractionTime.current = now;

    if (noCount < MAX_RUN_AWAY_ATTEMPTS) {
      setNoCount((prev) => prev + 1);
      moveButton();
    }
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showFunnyModal) return;

    const now = Date.now();
    const isRecent = now - lastInteractionTime.current < 400;

    if (noCount < MAX_RUN_AWAY_ATTEMPTS) {
      if (!isRecent) {
        handleInteraction("mouse", e);
      }
    } else {
      setShowFunnyModal(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }
  };

  const yesButtonSize = noCount * 15 + 16;

  const getBearImage = () => {
    if (noCount === 0) return IMAGES.Asking;
    if (noCount > 0 && noCount < 3) return IMAGES.Shocked;
    if (noCount >= 3 && noCount < MAX_RUN_AWAY_ATTEMPTS) return IMAGES.Crying;
    return IMAGES.Crying;
  };

  const getNoText = () => {
    return NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)];
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl p-4 text-center min-h-screen h-dvh overflow-hidden select-none touch-none">
      {/* Error Modal */}
      <AnimatePresence>
        {showFunnyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-md w-full text-center border-4 border-valentine-400 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-valentine-400 to-valentine-600"></div>

              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                transition={{ duration: 0.6 }}
              >
                <AlertTriangle className="w-16 h-16 text-valentine-500 mx-auto mb-4" />
              </motion.div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                System Overload!
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                The "No" button has malfunctioned due to excessive cuteness.
                <br />
                <br />
                <strong className="text-valentine-600">
                  Forcing a "YES" in 3... 2... 1...
                </strong>
              </p>

              <div className="w-full bg-gray-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner border border-gray-200">
                <motion.div
                  className="bg-gradient-to-r from-valentine-400 to-valentine-600 h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card p-6 md:p-12 rounded-[2rem] w-full max-w-lg mx-auto flex flex-col items-center relative"
      >
        {/* Decorative floating elements */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-valentine-200 rounded-full blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-valentine-300 rounded-full blur-xl opacity-60 animate-pulse delay-700"></div>

        <motion.div
          key={getBearImage()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="mb-6 md:mb-8 relative"
        >
          <div className="relative">
            <img
              src={getBearImage()}
              alt="Cute bear reaction"
              className="w-72 h-72 md:w-56 md:h-56 object-cover transform transition-transform duration-300 pointer-events-none"
            />
            {noCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-4 -right-4 bg-white text-valentine-600 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold shadow-md border-2 border-valentine-100"
              >
                {noCount < MAX_RUN_AWAY_ATTEMPTS ? "?" : "!"}
              </motion.div>
            )}
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-handwriting text-valentine-600 mb-6 md:mb-8 drop-shadow-sm select-none leading-relaxed px-2 pointer-events-none">
          Will you be my Valentine?
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 w-full relative min-h-[140px]">
          <motion.button
            layout
            disabled={isYesDisabled}
            className={`bg-gradient-to-br from-green-400 to-green-600 text-white font-bold rounded-full shadow-lg shadow-green-200/50 flex items-center justify-center gap-3 relative overflow-hidden group touch-manipulation transition-opacity duration-200 ${isYesDisabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "opacity-100"}`}
            style={{
              // Cap the size growth on mobile
              fontSize: Math.min(yesButtonSize, 35),
              padding: `${Math.min(yesButtonSize / 2.5, 20)}px ${Math.min(yesButtonSize, 40)}px`,
              zIndex: 30,
            }}
            whileHover={!isYesDisabled ? { scale: 1.05 } : {}}
            whileTap={!isYesDisabled ? { scale: 0.95 } : {}}
            animate={{
              scale: isYesDisabled ? 1 : [1, 1.02, 1],
            }}
            onClick={onSuccess}
          >
            <span className="relative z-10 flex items-center gap-2">
              Yes{" "}
              <Heart className="fill-current animate-pulse w-5 h-5 md:w-6 md:h-6" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </motion.button>

          <motion.button
            className={`bg-white text-valentine-500 hover:bg-valentine-50 border-2 border-valentine-200 font-bold py-3 px-6 rounded-full shadow-sm hover:shadow-md transition-all whitespace-nowrap z-50 touch-action-none select-none ${showFunnyModal ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            style={{
              position: noStyle.position,
              top: noStyle.top,
              left: noStyle.left,
              transition:
                "top 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            animate={
              noCount < MAX_RUN_AWAY_ATTEMPTS
                ? {
                    rotate: [0, -5, 5, 0],
                  }
                : { rotate: 0 }
            }
            onMouseEnter={(e) => handleInteraction("mouse", e)}
            onTouchStart={(e) => handleInteraction("touch", e)}
            onClick={handleNoClick}
          >
            {getNoText()}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ValentineScreen;
