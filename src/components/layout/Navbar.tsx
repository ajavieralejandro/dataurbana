import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: FC = () => {
  const location = useLocation();

  const isActive = (path: string): string =>
    location.pathname === path ? "text-white" : "text-slate-400";

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          ValorAR<span className="text-sky-400">.app</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className={isActive("/")}>
            Inicio
          </Link>
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
