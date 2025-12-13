import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";

export default function LoginRoute() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const from = useMemo(() => {
    const st = loc.state as any;
    return st?.from ?? "/dashboard";
  }, [loc.state]);

  const [email, setEmail] = useState("demo@dataurbana.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav(from, { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white">Ingresar</h1>
          <p className="text-slate-400 mt-1">
            Login simulado (sin backend). Luego lo conectamos a tu API.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
              placeholder="demo@dataurbana.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
              placeholder="demo123"
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
            Credenciales demo:
            <div className="mt-1">
              <span className="text-slate-200">demo@dataurbana.com</span> / <span className="text-slate-200">demo123</span>
            </div>
            <div className="mt-1">
              <span className="text-slate-200">admin@dataurbana.com</span> / <span className="text-slate-200">admin123</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
