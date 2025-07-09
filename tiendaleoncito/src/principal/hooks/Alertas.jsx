import { useEffect, useState } from "react";

export const Alertas = ({ empleados }) => {
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [visible, setVisible] = useState(false); // controla la visibilidad

  useEffect(() => {
    try {
      const conMasDe10Faltas = empleados.filter(e => e.total_faltas > 10);

      if (conMasDe10Faltas.length > 0) {
        setMensaje(
          `Empleados con más de 10 faltas: ${conMasDe10Faltas
            .map(e => `#${e.id} (${e.total_faltas} faltas)`)
            .join(", ")}`
        );
        setTipo("error");
      } else {
        setMensaje("Todos los empleados tienen menos de 10 faltas.");
        setTipo("success");
      }

      // Mostrar mensaje y ocultarlo después de 1 segundo (1000ms)
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 3000);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error al verificar faltas:", error);
      setMensaje("Error al verificar faltas.");
      setTipo("error");
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [empleados]);

  if (!visible || !mensaje) return null;

  return (
    <div
      className={`p-4 rounded-md mb-4 text-sm transition-opacity duration-500 ${
        tipo === "error"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {mensaje}
    </div>
  );
};
