import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function FormProductos() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productoId = params.get('id');

  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    cantidad: 1,
    precio: '',
    tipo: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);

  // Obtener datos si es edición
  useEffect(() => {
    if (productoId) {
      const obtenerProducto = async () => {
        try {
          const res = await fetch(`http://localhost:4000/api/productos/${productoId}`);
          const data = await res.json();
          console.log(data.data)
          if (res.ok && data.success) {
            setFormData({
              nombre: data.data.nombre,
              marca: data.data.marca,
              cantidad: data.data.cantidad,
              precio: data.data.precio,
              tipo: data.data.tipo
            });
          } else {
            setMessage({ type: 'error', text: data?.error || 'No se pudo cargar el producto.' });
          }
        } catch (err) {
          setMessage({ type: 'error', text: 'Error al obtener el producto.' });
        }
      };

      obtenerProducto();
    }
  }, [productoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoChange = (tipoSeleccionado) => {
    setFormData(prev => ({
      ...prev,
      tipo: prev.tipo === tipoSeleccionado ? '' : tipoSeleccionado
    }));
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      setMessage({ type: 'error', text: 'El nombre es requerido' });
      return false;
    }
    if (!formData.marca) {
      setMessage({ type: 'error', text: 'La marca es requerida' });
      return false;
    }
    if (!formData.precio || formData.precio <= 0) {
      setMessage({ type: 'error', text: 'El precio debe ser mayor a 0' });
      return false;
    }
    if (!formData.tipo) {
      setMessage({ type: 'error', text: 'Debe seleccionar un tipo' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setShowModal(true);
  };

  const confirmarEnvio = async () => {
    setShowModal(false);
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        marca: formData.marca,
        cantidad: parseInt(formData.cantidad) || 1,
        precio: parseFloat(formData.precio) || 0,
        tipo: formData.tipo
      };

      const url = productoId
        ? `http://localhost:4000/api/productos/${productoId}`
        : 'http://localhost:4000/api/productos';

      const method = productoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: productoId ? 'Producto actualizado correctamente' : 'Producto creado exitosamente'
        });

        if (!productoId) {
          setFormData({ nombre: '', marca: '', cantidad: 1, precio: '', tipo: '' });
        }
      } else {
        setMessage({
          type: 'error',
          text: data?.error || `Error ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error de conexión con el servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarEnvio = () => setShowModal(false);

  const handleLimpiar = () => {
    setFormData({ nombre: '', marca: '', cantidad: 1, precio: '', tipo: '' });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="bg-[#FFF1E5] h-screen overflow-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="m-6 space-y-8 bg-white shadow-xl rounded-2xl md:flex-row md:space-y-0">
          <div>
            <h1 className="text-center font-sans text-2xl py-0 px-2 my-5 mx-1">
              {productoId ? 'MODIFICAR PRODUCTO' : 'CREAR PRODUCTO'}
            </h1>

            {message.text && (
              <div className={`mx-2 mb-4 p-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message.text}
              </div>
            )}

            {/* Campos del formulario */}
            <div className="flex flex-col gap-2 px-4">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />

              <label>Marca</label>
              <select name="marca" value={formData.marca} onChange={handleInputChange} className="border p-2 rounded">
                <option value="">Seleccionar marca</option>
                <option value="BIMBO">BIMBO</option>
                <option value="COCA-COLA">COCA-COLA</option>
                <option value="GAMESA">GAMESA</option>
                <option value="LALA">LALA</option>
                <option value="NESTLE">NESTLE</option>
              </select>

              <label>Cantidad</label>
              <select name="cantidad" value={formData.cantidad} onChange={handleInputChange} className="border p-2 rounded">
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>

              <label>Precio</label>
              <input
                type="number"
                name="precio"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />

              <label>Tipo</label>
              <div className="flex gap-4">
                {['Embolsado', 'Enlatado', 'Caja'].map(tipo => (
                  <label key={tipo} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.tipo === tipo}
                      onChange={() => handleTipoChange(tipo)}
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 m-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white font-bold p-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Enviando...' : productoId ? 'Modificar' : 'Crear'}
              </button>
              <button onClick={handleLimpiar} className="bg-orange-600 text-white font-bold p-2 rounded-lg hover:bg-orange-700">
                Limpiar
              </button>
              <a href="/productos" className="bg-red-600 text-white font-bold p-2 rounded-lg hover:bg-red-700">
                Regresar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              ¿Está seguro de {productoId ? 'modificar' : 'agregar'} el producto?
            </h2>

            <div className="mb-6 text-sm space-y-2">
              <div><strong>Nombre:</strong> {formData.nombre}</div>
              <div><strong>Marca:</strong> {formData.marca}</div>
              <div><strong>Cantidad:</strong> {formData.cantidad}</div>
              <div><strong>Precio:</strong> ${formData.precio}</div>
              <div><strong>Tipo:</strong> {formData.tipo}</div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={confirmarEnvio} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold">
                Confirmar
              </button>
              <button onClick={cancelarEnvio} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-bold">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
