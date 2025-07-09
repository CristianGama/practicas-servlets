import { useState } from "react";
import { Alertas } from "../hooks/Alertas.jsx";

export default function FormNomina() {
  const [empleados, setEmpleados] = useState([]);

  const verificarEmpleadosConFaltas = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/empleados");
      const data = await response.json();
      setEmpleados(data); // Guardamos el resultado en el estado
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que se recargue la página
    verificarEmpleadosConFaltas();
  };

  return (
    <>
        

        <div className="bg-[#FFF0E5] h-screen overflow-auto">
            {/* Mostramos alerta si hay empleados con faltas */}
        <Alertas empleados={empleados} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="m-6 space-y-8 bg-white shadow-xl rounded-2xl md:flex-row md:space-y-0">  
              <form onSubmit={handleSubmit}>
                <h1 className="text-center font-sans text-2xl py-0 px-2 my-5 mx-1">
                  NOMINA
                </h1>

                {/* Campos del formulario */}
                <div className="py-2 my-0 m-2">
                  <label className="mb-2 text-sm">NOMBRE EMPLEADO</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </div>

                <div className="py-2 my-0 m-2">
                  <label className="mb-2 text-sm">FECHA DE PAGO</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </div>

                <div className="py-2 my-0 m-2">
                  <label className="mb-2 text-sm">SALARIO NETO</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </div>

                <div className="py-2 my-0 m-2">
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white font-bold p-2 rounded-lg mb-6 hover:bg-[#C8D498] hover:text-white hover:border-[#C8D498]"
                  >
                    VER
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </>
  );
};
