import { useState, useEffect } from 'react';

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [eliminando, setEliminando] = useState(null);

  // Obtener productos al cargar el componente
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Función para obtener productos
  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/productos');
      const data = await response.json();

      if (data.success) {
        setProductos(data.data);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Error al cargar los productos' });
      }
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar producto
  const eliminarProducto = async (id, nombre) => {
    // Confirmar eliminación
    const confirmar = window.confirm(`¿Está seguro de eliminar el producto "${nombre}"?`);
    if (!confirmar) return;

    try {
      setEliminando(id);
      const response = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Producto eliminado exitosamente' });
        // Actualizar lista sin hacer otro fetch
        setProductos(productos.filter(producto => producto.id !== id));
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al eliminar el producto' });
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setEliminando(null);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#FFF1E5] min-h-screen overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <h1 className="text-3xl font-bold text-center">LISTA DE PRODUCTOS</h1>
            <p className="text-center mt-2 opacity-90">
              Total de productos: {productos.length}
            </p>
          </div>

          {/* Mensaje de estado */}
          {message.text && (
            <div className={`m-4 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Botón para recargar */}
          <div className="p-4 border-b">
            <button
              onClick={obtenerProductos}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Actualizar Lista'}
            </button>
          </div>

          {/* Contenido principal */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No hay productos registrados</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productos.map((producto) => (
                  <div key={producto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    {/* Encabezado del producto */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 truncate">
                        {producto.nombre}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.tipo === 'Embolsado' ? 'bg-green-100 text-green-800' :
                        producto.tipo === 'Enlatado' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {producto.tipo}
                      </span>
                    </div>

                    {/* Información del producto */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marca:</span>
                        <span className="font-medium">{producto.marca}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cantidad:</span>
                        <span className="font-medium">{producto.cantidad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio:</span>
                        <span className="font-medium text-green-600">${producto.precio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Creado:</span>
                        <span className="text-xs text-gray-500">
                          {formatearFecha(producto.fecha_creacion)}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex gap-2">
                        <button
                          onClick={() => eliminarProducto(producto.id, producto.nombre)}
                          disabled={eliminando === producto.id}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                          {eliminando === producto.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                        <button
                          onClick={() => window.location.href = `/modificar-producto?id=${producto.id}`}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pie de página */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Última actualización: {new Date().toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
