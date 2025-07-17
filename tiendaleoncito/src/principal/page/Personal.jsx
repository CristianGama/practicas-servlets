import { useState, useEffect } from "react";

export default function Personal() {
  const [personalList, setPersonalList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/personal");
      const data = await res.json();
      if (data.success) {
        setPersonalList(data.data);
      } else {
        alert("Error al obtener datos de personal");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, []);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este registro?"
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:4000/api/personal/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Personal eliminado correctamente");
        fetchPersonal();
      } else {
        alert("Error al eliminar personal");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
      console.error(error);
    }
  };

  const handleModificar = (persona) => {
    window.location.href = 'http://localhost:5173/modificar-personal?id='+persona.id
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-blue-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Lista de Personal
        </h2>
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Cargando...</p>
        ) : personalList.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No hay registros de personal.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-indigo-600 text-white rounded-t-lg">
                <tr>
                  {[
                    "ID",
                    "Nombre",
                    "Apellido",
                    "CURP",
                    "RFC",
                    "Teléfono",
                    "Correo",
                    "Matutino",
                    "Vespertino",
                    "Salario",
                    "Puesto",
                    "Acciones",
                  ].map((header) => (
                    <th
                      key={header}
                      className="py-3 px-4 text-center font-semibold select-none whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {personalList.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-200 hover:bg-indigo-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    }`}
                  >
                    <td className="px-4 py-2 text-center">{p.id}</td>
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.apellido}</td>
                    <td className="px-4 py-2">{p.curp}</td>
                    <td className="px-4 py-2">{p.rfc}</td>
                    <td className="px-4 py-2">{p.telefono}</td>
                    <td className="px-4 py-2 truncate max-w-xs" title={p.correo}>{p.correo}</td>
                    <td className="px-4 py-2 text-center font-medium text-green-600">{p.matutino ? "Sí" : "No"}</td>
                    <td className="px-4 py-2 text-center font-medium text-purple-600">{p.vespertino ? "Sí" : "No"}</td>
                    <td className="px-4 py-2">{p.salario}</td>
                    <td className="px-4 py-2 capitalize">{p.puesto}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        onClick={() => handleModificar(p)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md shadow-md transition"
                        aria-label={`Modificar personal ${p.nombre} ${p.apellido}`}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => handleEliminar(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md shadow-md transition"
                        aria-label={`Eliminar personal ${p.nombre} ${p.apellido}`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
