import React from 'react';
import { Link } from 'react-router-dom';
 
export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/walmart-mexico-2.jpg"
            alt="Walmart logo"
            className="w-32 h-auto"
          />
          <h1 className="text-xl font-bold">Sistema de Productos</h1>
        </div>
 
        <nav className="flex gap-4">
          <Link to="/form-productos" className="hover:underline">Formulario Productos</Link>
          <Link to="/form-proveedores" className="hover:underline">Formulario Proveedores</Link>
          <Link to="/form-personal" className="hover:underline">Formulario Personal</Link>
          <Link to="/form-nomina" className="hover:underline">Formulario Nomina</Link>
          <Link to="/form-inventario" className="hover:underline">Formulario Inventario</Link>
   
        </nav>
      </div>
    </header>
  );
}
 
