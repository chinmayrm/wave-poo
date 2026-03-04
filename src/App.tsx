import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SplashOverlay } from "@/components/ui/splash-overlay";
import { MainPage } from "@/pages/MainPage";
import { ProjectPage } from "@/pages/ProjectPage";

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {/* Splash overlay — plays on every page load / refresh */}
      {!splashDone && <SplashOverlay onComplete={() => setSplashDone(true)} />}

      {/* Actual pages render underneath; visible once splash finishes */}
      <div style={{ visibility: splashDone ? "visible" : "hidden" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/project" element={<ProjectPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
