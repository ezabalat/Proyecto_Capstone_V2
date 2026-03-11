import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const url = esRegistro
      ? "http://localhost:5000/api/auth/registro"
      : "http://localhost:5000/api/auth/login";

    const datos = esRegistro
      ? formulario
      : { email: formulario.email, password: formulario.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y datos del usuario
        login(data.token, data.usuario);

        // Redirigir según el tipo de usuario
        if (data.usuario.tipo === "admin") {
          navigate("/admin/eventos");
        } else {
          navigate("/");
        }
      } else {
        setError(data.mensaje || "Error en la autenticación");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {esRegistro ? "Crear Cuenta" : "Iniciar Sesión"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre (solo en registro) */}
          {esRegistro && (
            <div>
              <label className="block text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Juan Pérez"
                required={esRegistro}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {cargando
              ? "Procesando..."
              : esRegistro
              ? "Registrarse"
              : "Iniciar Sesión"}
          </button>
        </form>

        {/* Toggle entre login y registro */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setEsRegistro(!esRegistro);
              setError("");
            }}
            className="text-red-600 hover:underline"
          >
            {esRegistro
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
