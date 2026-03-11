import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CrearEvento() {
  const [evento, setEvento] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    precioGeneral: "",
    precioVIP: "",
    capacidadGeneral: "",
    capacidadVIP: "",
    descripcion: "",
    imagen: "",
    imagenMapa: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEvento({
      ...evento,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evento),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Evento creado exitosamente!");
        navigate("/admin/eventos");
      } else {
        setError(data.mensaje || "Error al crear evento");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Crear Nuevo Evento
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del evento */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Evento *
            </label>
            <input
              type="text"
              name="nombre"
              value={evento.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ej: Concierto de Rock"
              required
            />
          </div>

          {/* Fecha y Lugar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Fecha *
              </label>
              <input
                type="datetime-local"
                name="fecha"
                value={evento.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Lugar *
              </label>
              <input
                type="text"
                name="lugar"
                value={evento.lugar}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ej: Estadio Nacional"
                required
              />
            </div>
          </div>

          {/* Sección: Zona General */}
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              🎫 Zona General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Precio General (S/) *
                </label>
                <input
                  type="number"
                  name="precioGeneral"
                  value={evento.precioGeneral}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Capacidad General *
                </label>
                <input
                  type="number"
                  name="capacidadGeneral"
                  value={evento.capacidadGeneral}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="500"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sección: Zona VIP */}
          <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
            <h3 className="text-xl font-bold text-red-800 mb-4">⭐ Zona VIP</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Precio VIP (S/) *
                </label>
                <input
                  type="number"
                  name="precioVIP"
                  value={evento.precioVIP}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="150"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Capacidad VIP *
                </label>
                <input
                  type="number"
                  name="capacidadVIP"
                  value={evento.capacidadVIP}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* URL de Imagen */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              URL de la Imagen del Evento
            </label>
            <input
              type="url"
              name="imagen"
              value={evento.imagen}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Opcional: Si no proporcionas una imagen, se usará una por defecto
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={evento.descripcion}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Describe el evento..."
              required
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {cargando ? "Creando..." : "Crear Evento"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/eventos")}
              className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearEvento;
