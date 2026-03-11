// frontend/src/components/SeccionComentarios.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SeccionComentarios = ({ eventoId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [loading, setLoading] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    cargarComentarios();
    verificarAutenticacion();
  }, [eventoId]);

  const verificarAutenticacion = () => {
    const token = localStorage.getItem("token");
    setUsuarioAutenticado(!!token);
  };

  const cargarComentarios = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comentarios/evento/${eventoId}`
      );
      setComentarios(response.data.comentarios || []);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();

    if (!nuevoComentario.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/comentarios",
        {
          evento: eventoId,
          contenido: nuevoComentario,
          calificacion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Recargar comentarios después de crear uno nuevo
      await cargarComentarios();
      setNuevoComentario("");
      setCalificacion(5);
      alert("Comentario publicado exitosamente");
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.response?.data?.mensaje || "Error al publicar comentario");
    } finally {
      setLoading(false);
    }
  };

  const darLike = async (comentarioId) => {
    if (!usuarioAutenticado) {
      alert("Debes iniciar sesión para dar like");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/comentarios/${comentarioId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      cargarComentarios();
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const eliminarComentario = async (comentarioId) => {
    if (!window.confirm("¿Estás seguro de eliminar este comentario?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/comentarios/${comentarioId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComentarios(comentarios.filter((c) => c._id !== comentarioId));
      alert("Comentario eliminado");
    } catch (error) {
      alert("Error al eliminar comentario");
    }
  };

  const renderEstrellas = (cantidad, esInput = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <button
            key={estrella}
            type="button"
            onClick={() => esInput && onChange && onChange(estrella)}
            disabled={!esInput}
            className={`${
              esInput ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition`}
          >
            <svg
              className={`w-5 h-5 ${
                estrella <= cantidad
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Comentarios ({comentarios.length})
      </h2>

      {/* Formulario de nuevo comentario */}
      {usuarioAutenticado ? (
        <form
          onSubmit={enviarComentario}
          className="mb-8 bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Deja tu comentario
          </h3>

          {/* Calificación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación
            </label>
            {renderEstrellas(calificacion, true, setCalificacion)}
          </div>

          {/* Texto del comentario */}
          <div className="mb-4">
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Comparte tu experiencia sobre este evento..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {nuevoComentario.length}/500 caracteres
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Publicando..." : "Publicar Comentario"}
          </button>
        </form>
      ) : (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            Inicia sesión para dejar tu comentario y calificación
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </a>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <div
              key={comentario._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
            >
              {/* Header del comentario */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {comentario.usuario?.nombre?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {comentario.usuario?.nombre || "Usuario"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderEstrellas(comentario.calificacion)}
                      <span className="text-sm text-gray-500">
                        {new Date(comentario.fechaCreacion).toLocaleDateString(
                          "es-PE"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón eliminar (solo para el autor) */}
                {usuarioAutenticado && (
                  <button
                    onClick={() => eliminarComentario(comentario._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Contenido del comentario */}
              <p className="text-gray-700 mb-3">{comentario.contenido}</p>

              {/* Footer del comentario */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => darLike(comentario._id)}
                  disabled={!usuarioAutenticado}
                  className={`flex items-center gap-1 ${
                    usuarioAutenticado
                      ? "text-gray-600 hover:text-blue-600"
                      : "text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>{comentario.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg">Aún no hay comentarios</p>
            <p className="text-sm mt-2">
              Sé el primero en compartir tu opinión
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeccionComentarios;
