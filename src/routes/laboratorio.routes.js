const express = require("express")
const laboratorioController = require("../controllers/laboratorio.controller")

const router = express.Router()

// Rutas CRUD para laboratorios
router.post("/", laboratorioController.crear)
router.get("/", laboratorioController.obtenerTodos)
router.get("/disponibles", laboratorioController.obtenerDisponibles)
router.get("/:id", laboratorioController.obtenerPorId)
router.put("/:id", laboratorioController.actualizar)
router.delete("/:id", laboratorioController.eliminar)

module.exports = router
