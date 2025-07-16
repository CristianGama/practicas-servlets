import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaTwitch,
  FaTwitter,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";

export const AuthFrom = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Estado compartido para los formularios
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  // Captura cambios de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      console.log("Iniciando sesión con:", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      console.log("Registrando con:", formData);
    }

    // Limpia el formulario después
    setFormData({ nombre: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-[90vw] h-[90vh] shadow-2xl rounded-lg overflow-hidden flex">
        {/* Panel izquierdo */}
        <div className="w-1/2 bg-green-500 text-white flex flex-col justify-center items-center text-center px-8">
          {isLogin ? (
            <>
              <h2 className="text-4xl font-bold mb-4">¡Bienvenido!</h2>
              <p className="mb-6">
                Ingrese sus datos personales para usar todas las funciones del sitio
              </p>
              <button
                onClick={() => setIsLogin(false)}
                className="border border-white py-2 px-6 rounded hover:bg-white hover:text-green-500 transition"
              >
                Registrarse
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">¡Hola!</h2>
              <p className="mb-6">
                Regístrese con sus datos personales para usar todas las funciones del sitio
              </p>
              <button
                onClick={() => setIsLogin(true)}
                className="border border-white py-2 px-6 rounded hover:bg-white hover:text-green-500 transition"
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </div>

        {/* Panel derecho */}
        <div className="w-1/2 bg-white flex justify-center items-center relative">
          {/* Login */}
          <div
            className={`absolute transition-opacity duration-500 ease-in-out ${
              isLogin ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <FormWrapper
              title="Iniciar Sesión"
              subtitle="Use su correo y contraseña"
              isLogin={true}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Registro */}
          <div
            className={`absolute transition-opacity duration-500 ease-in-out ${
              isLogin ? "opacity-0 z-0" : "opacity-100 z-10"
            }`}
          >
            <FormWrapper
              title="Registrarse"
              subtitle="Use su correo electrónico para registrarse"
              isLogin={false}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reutilizable para login o registro
const FormWrapper = ({
  title,
  subtitle,
  isLogin,
  formData,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="w-[24rem] flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="flex gap-4 mb-6">
        <SocialIcon icon={<FaTwitch />} />
        <SocialIcon icon={<FaTwitter />} />
        <SocialIcon icon={<FaInstagram />} />
        <SocialIcon icon={<FaTiktok />} />
      </div>

      <p className="text-gray-600 mb-4">{subtitle}</p>

      <form onSubmit={onSubmit} className="w-full space-y-4">
        {!isLogin && (
          <InputField
            placeholder="Nombre"
            icon={<FaUser />}
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
          />
        )}

        <InputField
          type="email"
          placeholder="Email"
          icon={<FaEnvelope />}
          name="email"
          value={formData.email}
          onChange={onChange}
        />

        <InputField
          type="password"
          placeholder="Password"
          icon={<FaLock />}
          name="password"
          value={formData.password}
          onChange={onChange}
        />

        {isLogin && (
          <div className="text-sm text-right">
            <a href="#" className="text-green-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          {isLogin ? "INICIAR SESIÓN" : "REGISTRARSE"}
        </button>
      </form>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <button className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition">
    {icon}
  </button>
);

const InputField = ({
  placeholder,
  type = "text",
  icon,
  name,
  value,
  onChange,
}) => (
  <div className="flex items-center border rounded bg-gray-100 p-2">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-transparent outline-none w-full"
    />
  </div>
);
