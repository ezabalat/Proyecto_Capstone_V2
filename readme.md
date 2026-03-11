# PeruFest - Plataforma de Venta de Entradas para Eventos

Aplicación web full-stack para la compra y gestión de entradas para eventos musicales y culturales en Perú.

## 🌟 Características Principales

### Para Usuarios (Compradores)

- 🎫 Compra de entradas con selección de zonas (General y VIP)
- 🗺️ Mapa interactivo del escenario
- 🔍 Búsqueda y filtrado de eventos
- 📱 Tickets electrónicos con código QR
- 📥 Descarga de tickets en PDF
- 💳 Pasarela de pagos segura
- 📧 Confirmación por email
- 🎨 Carrusel de eventos destacados

### Para Administradores

- ➕ Crear y gestionar eventos
- ✏️ Editar información de eventos
- 📊 Panel de estadísticas de ventas
- 💰 Control de precios por zona
- 👥 Gestión de capacidad por zona
- 🗑️ Eliminación segura de eventos

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React.js** - Librería de UI
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **QRCode** - Generación de códigos QR
- **jsPDF** - Generación de PDFs
- **React Carousel** - Carrusel de imágenes
- **Vite** - Build tool

### Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt.js** - Encriptación de contraseñas

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/perufest.git
cd perufest
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:

```env
PORT=5000
MONGODB_URI=tu_mongodb_uri_aqui
JWT_SECRET=tu_clave_secreta_aqui
```

**Obtener MongoDB URI:**

1. Crea una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster
3. Obtén tu connection string
4. Reemplaza `<password>` con tu contraseña

Crear usuario administrador:

```bash
node crearAdmin.js
```

Credenciales de admin:

- Email: `admin@eventosapp.com`
- Password: `admin123`

Iniciar el servidor:

```bash
npm run dev
```

El backend estará corriendo en `http://localhost:5000`

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Iniciar la aplicación:

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## 🚀 Uso

### Como Usuario

1. Regístrate con tu email
2. Explora los eventos disponibles
3. Selecciona un evento y haz clic en "Ver Detalles"
4. Elige tu zona preferida (General o VIP) en el mapa interactivo
5. Selecciona la cantidad de entradas
6. Completa tus datos personales
7. Procesa el pago con tarjeta de prueba
8. Descarga tu ticket con código QR

### Como Administrador

1. Inicia sesión con las credenciales de admin
2. Ve al "Panel Admin"
3. Crea nuevos eventos con:
   - Información básica (nombre, fecha, lugar)
   - Precios diferenciados por zona
   - Capacidad por zona
   - Descripción e imágenes
4. Gestiona eventos existentes (editar/eliminar)
5. Visualiza estadísticas de ventas

## 💳 Datos de Prueba

### Tarjetas de Prueba

- **Número:** 4111 1111 1111 1111
- **CVV:** 123
- **Fecha:** 12/2025
- **Nombre:** Cualquier nombre

### Usuarios de Prueba

- **Admin:** admin@eventosapp.com / admin123
- **Usuario:** Regístrate con cualquier email
