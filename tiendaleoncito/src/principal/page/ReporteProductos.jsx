import { useEffect, useState } from 'react';

export default function ReporteProductos() {
  const [reporte, setReporte] = useState('');

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch('http://localhost:4000/api/productos');
        const json = await res.json();

        if (!json.success) throw new Error('Error en la respuesta del servidor');

        const productos = json.data;

        // Agrupar por marca y sumar cantidades
        const marcaMap = new Map();
        productos.forEach(producto => {
          const marca = producto.marca;
          const cantidad = producto.cantidad || 0;
          marcaMap.set(marca, (marcaMap.get(marca) || 0) + cantidad);
        });

        const detalles = Array.from(marcaMap.entries())
          .map(([marca, cantidad]) => `"${cantidad}" productos de la marca "${marca}"`)
          .join('\n');

        const texto = `Reporte Ejecutivo de Productos

C. Apolinar, gerente de la tienda "XY"
Se le informa que la tienda tiene
${detalles}

Atentamente

Líder del proyecto.`;

        setReporte(texto);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        setReporte('Hubo un error al generar el reporte.');
      }
    }

    fetchProductos();
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
          <h1 style={{ marginBottom: '1rem', color: '#2c3e50', textAlign: 'center' }}>Reporte Ejecutivo de Productos</h1>

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
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#2980b9'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#3498db'}
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
