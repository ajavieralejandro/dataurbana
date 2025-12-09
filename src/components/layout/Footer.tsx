import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-500 flex justify-between">
        <span>
          © {new Date().getFullYear()} ValorAR. Todos los derechos reservados.
        </span>
        <span>Datos del mercado inmobiliario argentino</span>
      </div>
    </footer>
  );
};

export default Footer;
