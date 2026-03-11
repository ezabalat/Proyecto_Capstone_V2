import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { esAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!esAdmin) {
      navigate("/");
      return;
    }
    cargarEventos();
  }, [esAdmin]);

  const cargarEventos = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/eventos/admin/todos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (eventoId, nombreEvento) => {
    if (
      !window.confirm(`¿Estás seguro de eliminar el evento "${nombreEvento}"?`)
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/eventos/${eventoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Evento eliminado exitosamente");
        cargarEventos();
      } else {
        alert(data.mensaje || "Error al eliminar evento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
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

  const calcularVendidas = (evento) => {
    return evento.capacidad - evento.disponibles;
  };

  const calcularIngresos = (evento) => {
    const vendidas = calcularVendidas(evento);
    return vendidas * evento.precio;
  };

  const calcularTotales = () => {
    const totalEventos = eventos.length;
    const totalVendidas = eventos.reduce(
      (sum, e) => sum + calcularVendidas(e),
      0
    );
    const totalIngresos = eventos.reduce(
      (sum, e) => sum + calcularIngresos(e),
      0
    );
    const totalCapacidad = eventos.reduce((sum, e) => sum + e.capacidad, 0);
    return { totalEventos, totalVendidas, totalIngresos, totalCapacidad };
  };

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-600">Cargando eventos...</p>
      </div>
    );
  }

  const { totalEventos, totalVendidas, totalIngresos, totalCapacidad } =
    calcularTotales();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Panel de Administración
        </h2>
        <Link
          to="/admin/crear-evento"
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
        >
          + Crear Nuevo Evento
        </Link>
      </div>

      {/* Estadísticas generales */}
      {eventos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Total de Eventos</p>
            <p className="text-4xl font-bold text-red-600">{totalEventos}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Capacidad Total</p>
            <p className="text-4xl font-bold text-blue-600">{totalCapacidad}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Entradas Vendidas</p>
            <p className="text-4xl font-bold text-green-600">{totalVendidas}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Ingresos Totales</p>
            <p className="text-4xl font-bold text-green-600">
              S/ {totalIngresos.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {eventos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-500 mb-4">
            Aún no hay eventos creados
          </p>
          <Link
            to="/admin/crear-evento"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
          >
            Crear Primer Evento
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lugar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vendidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Disponibles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eventos.map((evento) => {
                const vendidas = calcularVendidas(evento);
                const porcentaje = (
                  (vendidas / evento.capacidad) *
                  100
                ).toFixed(0);

                return (
                  <tr key={evento._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={evento.imagen}
                          alt={evento.nombre}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {evento.nombre}
                          </p>
                          <p className="text-sm text-gray-500">
                            {porcentaje}% vendido
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatearFecha(evento.fecha)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {evento.lugar}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      S/ {evento.precio}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-semibold">
                        {vendidas}
                      </span>
                      <span className="text-gray-400">
                        {" "}
                        / {evento.capacidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {evento.disponibles}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/editar-evento/${evento._id}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() =>
                            handleEliminar(evento._id, evento.nombre)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminEventos;
