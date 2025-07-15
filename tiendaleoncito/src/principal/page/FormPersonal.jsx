import { useState } from "react";

export default function FormPersonal() {
  const [personal, setpersonal] = useState({
    nombre: "",
    apellido: "",
    curp: "",
    rfc: "",
    telefono: "",
    correo: "",
    matutino: false,
    vespertino: false,
    salario: "",
    puesto: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setpersonal({ ...personal, [name]: value });
  };

  const limpiarFormulario = () => {
    setpersonal({
      nombre: "",
      apellido: "",
      curp: "",
      rfc: "",
      telefono: "",
      correo: "",
      matutino: false,
      vespertino: false,
      salario: "",
      puesto: "",
    });
  };

  const handleSubmitConfirmado = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personal),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      alert("Personal registrado correctamente");
      limpiarFormulario();
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Ocurrió un error al registrar.");
      setMostrarModal(false);
    }
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    setMostrarModal(true);
  };

  const handleCancelar = () => {
    setMostrarModal(false);
  };

  const handleConsultar = () => {
    alert("Consulta no implementada todavía");
  };

  return (
    <div className="bg-[#f4f6f8] min-h-screen flex items-center justify-center font-sans relative">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-3xl text-center font-bold text-[#2c3e50] mb-6">REGISTRO DE PERSONAL</h1>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* campos */}
            {[
              ["Nombre", "nombre"],
              ["Apellido", "apellido"],
              ["CURP", "curp"],
              ["RFC", "rfc"],
              ["Teléfono", "telefono"],
              ["Correo", "correo"],
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={personal[name]}
                  onChange={onInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Turno Matutino</label>
              <input
                type="checkbox"
                name="matutino"
                checked={personal.matutino}
                onChange={(e) =>
                  setpersonal({ ...personal, matutino: e.target.checked })
                }
                className="h-5 w-5 text-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Turno Vespertino</label>
              <input
                type="checkbox"
                name="vespertino"
                checked={personal.vespertino}
                onChange={(e) =>
                  setpersonal({ ...personal, vespertino: e.target.checked })
                }
                className="h-5 w-5 text-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Salario</label>
              <select
                name="salario"
                value={personal.salario}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona</option>
                <option value="$1000">$1000</option>
                <option value="$3000">$3000</option>
                <option value="$5000">$5000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Puesto</label>
              <select
                name="puesto"
                value={personal.puesto}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona</option>
                <option value="cajero">Cajero</option>
                <option value="empleado">Empleado</option>
                <option value="externo">Externo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <button
              onClick={handleRegistrar}
              className="bg-[#e67e22] text-white font-bold p-2 rounded-lg hover:bg-[#d35400] transition"
            >
              Registrar Persona
            </button>
            <button
              onClick={handleConsultar}
              className="bg-[#2980b9] text-white font-bold p-2 rounded-lg hover:bg-[#2471a3] transition"
            >
              Consultar
            </button>
            <button
              onClick={limpiarFormulario}
              type="button"
              className="bg-gray-500 text-white font-bold p-2 rounded-lg hover:bg-gray-600 transition"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Confirmar Registro</h2>
            <p className="text-center mb-6">¿Estás seguro de registrar esta persona?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelar}
                className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitConfirmado}
                className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
              >
                Sí, registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
