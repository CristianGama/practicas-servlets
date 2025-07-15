import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/proveedores');
      const data = await res.json();

      if (res.ok && data.success) {
        setProveedores(data.data);
      } else {
        setError(data.error || 'Error al cargar proveedores');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este proveedor?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/proveedores/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProveedores();
      } else {
        alert(data.error || 'No se pudo eliminar');
      }
    } catch {
      alert('Error de conexión al eliminar');
    }
  };

  if (loading) return <p className="p-4">Cargando proveedores...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-[#FFF1E5] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Listado de Proveedores</h1>
        <button
          onClick={() => navigate('/form-proveedores')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nuevo Proveedor
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Empresa</th>
            <th className="px-4 py-2 text-left">Representante</th>
            <th className="px-4 py-2 text-left">Marcas</th>
            <th className="px-4 py-2 text-right">Costo</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(p => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.id}</td>
              <td className="px-4 py-2">{p.nombre_empresa}</td>
              <td className="px-4 py-2">{p.nombre_representante}</td>
              <td className="px-4 py-2">{p.marcas_que_surte}</td>
              <td className="px-4 py-2 text-right">${p.costo_productos}</td>
              <td className="px-4 py-2 flex justify-center gap-2">
                <button
                  onClick={() => navigate(`/modificar-proveedor?id=${p.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Modificar
                </button>
                <button
                  onClick={() => handleEliminar(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {proveedores.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                No hay proveedores registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
