import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";

export default function AccederRoute() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const from = useMemo(() => (loc.state as any)?.from ?? "/dashboard", [loc.state]);

  const [email, setEmail] = useState("demo@valorar.app");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const res = await login(email.trim(), password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav(from, { replace: true });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Acceder</h1>
        <p className="text-slate-400 mt-1">Login simulado (sin backend).</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-200 text-sm">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-200 hover:bg-sky-500/25 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="text-xs text-slate-400">
            Demo: <span className="text-slate-200">demo@valorar.app</span> /{" "}
            <span className="text-slate-200">demo123</span>
          </div>
        </form>
      </div>
    </div>
  );
}
