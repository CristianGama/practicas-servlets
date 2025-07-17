import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Layout from './principal/page/Layout.jsx'
import App from "./App.jsx";
import FormPersonal from "./principal/page/FormPersonal.jsx"
import FormProductos from './principal/page/FormProductos.jsx'
import FormNomina from './principal/page/FormNomina.jsx'
import Productos from './principal/page/Productos.jsx'
import FormProveedores from './principal/page/FormProveedores.jsx'
import Proveedores from './principal/page/Proveedores.jsx'
import ReporteProductos from './principal/page/ReporteProductos.jsx'
import ReporteProveedores from './principal/page/ReporteProveedores.jsx'
import Personal from './principal/page/Personal.jsx'
import FormInventario from './principal/page/FormInventario.jsx'
import Inventario from './principal/page/Inventario.jsx'
import ConsultaInventario from './principal/page/ConsultaInventario.jsx'
import { Nomina } from "./principal/page/Nomina.jsx";
import { AuthFrom } from "./principal/auth/AuthFrom.jsx";

const router = createBrowserRouter([
{
    path: '/',
    element: <Layout />, // ENVUELVE TODO EN EL HEADER
    children: [
{ index: true, element: <App /> },
  {
    path: "/auth",
    element: <AuthFrom/>, 
  },
  {
    path: '/consulta-inventario/:id',
    element: <ConsultaInventario/>
  },
  {
    path: '/inventario',
    element: <Inventario/>
  },
  {
    path: '/form-inventario',
    element: <FormInventario/>
  },
  {
    path: '/modificar-inventario',
    element: <FormInventario/>
  },
  {
    path: '/form-personal',
    element: <FormPersonal/>
  },
  {
    path: '/modificar-personal',
    element: <FormPersonal/>
  },
  {
    path: '/personal',
    element: <Personal/>
  },
  {
    path: '/form-productos',
    element: <FormProductos/>
  },

  {
    path: '/form-proveedores',
    element: <FormProveedores/>
  },
  {
    path: '/proveedores',
    element: <Proveedores/>
  },

  {
    path: '/modificar-proveedor',
    element: <FormProveedores/>
  },
  {
    path: '/form-nomina',
    element: <FormNomina/>
  },

  {
    path: '/productos',
    element: <Productos/>
  },
  {
    path: '/modificar-producto',
    element: <FormProductos/>
  },

  {
    path: '/reporte-productos',
    element: <ReporteProductos/>
  },

  {
    path: '/reporte-proveedores',
    element: <ReporteProveedores/>
  },
  {
    path:'/nomina/:id',
    element: <Nomina/>
  }
    ]
  }
]);
window.addEventListener("DOMContentLoaded", (event => {
  createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );
  
}))
