'use client';
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Riquelme Propiedades
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-200">Inicio</Link>
          <Link href="/propiedades" className="hover:text-gray-200">Propiedades</Link>
          <Link href="/contacto" className="hover:text-gray-200">Contacto</Link>
        </div>

        {/* Menu Mobile */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 px-4 pb-4 space-y-2">
          <Link href="/" className="block py-2 hover:bg-blue-500 rounded">Inicio</Link>
          <Link href="/propiedades" className="block py-2 hover:bg-blue-500 rounded">Propiedades</Link>
          <Link href="/contacto" className="block py-2 hover:bg-blue-500 rounded">Contacto</Link>
        </div>
      )}
    </nav>
  );
}
