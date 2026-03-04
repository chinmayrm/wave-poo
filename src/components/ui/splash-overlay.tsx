import { useState } from "react";
import { VaporTextEffect } from "./vapour-text-effect";

interface SplashOverlayProps {
  onComplete: () => void;
}

export function SplashOverlay({ onComplete }: SplashOverlayProps) {
  const [fading, setFading] = useState(false);

  const handleVaporDone = () => {
    // Start a quick fade-to-transparent, then tell App we're done
    setFading(true);
    setTimeout(onComplete, 400);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <VaporTextEffect
        text="WAVE 3.0"
        fontSize={Math.min(window.innerWidth / 5.5, 140)}
        duration={3000}
        onComplete={handleVaporDone}
      />
    </div>
  );
}

export default SplashOverlay;
