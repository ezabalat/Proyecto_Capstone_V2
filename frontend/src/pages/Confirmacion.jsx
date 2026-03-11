import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Confirmacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();
  const ticketRef = useRef();

  const [compra, setCompra] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [cargando, setCargando] = useState(true);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    if (!estaAutenticado) {
      navigate("/login");
      return;
    }
    cargarCompra();
  }, [id, estaAutenticado]);

  const cargarCompra = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/compras/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar compra");
      }

      const data = await response.json();
      setCompra(data);

      // Generar código QR
      const qrData = JSON.stringify({
        codigo: data.codigoCompra,
        evento: data.nombreEvento,
        cantidad: data.cantidad,
        dni: data.dniComprador,
      });

      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#4F46E5",
          light: "#FFFFFF",
        },
      });

      setQrUrl(qrDataUrl);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar la compra");
      navigate("/mis-compras");
    } finally {
      setCargando(false);
    }
  };

  const descargarPDF = async () => {
    if (!ticketRef.current || !compra) return;

    setDescargando(true);

    try {
      // Capturar el ticket como imagen
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Crear PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // Ancho A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Ticket-${compra.codigoCompra}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al descargar el ticket");
    } finally {
      setDescargando(false);
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

  if (!compra) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-red-600">Compra no encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        {/* Mensaje de éxito */}
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            ¡Compra Exitosa!
          </h1>
          <p className="text-green-700">
            Tu compra se ha procesado correctamente
          </p>
        </div>

        {/* Ticket Electrónico */}
        <div
          ref={ticketRef}
          className="bg-white rounded-lg shadow-2xl overflow-hidden mb-6"
        >
          {/* Header del ticket */}
          <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🎫 E-TICKET</h2>
            <p className="text-red-200">PeruFest</p>
          </div>

          {/* Código QR */}
          <div className="p-8 text-center border-b-2 border-dashed border-gray-300">
            {qrUrl && (
              <img src={qrUrl} alt="Código QR" className="mx-auto mb-4" />
            )}
            <p className="text-sm text-gray-600 mb-1">Código de Compra</p>
            <p className="text-2xl font-bold text-red-600 font-mono">
              {compra.codigoCompra}
            </p>
          </div>

          {/* Información del evento */}
          <div className="p-8 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {compra.nombreEvento}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">📅 Fecha</p>
                <p className="font-semibold text-gray-800">
                  {formatearFecha(compra.fechaEvento)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">📍 Lugar</p>
                <p className="font-semibold text-gray-800">
                  {compra.lugarEvento}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">👤 Titular</p>
                <p className="font-semibold text-gray-800">
                  {compra.nombreComprador}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">🆔 DNI</p>
                <p className="font-semibold text-gray-800">
                  {compra.dniComprador}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Cantidad de entradas:</span>
                <span className="font-bold text-xl text-gray-800">
                  {compra.cantidad}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-bold text-2xl text-green-600">
                  S/ {compra.precioTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm text-yellow-800">
              <p className="font-semibold mb-1">⚠️ Importante:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Presenta este QR al ingresar al evento</li>
                <li>El titular debe presentar su DNI</li>
                <li>Llega 30 minutos antes del evento</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
            <p>Fecha de compra: {formatearFecha(compra.fechaCompra)}</p>
            <p className="text-xs mt-1">www.PeruFest.com</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={descargarPDF}
            disabled={descargando}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {descargando ? "⏳ Descargando..." : "📥 Descargar PDF"}
          </button>
          <Link
            to="/mis-compras"
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-center"
          >
            Ver Mis Entradas
          </Link>
        </div>

        <div className="text-center">
          <Link to="/" className="text-red-600 hover:underline">
            ← Volver a Eventos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Confirmacion;
