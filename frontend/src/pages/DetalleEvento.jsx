import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MapaEscenario from "../components/MapaEscenario";
import SeccionComentarios from "../components/SeccionComentarios";

function DetalleEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estaAutenticado, esAdmin } = useAuth();

  const [evento, setEvento] = useState(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState("General");
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/eventos/${id}`);
        const data = await response.json();
        setEvento(data);
      } catch (error) {
        console.error("❌ Error al cargar evento:", error);
        setError("Error al cargar el evento");
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id]);

  const handleComprar = () => {
    if (!estaAutenticado) {
      alert("Debes iniciar sesión para comprar entradas");
      navigate("/login");
      return;
    }

    if (esAdmin) {
      alert("Los administradores no pueden comprar entradas");
      return;
    }

    // Verificar disponibilidad de la zona seleccionada
    const disponibles =
      zonaSeleccionada === "General"
        ? evento.disponiblesGeneral
        : evento.disponiblesVIP;

    if (disponibles === 0) {
      alert(`La zona ${zonaSeleccionada} está agotada`);
      return;
    }

    if (cantidad > disponibles) {
      alert(
        `Solo hay ${disponibles} entradas disponibles en zona ${zonaSeleccionada}`
      );
      return;
    }

    // Guardar datos en localStorage
    localStorage.setItem("cantidadCompra", cantidad);
    localStorage.setItem("zonaCompra", zonaSeleccionada);

    // Redirigir a checkout
    navigate(`/checkout/${id}`);
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPrecioZona = () => {
    if (!evento) return 0;
    return zonaSeleccionada === "General"
      ? evento.precioGeneral
      : evento.precioVIP;
  };

  const getDisponiblesZona = () => {
    if (!evento) return 0;
    return zonaSeleccionada === "General"
      ? evento.disponiblesGeneral
      : evento.disponiblesVIP;
  };

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-600">Cargando evento...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-red-600">Evento no encontrado</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Volver a Eventos
        </button>
      </div>
    );
  }

  const precioZona = getPrecioZona();
  const disponiblesZona = getDisponiblesZona();
  const total = precioZona * cantidad;
  const totalDisponibles = evento.disponiblesGeneral + evento.disponiblesVIP;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header del Evento */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <img
            src={evento.imagen}
            alt={evento.nombre}
            className="w-full h-96 object-cover"
          />

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {evento.nombre}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  📅 Fecha y Hora
                </h3>
                <p className="text-gray-600">{formatearFecha(evento.fecha)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">📍 Lugar</h3>
                <p className="text-gray-600">{evento.lugar}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                📝 Descripción
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {evento.descripcion}
              </p>
            </div>

            {/* Disponibilidad Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <span className="font-semibold">
                  Total de entradas disponibles:
                </span>{" "}
                <span className="text-2xl font-bold text-red-600">
                  {totalDisponibles}
                </span>
              </p>
              {totalDisponibles < 20 && totalDisponibles > 0 && (
                <p className="text-orange-600 font-semibold mt-2">
                  ⚠️ ¡Últimas entradas disponibles!
                </p>
              )}
              {totalDisponibles === 0 && (
                <p className="text-red-600 font-semibold mt-2">
                  ❌ Evento agotado
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Contenido Principal: Mapa y Compra */}
        {totalDisponibles > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mapa del Escenario */}
            <MapaEscenario
              evento={evento}
              zonaSeleccionada={zonaSeleccionada}
              onZonaChange={setZonaSeleccionada}
            />

            {/* Panel de Compra */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                🎫 Comprar Entradas
              </h3>

              {/* Zona Seleccionada */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Zona Seleccionada:</p>
                <p className="text-2xl font-bold text-gray-800">
                  {zonaSeleccionada === "VIP" ? "⭐ VIP" : "🎫 General"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {disponiblesZona} entradas disponibles
                </p>
              </div>

              {/* Selector de Cantidad */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Cantidad de entradas:
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={disponiblesZona}
                    value={cantidad}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setCantidad(Math.min(Math.max(val, 1), disponiblesZona));
                    }}
                    className="w-24 text-center px-4 py-2 border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={() =>
                      setCantidad(Math.min(disponiblesZona, cantidad + 1))
                    }
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Resumen de Precios */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Precio unitario:</span>
                  <span className="text-xl font-bold text-gray-800">
                    S/ {precioZona.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Cantidad:</span>
                  <span className="text-xl font-bold text-gray-800">
                    x {cantidad}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Advertencias */}
              {!estaAutenticado && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4">
                  ℹ️ Debes iniciar sesión para comprar entradas
                </div>
              )}

              {esAdmin && (
                <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-4">
                  ℹ️ Los administradores no pueden comprar entradas
                </div>
              )}

              {disponiblesZona === 0 && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
                  ❌ La zona {zonaSeleccionada} está agotada. Selecciona otra
                  zona.
                </div>
              )}

              {/* Botón de Compra */}
              <button
                onClick={handleComprar}
                disabled={esAdmin || disponiblesZona === 0}
                className="w-full bg-red-600 text-white py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {esAdmin
                  ? "🚫 Admins no pueden comprar"
                  : disponiblesZona === 0
                  ? "❌ Zona Agotada"
                  : "🎫 Continuar con la Compra"}
              </button>

              {/* Características de la zona */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">
                  {zonaSeleccionada === "VIP"
                    ? "⭐ Beneficios VIP:"
                    : "🎫 Incluye:"}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {zonaSeleccionada === "VIP" ? (
                    <>
                      <li>✓ Acceso preferencial</li>
                      <li>✓ Mejor vista del escenario</li>
                      <li>✓ Zona exclusiva</li>
                      <li>✓ Entrada prioritaria</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Acceso al evento</li>
                      <li>✓ Vista completa del escenario</li>
                      <li>✓ Ambiente festivo</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Evento Agotado
            </h2>
            <p className="text-gray-600 mb-6">
              Todas las entradas para este evento se han agotado
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              Ver Otros Eventos
            </button>
          </div>
        )}

        {/* Sección de Comentarios */}
        <SeccionComentarios eventoId={id} />
      </div>
    </div>
  );
}

export default DetalleEvento;
