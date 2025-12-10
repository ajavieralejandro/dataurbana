import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer: FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-900 bg-slate-950">
      {/* Logo centrado abajo un poco */}
      <div className="w-full flex justify-center mt-4 mb-3">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/"); // Ir a la página principal
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll suave
            }, 10);
          }}
          className="text-xl md:text-2xl font-bold tracking-tight relative group cursor-pointer"
        >
          <span className="text-white transition-colors duration-300 group-hover:text-sky-400">
            ValorAR
          </span>
          <span className="text-sky-400 transition-colors duration-300 group-hover:text-white">
            .app
          </span>
        </Link>
      </div>

      {/* Texto del footer */}
      <div className="max-w-6xl mx-auto px-4 py-1 text-xs md:text-sm text-slate-500 flex justify-between">
        <span>
          © {new Date().getFullYear()} ValorAR. Todos los derechos reservados.
        </span>
        <span>Datos del mercado inmobiliario argentino</span>
      </div>
    </footer>
  );
};

export default Footer;
