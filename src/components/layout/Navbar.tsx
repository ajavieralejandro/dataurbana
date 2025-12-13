import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className="relative group text-slate-400 hover:text-white transition-colors duration-300 whitespace-nowrap"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-[100] border-b border-slate-800 backdrop-blur-xl transition-all duration-500
      ${isScrolled ? "bg-slate-950/60" : "bg-slate-950/90"}`}
    >
      {/* ✅ full width */}
      <nav className="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
          }}
          className="text-2xl md:text-3xl font-bold tracking-tight relative group cursor-pointer"
        >
          <span className="text-white transition-colors duration-300 group-hover:text-sky-400">
            ValorAR
          </span>
          <span className="text-sky-400 transition-colors duration-300 group-hover:text-white">
            .app
          </span>
        </Link>

        {/* Centro */}
        <div className="hidden md:flex items-center gap-6 text-lg md:text-xl font-medium">
          <NavItem to="/alquilar">Venta</NavItem>
          <NavItem to="/vender">Alquiler</NavItem>
          <NavItem to="/invertir">Inversión</NavItem>
          <NavItem to="/noticias">Noticias</NavItem>
          <NavItem to="/info-financiera">Finanzas</NavItem>
          <NavItem to="/heatmaps">Heatmaps</NavItem>
          <NavItem to="/contacto">Contacto</NavItem>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3">
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

          <Link
            to="/acceder"
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-md transition-all duration-300"
          >
            <FiUser /> Acceder
          </Link>
        </div>
      </nav>

      {/* Mobile */}
      <div className="md:hidden border-t border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3 flex gap-5 overflow-x-auto text-base font-medium">
          <NavItem to="/alquilar">Venta</NavItem>
          <NavItem to="/vender">Alquiler</NavItem>
          <NavItem to="/invertir">Inversión</NavItem>
          <NavItem to="/contacto">Contacto</NavItem>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
