import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import CrearEvento from "./pages/CrearEvento";
import EditarEvento from "./pages/EditarEvento";
import DetalleEvento from "./pages/DetalleEvento";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import MisCompras from "./pages/MisCompras";
import AdminEventos from "./pages/AdminEventos";
import DashboardAdmin from "./pages/DashboardAdmin";
import CrearArtista from "./pages/CrearArtista";
import CalendarioEventos from "./components/CalendarioEventos";
import ListaArtistas from "./pages/ListaArtistas";

function App() {
  const { usuario, estaAutenticado, esAdmin, esUsuario, logout } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Barra de navegación */}
        <nav className="bg-red-600 text-white shadow-lg">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src="/iconoPeru.png" alt="PeruFest" className="h-10 w-10" />
              <span className="text-2xl font-bold">PeruFest</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-red-200">
                Eventos
              </Link>

              <Link to="/calendario" className="hover:text-red-200">
                Calendario
              </Link>

              {estaAutenticado ? (
                <>
                  {esAdmin && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="hover:text-red-200"
                      >
                        Dashboard
                      </Link>
                      <Link to="/admin/eventos" className="hover:text-red-200">
                        Panel Admin
                      </Link>
                      <Link
                        to="/admin/crear-evento"
                        className="hover:text-red-200"
                      >
                        Crear Evento
                      </Link>
                      <Link to="/crear-artista" className="hover:text-red-200">
                        Crear Artista
                      </Link>
                    </>
                  )}

                  {esUsuario && (
                    <Link to="/mis-compras" className="hover:text-red-200">
                      Mis Entradas
                    </Link>
                  )}

                  <span className="text-red-200">
                    Hola, {usuario?.nombre} {esAdmin && "(Admin)"}
                  </span>

                  <button
                    onClick={logout}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Rutas */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/evento/:id" element={<DetalleEvento />} />
            <Route path="/calendario" element={<CalendarioEventos />} />

            {/* Rutas de compra */}
            <Route
              path="/checkout/:id"
              element={esUsuario ? <Checkout /> : <Navigate to="/login" />}
            />
            <Route
              path="/confirmacion/:id"
              element={esUsuario ? <Confirmacion /> : <Navigate to="/login" />}
            />

            {/* Rutas de usuario */}
            <Route
              path="/mis-compras"
              element={esUsuario ? <MisCompras /> : <Navigate to="/login" />}
            />

            {/* Rutas de admin */}
            <Route
              path="/admin/dashboard"
              element={esAdmin ? <DashboardAdmin /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/eventos"
              element={esAdmin ? <AdminEventos /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/crear-evento"
              element={esAdmin ? <CrearEvento /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/editar-evento/:id"
              element={esAdmin ? <EditarEvento /> : <Navigate to="/login" />}
            />
            <Route
              path="/crear-artista"
              element={esAdmin ? <CrearArtista /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/artistas"
              element={esAdmin ? <ListaArtistas /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
