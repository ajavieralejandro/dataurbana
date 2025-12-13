import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

const LS_KEY = "du_auth_v1";

function hasStoredUser() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.user;
  } catch {
    return false;
  }
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  const loc = useLocation();

  const authed = isAuthed || hasStoredUser();

  if (!authed) {
    return <Navigate to="/acceder" replace state={{ from: loc.pathname }} />;
  }

  return <>{children}</>;
}
