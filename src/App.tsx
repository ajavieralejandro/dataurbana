// src/App.tsx
import type { FC } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./routes/LandingPage";
import Dashboard from "./routes/Dashboard";
import ReferenceValuesRoute from "./routes/ReferenceValuesRoute";
import QuickValuerRoute from "./routes/QuickValuerRoute";
import AccederRoute from "./routes/AccederRoute";

import { AuthProvider } from "./auth/auth";
import { RequireAuth } from "./auth/RequireAuth";

const App: FC = () => {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/acceder" element={<AccederRoute />} />

          {/* Privadas */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/valores"
            element={
              <RequireAuth>
                <ReferenceValuesRoute />
              </RequireAuth>
            }
          />

          <Route
            path="/tasador"
            element={
              <RequireAuth>
                <QuickValuerRoute />
              </RequireAuth>
            }
          />
        </Routes>
      </MainLayout>
    </AuthProvider>
  );
};

export default App;
