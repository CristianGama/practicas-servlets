import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inventario() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const fetchInventarios = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('http://localhost:4000/api/inventario');
      const data = await res.json();

      if (res.ok && data.success) {
        setInventarios(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cargar inventarios.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  const handleEliminar = async (id, nombre) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar el inventario "${nombre}"?`);
    if (!confirmDelete) return;

    setEliminandoId(id);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`http://localhost:4000/api/inventario/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Inventario "${nombre}" eliminado.` });
        setInventarios((prev) => prev.filter((inv) => inv.id !== id));
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al eliminar inventario.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventarios</h1>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-center">Cargando inventarios...</p>
      ) : inventarios.length === 0 ? (
        <p className="text-center text-gray-500">No hay inventarios registrados.</p>
      ) : (
        <ul className="space-y-4">
          {inventarios.map(({ id, nombre }) => (
            <li
              key={id}
              className="flex justify-between items-center border border-gray-300 rounded p-4"
            >
              <span className="font-medium">{nombre}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/modificar-inventario?id=${id}`)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Modificar
                </button>
                <button
                  onClick={() => navigate(`/consulta-inventario/${id}`)}
                  className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                  Ver Productos
                </button>
                <button
                  onClick={() => handleEliminar(id, nombre)}
                  disabled={eliminandoId === id}
                  className={`px-4 py-1 rounded font-semibold text-white ${
                    eliminandoId === id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {eliminandoId === id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
