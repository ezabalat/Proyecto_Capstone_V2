// frontend/src/pages/CrearArtista.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CrearArtista = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    nombreArtistico: "",
    biografia: "",
    generoMusical: [],
    foto: "",
    redesSociales: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      spotify: "",
      tiktok: "",
    },
    informacionPersonal: {
      fechaNacimiento: "",
      lugarNacimiento: "",
      telefono: "",
      email: "",
    },
  });

  const [generoInput, setGeneroInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const agregarGenero = () => {
    if (
      generoInput.trim() &&
      !formData.generoMusical.includes(generoInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        generoMusical: [...prev.generoMusical, generoInput.trim()],
      }));
      setGeneroInput("");
    }
  };

  const eliminarGenero = (genero) => {
    setFormData((prev) => ({
      ...prev,
      generoMusical: prev.generoMusical.filter((g) => g !== genero),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/artistas", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Artista creado exitosamente");
      navigate("/admin/artistas");
    } catch (error) {
      setError(error.response?.data?.mensaje || "Error al crear artista");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Crear Nuevo Artista
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Real *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    name="nombreArtistico"
                    value={formData.nombreArtistico}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía *
                </label>
                <textarea
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Foto
                </label>
                <input
                  type="text"
                  name="foto"
                  value={formData.foto}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Géneros Musicales *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generoInput}
                    onChange={(e) => setGeneroInput(e.target.value)}
                    placeholder="Ej: Rock, Cumbia"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={agregarGenero}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Agregar
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.generoMusical.map((genero) => (
                    <span
                      key={genero}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {genero}
                      <button
                        type="button"
                        onClick={() => eliminarGenero(genero)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Redes Sociales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="redesSociales.facebook"
                    value={formData.redesSociales.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/artista"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="redesSociales.instagram"
                    value={formData.redesSociales.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/artista"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    name="redesSociales.youtube"
                    value={formData.redesSociales.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@artista"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spotify
                  </label>
                  <input
                    type="text"
                    name="redesSociales.spotify"
                    value={formData.redesSociales.spotify}
                    onChange={handleChange}
                    placeholder="https://open.spotify.com/artist/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Información Personal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="informacionPersonal.fechaNacimiento"
                    value={formData.informacionPersonal.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lugar de Nacimiento
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.lugarNacimiento"
                    value={formData.informacionPersonal.lugarNacimiento}
                    onChange={handleChange}
                    placeholder="Lima, Perú"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="informacionPersonal.telefono"
                    value={formData.informacionPersonal.telefono}
                    onChange={handleChange}
                    placeholder="+51 999 999 999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="informacionPersonal.email"
                    value={formData.informacionPersonal.email}
                    onChange={handleChange}
                    placeholder="artista@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? "Creando..." : "Crear Artista"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearArtista;
