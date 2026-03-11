import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { esAdmin } = useAuth();

  const [evento, setEvento] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    precio: "",
    capacidad: "",
    descripcion: "",
    imagen: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esAdmin) {
      navigate("/");
      return;
    }
    cargarEvento();
  }, [id, esAdmin]);

  const cargarEvento = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/eventos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // Formatear fecha para el input datetime-local
      const fechaFormateada = new Date(data.fecha).toISOString().slice(0, 16);

      setEvento({
        nombre: data.nombre,
        fecha: fechaFormateada,
        lugar: data.lugar,
        precio: data.precio,
        capacidad: data.capacidad,
        descripcion: data.descripcion,
        imagen: data.imagen,
      });
    } catch (error) {
      console.error("Error al cargar evento:", error);
      setError("Error al cargar el evento");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setEvento({
      ...evento,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/eventos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evento),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Evento actualizado exitosamente!");
        navigate("/admin/eventos");
      } else {
        setError(data.mensaje || "Error al actualizar evento");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-600">Cargando evento...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Editar Evento</h2>

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
                required
              />
            </div>
          </div>

          {/* Precio y Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Precio (S/) *
              </label>
              <input
                type="number"
                name="precio"
                value={evento.precio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Capacidad Total *
              </label>
              <input
                type="number"
                name="capacidad"
                value={evento.capacidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                ⚠️ No puedes reducir por debajo de las entradas ya vendidas
              </p>
            </div>
          </div>

          {/* URL de Imagen */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              name="imagen"
              value={evento.imagen}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {evento.imagen && (
              <img
                src={evento.imagen}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-lg"
              />
            )}
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
              required
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {guardando ? "Guardando..." : "Guardar Cambios"}
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

export default EditarEvento;
