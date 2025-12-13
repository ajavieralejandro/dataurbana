import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type User = {
  name: string;
  email: string;
  role: "admin" | "analyst";
};

type AuthState = {
  user: User | null;
  isAuthed: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const LS_KEY = "du_auth_v1";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user ?? null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (!user) {
    localStorage.removeItem(LS_KEY);
    return;
  }
  localStorage.setItem(LS_KEY, JSON.stringify({ user }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(loadUser());
  }, []);

  const value = useMemo<AuthState>(() => {
    return {
      user,
      isAuthed: !!user,

      login: async (email: string, password: string) => {
        const ok =
          (email === "demo@dataurbana.com" && password === "demo123") ||
          (email === "admin@dataurbana.com" && password === "admin123");

        if (!ok) {
          return {
            ok: false as const,
            error: "Credenciales inválidas (probá demo@dataurbana.com / demo123)",
          };
        }

        const u: User = email.startsWith("admin")
          ? { name: "Admin", email, role: "admin" }
          : { name: "Demo", email, role: "analyst" };

        setUser(u);
        saveUser(u);
        return { ok: true as const };
      },

      logout: () => {
        setUser(null);
        saveUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
