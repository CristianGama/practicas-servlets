import { useEffect, useState } from "react";

export const Nomina = () => {
  const [reporte, setReporte] = useState("");

  useEffect(() => {
    try {
      const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

      if (empleados.length === 0) {
        setReporte("No hay empleados registrados en la nómina.");
        return;
      }

      // Usamos el primer empleado como ejemplo
      const e = empleados[0];

      // Cálculo del salario final
      const salarioBase = parseFloat(e.salario) || 0;
      const iva = parseFloat(e.iva) || 0;
      const isr = parseFloat(e.isr) || 0;
      const ventas = parseFloat(e.ventas) || 0;
      const aumento = parseFloat(e.aumento) || 0;

      const deducciones = iva + isr;
      const salarioFinal = salarioBase - deducciones + aumento + ventas;

      const mensaje = `
Nómina del empleado (ID: ${e.id} / Nombre: ${e.nombre})

El C. ${e.nombre}, gana $${salarioBase.toFixed(2)}, tiene el puesto "${e.puesto}" y tiene las siguientes deducciones:
- IVA: $${iva.toFixed(2)}
- ISR: $${isr.toFixed(2)}

Durante el mes obtuvo los siguientes incrementos:
- Ventas al mes: $${ventas.toFixed(2)}
- Aumento de salario: $${aumento.toFixed(2)}

Teniendo como salario final: $${salarioFinal.toFixed(2)}

Atentamente, Gerente General.
      `.trim();

      setReporte(mensaje);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      setReporte("Ocurrió un error al generar el reporte.");
    }
  }, []);

  return (
    <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded shadow max-w-2xl mx-auto whitespace-pre-line">
      <h3 className="text-lg font-bold mb-2">📄 Reporte de Nómina</h3>
      <p className="text-gray-800">{reporte}</p>
    </div>
  );
};
