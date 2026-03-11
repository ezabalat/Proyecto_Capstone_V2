import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carrusel from "../components/Carrusel";

function Home() {
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
    filtrarEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda, eventos]);

  const cargarEventos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/eventos");
      const data = await response.json();
      setEventos(data);
      setEventosFiltrados(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    } finally {
      setCargando(false);
    }
  };

  const filtrarEventos = () => {
    if (busqueda.trim() === "") {
      setEventosFiltrados(eventos);
    } else {
      const filtrados = eventos.filter(
        (evento) =>
          evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          evento.lugar.toLowerCase().includes(busqueda.toLowerCase())
      );
      setEventosFiltrados(filtrados);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-600">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header con branding PeruFest */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-gray-900 mb-3"> PeruFest</h1>
        <p className="text-2xl text-gray-600 mb-4">
          Los mejores eventos de Perú en un solo lugar
        </p>
        <div className="h-1 w-32 bg-red-600 mx-auto rounded-full"></div>
      </div>

      <Carrusel />

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Próximos Eventos
      </h2>

      {/* Barra de búsqueda */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o lugar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-2xl px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
        />
        {busqueda && (
          <p className="mt-2 text-gray-600">
            {eventosFiltrados.length} resultado
            {eventosFiltrados.length !== 1 ? "s" : ""} encontrado
            {eventosFiltrados.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {eventosFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">
            {busqueda
              ? `No se encontraron eventos con "${busqueda}"`
              : "No hay eventos disponibles aún"}
          </p>
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="text-red-600 hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <div
              key={evento._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                evento.disponibles === 0 ? "opacity-75" : ""
              }`}
            >
              {/* Imagen con badge */}
              <div className="relative">
                <img
                  src={evento.imagen}
                  alt={evento.nombre}
                  className="w-full h-48 object-cover"
                />
                {evento.disponibles === 0 && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    AGOTADO
                  </div>
                )}
                {evento.disponibles > 0 && evento.disponibles < 10 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    ¡ÚLTIMAS!
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {evento.nombre}
                </h3>
                <div className="text-gray-600 text-sm mb-4">
                  <p>📅 {formatearFecha(evento.fecha)}</p>
                  <p>📍 {evento.lugar}</p>

                  <p
                    className={`mt-2 ${
                      evento.disponiblesGeneral + evento.disponiblesVIP === 0
                        ? "text-red-600 font-semibold"
                        : evento.disponiblesGeneral + evento.disponiblesVIP < 20
                        ? "text-orange-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {evento.disponiblesGeneral + evento.disponiblesVIP === 0
                      ? "Sin entradas disponibles"
                      : `${
                          evento.disponiblesGeneral + evento.disponiblesVIP
                        } entradas disponibles`}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Desde</p>
                    <span className="text-2xl font-bold text-gray-800">
                      S/ {Math.min(evento.precioGeneral, evento.precioVIP)}
                    </span>
                  </div>
                  <Link
                    to={`/evento/${evento._id}`}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      evento.disponiblesGeneral + evento.disponiblesVIP === 0
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {evento.disponiblesGeneral + evento.disponiblesVIP === 0
                      ? "Agotado"
                      : "Ver Detalles"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
