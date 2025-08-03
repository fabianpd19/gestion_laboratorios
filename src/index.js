const express = require("express")
const cors = require("cors")
const { sequelize } = require("../config/db")
require("./models/associations")

// Importar rutas
const usuarioRoutes = require("./routes/usuario.routes")
const laboratorioRoutes = require("./routes/laboratorio.routes")
const asignaturaRoutes = require("./routes/asignatura.routes")
const equipoRoutes = require("./routes/equipo.routes")
const guiaLaboratorioRoutes = require("./routes/guiaLaboratorio.routes")
const bitacoraRoutes = require("./routes/bitacora.routes")

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/laboratorios", laboratorioRoutes)
app.use("/api/asignaturas", asignaturaRoutes)
app.use("/api/equipos", equipoRoutes)
app.use("/api/guias-laboratorio", guiaLaboratorioRoutes)
app.use("/api/bitacoras", bitacoraRoutes)

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API del Sistema de Control de Prácticas de Laboratorio",
    version: "2.0.0",
    endpoints: {
      usuarios: "/api/usuarios",
      laboratorios: "/api/laboratorios",
      asignaturas: "/api/asignaturas",
      equipos: "/api/equipos",
      guias: "/api/guias-laboratorio",
      bitacoras: "/api/bitacoras",
    },
  })
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  })
})

// Iniciar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente")

    await sequelize.sync({ alter: true })
    console.log("✅ Modelos sincronizados con la base de datos")

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()
