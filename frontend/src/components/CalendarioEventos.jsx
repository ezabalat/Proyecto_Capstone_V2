// frontend/src/components/CalendarioEventos.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CalendarioEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEventos();
  }, [mesActual]);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/eventos");
      console.log("Eventos cargados:", response.data);
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerDiasDelMes = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasPrevios = primerDia.getDay();
    const totalDias = ultimoDia.getDate();
    const dias = [];
    const ultimoDiaMesAnterior = new Date(año, mes, 0).getDate();
    for (let i = diasPrevios - 1; i >= 0; i--) {
      dias.push({
        numero: ultimoDiaMesAnterior - i,
        mesActual: false,
        fecha: new Date(año, mes - 1, ultimoDiaMesAnterior - i),
      });
    }
    for (let i = 1; i <= totalDias; i++) {
      dias.push({
        numero: i,
        mesActual: true,
        fecha: new Date(año, mes, i),
      });
    }
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({
        numero: i,
        mesActual: false,
        fecha: new Date(año, mes + 1, i),
      });
    }
    return dias;
  };

  const obtenerEventosDelDia = (fecha) => {
    return eventos.filter((evento) => {
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento.toDateString() === fecha.toDateString();
    });
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevoMes);
  };

  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const eventosFuturos = eventos.filter((e) => new Date(e.fecha) >= new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {meses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => cambiarMes(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setMesActual(new Date())}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                Hoy
              </button>
              <button
                onClick={() => cambiarMes(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-center font-semibold text-gray-600 py-2"
              >
                {dia}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {obtenerDiasDelMes().map((dia, index) => {
              const eventosDelDia = obtenerEventosDelDia(dia.fecha);
              const tieneEventos = eventosDelDia.length > 0;
              return (
                <div
                  key={index}
                  className={`min-h-24 border rounded-lg p-2 transition ${
                    dia.mesActual
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 text-gray-400"
                  } ${
                    esHoy(dia.fecha)
                      ? "border-blue-500 border-2"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        esHoy(dia.fecha) ? "text-blue-600 font-bold" : ""
                      }`}
                    >
                      {dia.numero}
                    </span>
                    {tieneEventos && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  {tieneEventos && dia.mesActual && (
                    <div className="space-y-1">
                      {eventosDelDia.slice(0, 2).map((evento) => (
                        <Link
                          key={evento._id}
                          to={`/evento/${evento._id}`}
                          className="block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate hover:bg-blue-200 transition"
                          title={evento.nombre}
                        >
                          {evento.nombre}
                        </Link>
                      ))}
                      {eventosDelDia.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{eventosDelDia.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Tiene eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
              <span>Hoy</span>
            </div>
          </div>
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Próximos Eventos
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {eventosFuturos.length > 0 ? (
                eventosFuturos.slice(0, 10).map((evento) => (
                  <Link
                    key={evento._id}
                    to={`/evento/${evento._id}`}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-medium">
                        {new Date(evento.fecha)
                          .toLocaleDateString("es-PE", { month: "short" })
                          .toUpperCase()}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(evento.fecha).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {evento.nombre}
                      </h4>
                      <p className="text-sm text-gray-500">{evento.lugar}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        S/ {evento.precioGeneral || evento.precioVIP}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(evento.fecha).toLocaleTimeString("es-PE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No hay eventos próximos
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioEventos;
