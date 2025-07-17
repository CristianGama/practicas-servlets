
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ConsultaInventario() {
  const { id } = useParams(); // id del inventario desde la URL
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setMessage('');
    fetch('http://localhost:4000/api/productos')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filtrar productos que tengan el mismo id_inventario que el id recibido
          const filtrados = data.data.filter(prod => prod.id_inventario === parseInt(id, 10));
          setProductos(filtrados);
          if (filtrados.length === 0) {
            setMessage('No se encontraron productos para este inventario.');
          }
        } else {
          setMessage('Error al obtener los productos.');
        }
      })
      .catch(() => setMessage('Error al conectar con el servidor.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Productos del Inventario #{id}</h1>

      {loading ? (
        <p className="text-center">Cargando productos...</p>
      ) : message ? (
        <p className="text-center text-red-600">{message}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Marca</th>
              <th className="border border-gray-300 p-2">Cantidad</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(({ id, nombre, marca, cantidad, precio, tipo }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{nombre}</td>
                <td className="border border-gray-300 p-2">{marca}</td>
                <td className="border border-gray-300 p-2 text-center">{cantidad}</td>
                <td className="border border-gray-300 p-2 text-right">${parseFloat(precio).toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
