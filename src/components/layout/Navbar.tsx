import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { useAuth } from "../../auth/auth";

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthed, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cerrar al navegar
  const go = (to: string) => {
    setMobileOpen(false);
    navigate(to);
  };

  const NavItem = ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      to={to}
      onClick={() => {
        onClick?.();
        setMobileOpen(false);
      }}
      className="relative group text-slate-300 hover:text-white transition-colors duration-200 whitespace-nowrap"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-[100] border-b border-slate-800 backdrop-blur-xl transition-all duration-300
      ${isScrolled ? "bg-slate-950/60" : "bg-slate-950/90"}`}
    >
      <nav className="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          onClick={() => {
            go("/");
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
          }}
          className="text-2xl md:text-3xl font-bold tracking-tight relative group cursor-pointer"
        >
          <span className="text-white transition-colors duration-200 group-hover:text-sky-400">
            ValorAR
          </span>
          <span className="text-sky-400 transition-colors duration-200 group-hover:text-white">
            .app
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          <NavItem to="/alquilar">Venta</NavItem>
          <NavItem to="/vender">Alquiler</NavItem>
          <NavItem to="/invertir">Inversión</NavItem>
          <NavItem to="/noticias">Noticias</NavItem>
          <NavItem to="/info-financiera">Finanzas</NavItem>
          <NavItem to="/heatmaps">Heatmaps</NavItem>
          <NavItem to="/contacto">Contacto</NavItem>

          {isAuthed && (
            <>
              <NavItem to="/dashboard">Dashboard</NavItem>
              <NavItem to="/tasador">Tasador</NavItem>
              <NavItem to="/valores">Valores</NavItem>
            </>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/tu-numero"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900/50 transition-all duration-200"
            aria-label="WhatsApp"
          >
            <BsWhatsapp className="text-lg" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>

          {!isAuthed ? (
            <Link
              to="/acceder"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-md transition-all duration-200"
            >
              <FiUser /> Acceder
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-xs text-slate-300">
                {user?.name} <span className="text-slate-500">({user?.email})</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  go("/acceder");
                }}
                className="px-4 py-2 bg-slate-900/60 hover:bg-slate-900 text-slate-200 rounded-md border border-slate-800 transition-all duration-200"
              >
                Salir
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 hover:border-sky-400 transition"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenuAlt3 className="text-xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/90">
          <div className="px-4 sm:px-6 lg:px-10 py-4 flex flex-col gap-3 text-base font-medium">
            <NavItem to="/alquilar">Venta</NavItem>
            <NavItem to="/vender">Alquiler</NavItem>
            <NavItem to="/invertir">Inversión</NavItem>
            <NavItem to="/contacto">Contacto</NavItem>

            {isAuthed && (
              <>
                <div className="h-px bg-slate-800 my-1" />
                <NavItem to="/dashboard">Dashboard</NavItem>
                <NavItem to="/tasador">Tasador</NavItem>
                <NavItem to="/valores">Valores</NavItem>
              </>
            )}

            <div className="h-px bg-slate-800 my-1" />

            {!isAuthed ? (
              <button
                onClick={() => go("/acceder")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-md transition-all duration-200"
              >
                <FiUser /> Acceder
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  go("/acceder");
                }}
                className="px-4 py-2 bg-slate-900/60 hover:bg-slate-900 text-slate-200 rounded-md border border-slate-800 transition-all duration-200"
              >
                Salir
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
