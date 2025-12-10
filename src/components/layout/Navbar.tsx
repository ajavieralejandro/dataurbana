import { FC, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

const Navbar: FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-[100] border-b border-slate-800 backdrop-blur-xl transition-all duration-500
    ${isScrolled ? "bg-slate-950/60" : "bg-slate-950/90"}
  `}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/"); // Ir a la página principal
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll suave
            }, 10);
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

        {/* Botones del centro */}
        <div className="flex gap-6 text-lg md:text-xl font-medium">
          <Link
            to="/alquilar"
            className="relative group text-slate-400 hover:text-white transition-colors duration-300"
          >
            Venta
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
          <Link
            to="/vender"
            className="relative group text-slate-400 hover:text-white transition-colors duration-300"
          >
            Alquiler
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
          <Link
            to="/invertir"
            className="relative group text-slate-400 hover:text-white transition-colors duration-300"
          >
            Inversión
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>

          {/* Botón Más */}
          <div className="relative flex items-center" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-300 h-full"
            >
              &#8230; {/* 3 puntos horizontales */}
            </button>
            {moreOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-slate-900 border border-slate-700 rounded shadow-lg z-[110]">
                <Link
                  to="/noticias"
                  className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Noticias
                </Link>
                <Link
                  to="/info-financiera"
                  className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Información financiera
                </Link>
                <Link
                  to="/heatmaps"
                  className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Heatmaps
                </Link>
                <Link
                  to="/heatmaps"
                  className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Botones a la derecha */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/tu-numero"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-white text-2xl transition-colors duration-300"
          >
            <BsWhatsapp />
          </a>

          <Link
            to="/acceder"
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-md transition-all duration-300"
          >
            <FiUser /> Acceder
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
