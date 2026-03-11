import { useState } from "react";

function MapaEscenario({ evento, zonaSeleccionada, onZonaChange }) {
  const [hoveredZona, setHoveredZona] = useState(null);

  const zonas = {
    VIP: {
      disponibles: evento.disponiblesVIP,
      capacidad: evento.capacidadVIP,
      precio: evento.precioVIP,
      color: "red",
      posicion: "front",
    },
    General: {
      disponibles: evento.disponiblesGeneral,
      capacidad: evento.capacidadGeneral,
      precio: evento.precioGeneral,
      color: "blue",
      posicion: "back",
    },
  };

  const porcentajeDisponible = (zona) => {
    return ((zonas[zona].disponibles / zonas[zona].capacidad) * 100).toFixed(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🗺️ Mapa del Escenario
      </h3>

      {/* Mapa Visual */}
      <div
        className="relative bg-gray-100 rounded-lg p-8 mb-6"
        style={{ minHeight: "400px" }}
      >
        {/* Escenario */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 bg-gray-800 text-white py-3 rounded-t-lg text-center font-bold">
          🎤 ESCENARIO
        </div>

        {/* Zona VIP (adelante) */}
        <div
          onClick={() => zonas.VIP.disponibles > 0 && onZonaChange("VIP")}
          onMouseEnter={() => setHoveredZona("VIP")}
          onMouseLeave={() => setHoveredZona(null)}
          className={`absolute top-24 left-1/2 transform -translate-x-1/2 w-3/4 h-32 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center ${
            zonaSeleccionada === "VIP"
              ? "bg-red-600 border-4 border-red-800 scale-105"
              : hoveredZona === "VIP"
              ? "bg-red-500 scale-105"
              : "bg-red-400"
          } ${
            zonas.VIP.disponibles === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="text-center text-white">
            <p className="text-2xl font-bold">⭐ ZONA VIP</p>
            <p className="text-sm mt-1">
              {zonas.VIP.disponibles} / {zonas.VIP.capacidad} disponibles
            </p>
            <p className="text-lg font-bold mt-1">S/ {zonas.VIP.precio}</p>
          </div>
        </div>

        {/* Zona General (atrás) */}
        <div
          onClick={() =>
            zonas.General.disponibles > 0 && onZonaChange("General")
          }
          onMouseEnter={() => setHoveredZona("General")}
          onMouseLeave={() => setHoveredZona(null)}
          className={`absolute top-60 left-1/2 transform -translate-x-1/2 w-3/4 h-40 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center ${
            zonaSeleccionada === "General"
              ? "bg-blue-600 border-4 border-blue-800 scale-105"
              : hoveredZona === "General"
              ? "bg-blue-500 scale-105"
              : "bg-blue-400"
          } ${
            zonas.General.disponibles === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <div className="text-center text-white">
            <p className="text-2xl font-bold">🎫 ZONA GENERAL</p>
            <p className="text-sm mt-1">
              {zonas.General.disponibles} / {zonas.General.capacidad}{" "}
              disponibles
            </p>
            <p className="text-lg font-bold mt-1">S/ {zonas.General.precio}</p>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(zonas).map(([zona, info]) => (
          <div
            key={zona}
            className={`p-4 rounded-lg border-2 transition-all ${
              zonaSeleccionada === zona
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">
                {zona === "VIP" ? "⭐ VIP" : "🎫 General"}
              </span>
              {zonaSeleccionada === zona && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Seleccionada
                </span>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                💰 Precio:{" "}
                <span className="font-bold text-gray-800">
                  S/ {info.precio}
                </span>
              </p>
              <p>
                🎫 Disponibles:{" "}
                <span className="font-bold text-gray-800">
                  {info.disponibles} / {info.capacidad}
                </span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    zona === "VIP" ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${porcentajeDisponible(zona)}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1">
                {porcentajeDisponible(zona)}% disponible
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de ayuda */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Haz clic en una zona del mapa para
          seleccionarla. La zona VIP está más cerca del escenario.
        </p>
      </div>
    </div>
  );
}

export default MapaEscenario;
