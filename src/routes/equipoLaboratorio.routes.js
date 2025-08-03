const express = require("express")
const EquipoLaboratorioController = require("../controllers/equipoLaboratorio.controller")
const { authenticateToken, requireJefeLaboratorio } = require("../middlewares/auth")

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Rutas para obtener equipos (todos los usuarios autenticados)
router.get("/", EquipoLaboratorioController.getAllEquipos)
router.get("/:id", EquipoLaboratorioController.getEquipoById)
router.get("/laboratorio/:laboratorioId", EquipoLaboratorioController.getEquiposByLaboratorio)
router.get("/estado/:estado", EquipoLaboratorioController.getEquiposByEstado)

// CRUD de equipos (solo jefe de laboratorio)
router.post("/", requireJefeLaboratorio, EquipoLaboratorioController.createEquipo)
router.put("/:id", requireJefeLaboratorio, EquipoLaboratorioController.updateEquipo)
router.delete("/:id", requireJefeLaboratorio, EquipoLaboratorioController.deleteEquipo)

// Cambio de estado de equipos (solo jefe de laboratorio)
router.patch("/:id/estado", requireJefeLaboratorio, EquipoLaboratorioController.cambiarEstadoEquipo)

module.exports = router
