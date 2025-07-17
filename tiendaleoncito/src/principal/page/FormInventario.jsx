
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FormInventario() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const inventarioId = params.get('id');

  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Si hay id, obtener datos para edición
  useEffect(() => {
    if (!inventarioId) return;

    async function fetchInventario() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/inventario/${inventarioId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setNombre(data.data.nombre);
          setMessage({ type: '', text: '' });
        } else {
          setMessage({ type: 'error', text: data.error || 'No se pudo cargar el inventario.' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Error al cargar el inventario.' });
      } finally {
        setLoading(false);
      }
    }

    fetchInventario();
  }, [inventarioId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!nombre.trim()) {
      setMessage({ type: 'error', text: 'El nombre es requerido.' });
      return;
    }

    setLoading(true);
    try {
      const url = inventarioId
        ? `http://localhost:4000/api/inventario/${inventarioId}`
        : 'http://localhost:4000/api/inventario';

      const method = inventarioId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: 'success',
          text: inventarioId ? 'Inventario actualizado correctamente.' : 'Inventario creado exitosamente.'
        });
        if (!inventarioId) setNombre('');
        else setTimeout(() => navigate('/inventario'), 1500);
      } else {
        setMessage({ type: 'error', text: data.error || `Error ${res.status}: ${res.statusText}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {inventarioId ? 'Modificar Inventario' : 'Crear Inventario'}
      </h2>

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

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Procesando...' : inventarioId ? 'Modificar' : 'Crear'}
        </button>
      </form>

      <button
        onClick={() => navigate('/inventario')}
        disabled={loading}
        className="w-full mt-4 py-2 rounded font-semibold text-white bg-gray-600 hover:bg-gray-700"
      >
        Consultar
      </button>
    </div>
  );
}
