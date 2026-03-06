import { Routes, Route, Navigate } from "react-router-dom";
import { MainPage } from "@/pages/MainPage";
import { ProjectPage } from "@/pages/ProjectPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/project" element={<ProjectPage />} />
    </Routes>
  );
}

export default App;
