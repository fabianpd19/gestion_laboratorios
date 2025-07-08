const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection, syncDatabase } = require("../config/db");
const { globalErrorHandler } = require("../utils/errorHandler");

// Importar rutas
const usuarioRoutes = require("./routes/usuario.routes");
const laboratorioRoutes = require("./routes/laboratorio.routes");
const usoLaboratorioRoutes = require("./routes/usoLaboratorio.routes");
const bitacoraRoutes = require("./routes/bitacora.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/laboratorios", laboratorioRoutes);
app.use("/api/usos", usoLaboratorioRoutes);
app.use("/api/bitacoras", bitacoraRoutes);

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend API funcionando correctamente",
    timestamp: new Date().toISOString(),
    port: PORT,
    endpoints: {
      usuarios: "/api/usuarios",
      laboratorios: "/api/laboratorios",
      usos: "/api/usos",
      bitacoras: "/api/bitacoras",
    },
  });
});

// Manejo de rutas no encontradas
app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Middleware global de manejo de errores
app.use(globalErrorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();

    // Sincronizar modelos
    await syncDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Backend API ejecutándose en puerto ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🎯 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📋 Endpoints disponibles:`);
      console.log(`   - Usuarios: http://localhost:${PORT}/api/usuarios`);
      console.log(
        `   - Laboratorios: http://localhost:${PORT}/api/laboratorios`
      );
      console.log(`   - Usos: http://localhost:${PORT}/api/usos`);
      console.log(`   - Bitácoras: http://localhost:${PORT}/api/bitacoras`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
