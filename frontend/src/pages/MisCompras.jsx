import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { estaAutenticado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!estaAutenticado) {
      navigate("/login");
      return;
    }
    cargarCompras();
  }, [estaAutenticado]);

  const cargarCompras = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/compras/mis-compras",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error("Error al cargar compras:", error);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelar = async (compraId) => {
    if (
      !window.confirm(
        "¿Estás seguro de cancelar esta compra? Las entradas serán devueltas."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/compras/${compraId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Compra cancelada exitosamente");
        cargarCompras(); // Recargar compras
      } else {
        const data = await response.json();
        alert(data.mensaje || "Error al cancelar compra");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-600">Cargando compras...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mis Entradas</h2>

      {compras.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-500 mb-4">
            Aún no has comprado entradas
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Ver Eventos Disponibles
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {compras.map((compra) => (
            <div
              key={compra._id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                compra.estado === "cancelada"
                  ? "opacity-60 border-2 border-red-300"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {compra.nombreEvento}
                    </h3>
                    {compra.estado === "cancelada" && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Cancelada
                      </span>
                    )}
                  </div>
                  <p className="text-red-600 font-semibold mb-4">
                    {compra.nombreArtista}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                    <div>
                      <p className="font-semibold">📅 Fecha del evento:</p>
                      <p>{formatearFecha(compra.fechaEvento)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">📍 Lugar:</p>
                      <p>{compra.lugarEvento}</p>
                    </div>
                    <div>
                      <p className="font-semibold">🎫 Cantidad:</p>
                      <p>
                        {compra.cantidad} entrada
                        {compra.cantidad > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">💰 Total pagado:</p>
                      <p className="text-xl font-bold text-red-600">
                        ${compra.precioTotal}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Código de compra:{" "}
                      <span className="font-mono font-semibold">
                        {compra.codigoCompra}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Fecha de compra: {formatearFecha(compra.fechaCompra)}
                    </p>
                  </div>
                </div>

                {compra.estado === "completada" && (
                  <button
                    onClick={() => handleCancelar(compra._id)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancelar Compra
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisCompras;
