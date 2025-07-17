import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormNomina() {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/personal")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmpleados(data.data);
          if (data.data.length > 0) {
            setEmpleadoSeleccionado(data.data[0].id); // Selección por defecto
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener empleados:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (empleadoSeleccionado) {
      navigate(`/nomina/${empleadoSeleccionado}`);
    }
  };

  return (
    <div className="bg-[#FFF0E5] min-h-screen overflow-auto flex items-center justify-center">
      <div className="m-6 space-y-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h1 className="text-center font-sans text-2xl font-bold text-orange-600 mb-4">
            NÓMINA
          </h1>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              NOMBRE DEL EMPLEADO
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={empleadoSeleccionado}
              onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            >
              {empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.nombre} {empleado.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold p-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              VER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
