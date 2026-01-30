import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Riquelme Propiedades. Todos los derechos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/aviso-legal" className="text-gray-400 hover:text-white text-sm">
            Aviso Legal
          </Link>
          <Link href="/contacto" className="text-gray-400 hover:text-white text-sm">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
