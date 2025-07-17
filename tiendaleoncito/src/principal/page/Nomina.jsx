import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Nomina = () => {
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [reporte, setReporte] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/api/personal/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setEmpleado(data.data);
        } else {
          setReporte("No se encontró al empleado.");
        }
      })
      .catch((error) => {
        console.error("Error al obtener el empleado:", error);
        setReporte("Error al conectar con el servidor.");
      });
  }, [id]);

  useEffect(() => {
    if (!empleado) return;

    const salarioBase = parseFloat(empleado.salario.replace(/[^0-9.-]+/g, "")) || 0;
    const iva = 150;
    const isr = 100;
    const ventas = 300;
    const aumento = 200;

    const deducciones = iva + isr;
    const salarioFinal = salarioBase - deducciones + aumento + ventas;

    const mensaje = `
Nómina del empleado (ID: ${empleado.id} / Nombre: ${empleado.nombre} ${empleado.apellido})

El C. ${empleado.nombre} ${empleado.apellido}, gana $${salarioBase.toFixed(
      2
    )}, tiene el puesto "${empleado.puesto}" y tiene las siguientes deducciones:
- IVA: $${iva.toFixed(2)}
- ISR: $${isr.toFixed(2)}

Durante el mes obtuvo los siguientes incrementos:
- Ventas al mes: $${ventas.toFixed(2)}
- Aumento de salario: $${aumento.toFixed(2)}

Teniendo como salario final: $${salarioFinal.toFixed(2)}

Atentamente, Gerente General.
    `.trim();

    setReporte(mensaje);
  }, [empleado]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-10 bg-green-50 border border-green-300 p-6 rounded-xl shadow-md max-w-2xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-4 text-green-800">
        📄 Reporte de Nómina
      </h2>

      {empleado ? (
        <>
          <div className="whitespace-pre-line bg-white p-4 rounded shadow text-gray-800">
            {reporte}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Imprimir
            </button>
          </div>
        </>
      ) : (
        <p className="text-red-600 font-medium mb-4">{reporte}</p>
      )}
    </div>
  );
};
