// src/App.tsx
import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./routes/LandingPage";
import Dashboard from "./routes/Dashboard";

import ReferenceValuesRoute from "./routes/ReferenceValuesRoute";
import QuickValuerRoute from "./routes/QuickValuerRoute";

const App: FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* NUEVO */}
        <Route path="/valores" element={<ReferenceValuesRoute />} />
        <Route path="/tasador" element={<QuickValuerRoute />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
