import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import App from "./App.jsx";
import FormPersonal from "./principal/page/FormPersonal.jsx"
import FormProductos from './principal/page/FormProductos.jsx'
import FormNomina from './principal/page/FormNomina.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
  },
  {
    path: '/form-personal',
    element: <FormPersonal/>
  },
  {
    path: '/form-productos',
    element: <FormProductos/>
  },
  {
    path: '/form-nomina',
    element: <FormNomina/>
  }
]);

window.addEventListener("DOMContentLoaded", (event => {
  createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );
  
}))
