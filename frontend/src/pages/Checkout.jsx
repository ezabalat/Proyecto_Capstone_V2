import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasarelaPago from "../components/PasarelaPago";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();

  const [zona, setZona] = useState("General");
  const [evento, setEvento] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [mostrarPasarela, setMostrarPasarela] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const [datosComprador, setDatosComprador] = useState({
    nombreComprador: "",
    dniComprador: "",
    emailComprador: "",
    telefonoComprador: "",
  });

  useEffect(() => {
    if (!estaAutenticado) {
      navigate("/login");
      return;
    }

    const cantidadGuardada = localStorage.getItem("cantidadCompra");
    const zonaGuardada = localStorage.getItem("zonaCompra");

    if (cantidadGuardada) {
      setCantidad(parseInt(cantidadGuardada));
      localStorage.removeItem("cantidadCompra");
    }

    if (zonaGuardada) {
      setZona(zonaGuardada);
      localStorage.removeItem("zonaCompra");
    }

    const cargarEvento = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/eventos/${id}`);
        const data = await response.json();
        setEvento(data);
      } catch (error) {
        console.error("Error al cargar evento:", error);
        setError("Error al cargar el evento");
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id, estaAutenticado, navigate]);

  const handleChange = (e) => {
    setDatosComprador({
      ...datosComprador,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinuar = (e) => {
    e.preventDefault();
    setMostrarPasarela(true);
  };

  const handlePagoExitoso = async (ultimos4Digitos) => {
    setProcesando(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventoId: id,
          cantidad: cantidad,
          zona: zona, // NUEVO
          ...datosComprador,
          ultimos4Digitos,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/confirmacion/${data.compra._id}`);
      } else {
        setError(data.mensaje || "Error al procesar la compra");
        setMostrarPasarela(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión");
      setMostrarPasarela(false);
    } finally {
      setProcesando(false);
    }
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

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-red-600">Evento no encontrado</p>
      </div>
    );
  }

  const precio =
    zona === "General"
      ? evento.precioGeneral || evento.precio || 0
      : evento.precioVIP || (evento.precio ? evento.precio * 2 : 0) || 0;
  const total = precio * cantidad;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de datos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Datos del Comprador
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleContinuar} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreComprador"
                    value={datosComprador.nombreComprador}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Juan Pérez García"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    DNI / Documento *
                  </label>
                  <input
                    type="text"
                    name="dniComprador"
                    value={datosComprador.dniComprador}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="12345678"
                    required
                    maxLength="8"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="emailComprador"
                    value={datosComprador.emailComprador}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefonoComprador"
                    value={datosComprador.telefonoComprador}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="987654321"
                    required
                    maxLength="9"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Continuar al Pago
                </button>
              </form>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Resumen de Compra
              </h2>

              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Zona seleccionada:</p>
                <p className="text-xl font-bold text-red-600">
                  {zona === "VIP" ? "⭐ VIP" : "🎫 General"}
                </p>
              </div>

              <img
                src={evento.imagen}
                alt={evento.nombre}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />

              <h3 className="font-bold text-gray-800 mb-2">{evento.nombre}</h3>
              <p className="text-sm text-gray-600 mb-1">
                📅 {formatearFecha(evento.fecha)}
              </p>
              <p className="text-sm text-gray-600 mb-4">📍 {evento.lugar}</p>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Cantidad:</span>
                  <span className="font-semibold">
                    {cantidad} {cantidad === 1 ? "entrada" : "entradas"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Precio unitario:</span>
                  <span className="font-semibold">S/ {precio.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span className="text-red-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pasarela de pago */}
      {mostrarPasarela && !procesando && (
        <PasarelaPago
          total={total}
          onPagoExitoso={handlePagoExitoso}
          onCancelar={() => setMostrarPasarela(false)}
        />
      )}

      {procesando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold">Procesando tu compra...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
