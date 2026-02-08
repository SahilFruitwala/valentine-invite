import React, { useState } from "react";
import FloatingHearts from "./components/FloatingHearts";
import ValentineScreen from "./components/ValentineScreen";
import Celebration from "./components/Celebration";

const App: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen h-dvh mesh-bg flex items-center justify-center overflow-hidden relative">
      {/* Background Effect */}
      <FloatingHearts />

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-valentine-200/40 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-valentine-300/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-200/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex items-center justify-center h-full p-4">
        {!isSuccess ? (
          <ValentineScreen onSuccess={() => setIsSuccess(true)} />
        ) : (
          <Celebration onReset={() => setIsSuccess(false)} />
        )}
      </main>

      {/* Footer / Credits */}
      <footer className="absolute bottom-2 w-full text-center text-valentine-800/40 text-xs font-medium z-10 mix-blend-multiply">
        Made with ❤️
      </footer>
    </div>
  );
};

export default App;
