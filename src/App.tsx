// src/App.tsx
import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./routes/LandingPage";
import Dashboard from "./routes/Dashboard"; // 👈 ESTE import es clave

const App: FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* 👈 usa routes/Dashboard */}
      </Routes>
    </MainLayout>
  );
};

export default App;
