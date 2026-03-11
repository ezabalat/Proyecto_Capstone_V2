import { useState } from "react";

function PasarelaPago({ total, onPagoExitoso, onCancelar }) {
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
  });
  const [procesando, setProcesando] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Formatear número de tarjeta
    if (name === "numeroTarjeta") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (value.length > 19) return;
    }

    // Formatear fecha de expiración
    if (name === "fechaExpiracion") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limitar CVV
    if (name === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 3) return;
    }

    setDatosPago({ ...datosPago, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    const numeroLimpio = datosPago.numeroTarjeta.replace(/\s/g, "");
    if (numeroLimpio.length !== 16) {
      alert("El número de tarjeta debe tener 16 dígitos");
      return;
    }

    if (datosPago.cvv.length !== 3) {
      alert("El CVV debe tener 3 dígitos");
      return;
    }

    setProcesando(true);

    // Simular procesamiento de pago (2 segundos)
    setTimeout(() => {
      const ultimos4 = numeroLimpio.slice(-4);
      onPagoExitoso(ultimos4);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          💳 Pasarela de Pago Segura
        </h2>

        <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white p-4 rounded-lg mb-6">
          <p className="text-sm mb-1">Total a pagar</p>
          <p className="text-3xl font-bold">S/ {total.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número de tarjeta */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Número de Tarjeta
            </label>
            <input
              type="text"
              name="numeroTarjeta"
              value={datosPago.numeroTarjeta}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Nombre del titular */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Titular
            </label>
            <input
              type="text"
              name="nombreTitular"
              value={datosPago.nombreTitular}
              onChange={handleChange}
              placeholder="JUAN PEREZ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Fecha y CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Vencimiento
              </label>
              <input
                type="text"
                name="fechaExpiracion"
                value={datosPago.fechaExpiracion}
                onChange={handleChange}
                placeholder="MM/AA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={datosPago.cvv}
                onChange={handleChange}
                placeholder="123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded text-sm">
            🔒 Esta es una pasarela de pago simulada. No se realizarán cargos
            reales.
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={procesando}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {procesando ? "⏳ Procesando..." : "✓ Pagar Ahora"}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              disabled={procesando}
              className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasarelaPago;
