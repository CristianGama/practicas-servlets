import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function FormProveedores() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const proveedorId = params.get('id');

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    nombre_representante: '',
    marcas_que_surte: '',
    costo_productos: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);

  // Obtener datos si es edición
  useEffect(() => {
    if (proveedorId) {
      const obtenerProveedor = async () => {
        try {
          const res = await fetch(`http://localhost:4000/api/proveedores/${proveedorId}`);
          const data = await res.json();
          console.log(data.data);

          if (res.ok && data.success) {
            setFormData({
              nombre_empresa: data.data.nombre_empresa,
              nombre_representante: data.data.nombre_representante,
              marcas_que_surte: data.data.marcas_que_surte,
              costo_productos: data.data.costo_productos
            });
          } else {
            setMessage({ type: 'error', text: data?.error || 'No se pudo cargar el proveedor.' });
          }
        } catch (err) {
          setMessage({ type: 'error', text: 'Error al obtener el proveedor.' });
        }
      };

      obtenerProveedor();
    }
  }, [proveedorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    if (!formData.nombre_empresa.trim()) {
      setMessage({ type: 'error', text: 'El nombre de la empresa es requerido' });
      return false;
    }
    if (!formData.nombre_representante.trim()) {
      setMessage({ type: 'error', text: 'El nombre del representante es requerido' });
      return false;
    }
    if (!formData.marcas_que_surte.trim()) {
      setMessage({ type: 'error', text: 'Las marcas que surte son requeridas' });
      return false;
    }
    if (!formData.costo_productos || parseFloat(formData.costo_productos) <= 0) {
      setMessage({ type: 'error', text: 'El costo debe ser mayor a 0' });
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
        nombre_empresa: formData.nombre_empresa.trim(),
        nombre_representante: formData.nombre_representante.trim(),
        marcas_que_surte: formData.marcas_que_surte.trim(),
        costo_productos: parseFloat(formData.costo_productos)
      };

      const url = proveedorId
        ? `http://localhost:4000/api/proveedores/${proveedorId}`
        : 'http://localhost:4000/api/proveedores';

      const method = proveedorId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      console.log(response)

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: proveedorId ? 'Proveedor actualizado correctamente' : 'Proveedor creado exitosamente'
        });

        if (!proveedorId) {
          setFormData({
            nombre_empresa: '',
            nombre_representante: '',
            marcas_que_surte: '',
            costo_productos: ''
          });
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
    setFormData({
      nombre_empresa: '',
      nombre_representante: '',
      marcas_que_surte: '',
      costo_productos: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="bg-[#FFF1E5] h-screen overflow-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="m-6 bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
          <h1 className="text-center text-2xl font-bold mb-6">
            {proveedorId ? 'MODIFICAR PROVEEDOR' : 'CREAR PROVEEDOR'}
          </h1>

          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Nombre de la empresa</label>
              <input
                type="text"
                name="nombre_empresa"
                value={formData.nombre_empresa}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Nombre del representante</label>
              <input
                type="text"
                name="nombre_representante"
                value={formData.nombre_representante}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Marcas que surte</label>
              <input
                type="text"
                name="marcas_que_surte"
                value={formData.marcas_que_surte}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Costo de productos</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="costo_productos"
                value={formData.costo_productos}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Enviando...' : proveedorId ? 'Modificar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={handleLimpiar}
                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
              >
                Limpiar
              </button>
              <a
                href="/proveedores"
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Consultar
              </a>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              ¿Está seguro de {proveedorId ? 'modificar' : 'agregar'} el proveedor?
            </h2>

            <div className="mb-6 text-sm space-y-2">
              <div><strong>Empresa:</strong> {formData.nombre_empresa}</div>
              <div><strong>Representante:</strong> {formData.nombre_representante}</div>
              <div><strong>Marcas:</strong> {formData.marcas_que_surte}</div>
              <div><strong>Costo:</strong> ${formData.costo_productos}</div>
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

