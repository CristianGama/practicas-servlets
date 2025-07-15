
import { useEffect, useState } from 'react';

export default function ReporteProveedores() {
  const [reporte, setReporte] = useState('');

  useEffect(() => {
    async function generarReporte() {
      try {
        // Fetch productos
        const resProductos = await fetch('http://localhost:4000/api/productos');
        const jsonProductos = await resProductos.json();

        if (!jsonProductos.success) throw new Error('Error al cargar productos');

        // Ordenar productos por menor cantidad
        const productosOrdenados = [...jsonProductos.data].sort((a, b) => a.cantidad - b.cantidad);
        const top3 = productosOrdenados.slice(0, 3);

        // Fetch proveedores
        const resProveedores = await fetch('http://localhost:4000/api/proveedores');
        const jsonProveedores = await resProveedores.json();

        if (!jsonProveedores.success) throw new Error('Error al cargar proveedores');

        const proveedores = jsonProveedores.data;
        const nombresRepresentantes = proveedores.map(p => p.nombre_representante).filter(Boolean);

        // Elegir un nombre de representante al azar
        const representante = nombresRepresentantes[Math.floor(Math.random() * nombresRepresentantes.length)] || 'Nombre Desconocido';

        // Construcción del mensaje
        const texto = `Reporte ejecutivo de Proveedores

C. Alin se le solicita surtir los siguientes productos:
1. 20 "${top3[0]?.nombre}" de la marca "${top3[0]?.marca}"
2. 10 "${top3[1]?.nombre}" de la marca "${top3[1]?.marca}"
3. 5 "${top3[2]?.nombre}" de la marca "${top3[2]?.marca}"

La fecha para entregar los productos es el 12 de Julio 2025 al C. ${representante} para poder actualizar inventario de la tienda.

Atentamente.
Leoncio
Gerente General`;

        setReporte(texto);
      } catch (error) {
        console.error('Error al generar reporte:', error);
        setReporte('Hubo un error al generar el reporte.');
      }
    }

    generarReporte();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '2rem', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          position: 'relative'
        }}>
          <h1 style={{ marginBottom: '1rem', color: '#2c3e50', textAlign: 'center' }}>Reporte Ejecutivo de Proveedores</h1>

          <pre id="reporte-pdf" style={{
            whiteSpace: 'pre-line',
            color: '#333',
            lineHeight: '1.6',
            fontSize: '16px',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fafafa'
          }}>
            {reporte}
          </pre>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e8449'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#27ae60'}
            >
              Imprimir como PDF
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #reporte-pdf, #reporte-pdf * {
            visibility: visible;
          }
          #reporte-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            border: none;
            background: none;
          }
        }
      `}</style>
    </div>
  );
}
