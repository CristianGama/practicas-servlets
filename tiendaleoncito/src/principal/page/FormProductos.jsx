import { useState } from 'react';

export default function FormProductos() {
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    cantidad: 1,
    precio: '',
    tipo: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar checkboxes de tipo (solo uno puede estar seleccionado)
  const handleTipoChange = (tipoSeleccionado) => {
    setFormData(prev => ({
      ...prev,
      tipo: prev.tipo === tipoSeleccionado ? '' : tipoSeleccionado
    }));
  };

  // Validar formulario
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

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Preparar datos asegurándose de que sean válidos
      const dataToSend = {
        nombre: formData.nombre.trim(),
        marca: formData.marca,
        cantidad: parseInt(formData.cantidad) || 1,
        precio: parseFloat(formData.precio) || 0,
        tipo: formData.tipo
      };

      console.log('Datos a enviar:', dataToSend); // Para debugging

      const response = await fetch('http://localhost:4000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Status de respuesta:', response.status); // Para debugging
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        throw new Error('Respuesta del servidor no válida');
      }

      console.log('Respuesta del servidor:', data); // Para debugging

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Producto creado exitosamente' });
        // Limpiar formulario después del éxito
        setFormData({
          nombre: '',
          marca: '',
          cantidad: 1,
          precio: '',
          tipo: ''
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data?.error || `Error ${response.status}: ${response.statusText}` 
        });
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error de conexión con el servidor' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario
  const handleLimpiar = () => {
    setFormData({
      nombre: '',
      marca: '',
      cantidad: 1,
      precio: '',
      tipo: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="bg-[#FFF1E5] h-screen overflow-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="m-6 space-y-8 bg-white shadow-xl rounded-2xl md:flex-row md:space-y-0">
          <div>
            <h1 className="text-center font-sans text-2xl py-0 px-2 my-5 mx-1">PRODUCTOS</h1>
            
            {/* Mensaje de estado */}
            {message.text && (
              <div className={`mx-2 mb-4 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex flex-row py-2">
              <div className="flex flex-col py-1 my-0 m-2">
                <label className="mb-2 text-sm">NOMBRE</label>
                <input 
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                />
              </div>
            </div>

            <div className="py-2 my-0 m-2">
              <label className="mb-2 text-sm">Marca</label>
              <select 
                name="marca" 
                id="marca" 
                className="w-full h-10 p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                value={formData.marca}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar marca</option>
                <option value="BIMBO">BIMBO</option>
                <option value="COCA-COLA">COCA-COLA</option>
                <option value="GAMESA">GAMESA</option>
                <option value="LALA">LALA</option>
                <option value="NESTLE">NESTLE</option>
              </select>
            </div>

            <div className="flex flex-col py-1 my-0 m-2">
              <label className="mb-2 text-sm">Cantidad</label>
              <select 
                name="cantidad" 
                id="cantidad" 
                className="w-full h-10 p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                value={formData.cantidad}
                onChange={handleInputChange}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1 my-0 m-2">
              <label className="mb-2 text-sm">Precio</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                name="precio"
                id="precio"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>

            <p className="text-center font-sans text-sm py-0 my-2 m-0">Tipo</p>
            <div className="flex flex-row py-2 items-center justify-center">
              <div className="flex flex-row py-1 my-0 m-2 items-center">
                <label className="px-1 text-sm text-center">Embolsado</label>
                <input 
                  type="checkbox"
                  className="ml-2 w-4 h-4"
                  checked={formData.tipo === 'Embolsado'}
                  onChange={() => handleTipoChange('Embolsado')}
                />
              </div>
              <div className="flex flex-row py-1 my-0 m-2 items-center">
                <label className="px-1 text-sm text-center">Enlatado</label>
                <input 
                  type="checkbox"
                  className="ml-2 w-4 h-4"
                  checked={formData.tipo === 'Enlatado'}
                  onChange={() => handleTipoChange('Enlatado')}
                />
              </div>
              <div className="flex flex-row py-1 my-0 m-2 items-center">
                <label className="px-1 text-sm text-center">Caja</label>
                <input 
                  type="checkbox"
                  className="ml-2 w-4 h-4"
                  checked={formData.tipo === 'Caja'}
                  onChange={() => handleTipoChange('Caja')}
                />
              </div>
            </div>

            <div className="py-2 my-0 m-2">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-25 bg-green-600 text-white font-bold p-2 rounded-lg m-1 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
              <button 
                type="button"
                onClick={handleLimpiar}
                className="w-25 bg-orange-600 text-white font-bold p-2 rounded-lg m-1 hover:bg-orange-700"
              >
                Limpiar
              </button>
              <button 
                type="button"
                className="w-25 bg-red-600 text-white font-bold p-2 rounded-lg m-1 hover:bg-red-700"
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
