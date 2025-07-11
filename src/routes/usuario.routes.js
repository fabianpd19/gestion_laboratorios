const express = require("express")
const usuarioController = require("../controllers/usuario.controller")

const router = express.Router()

// Rutas CRUD para usuarios
router.post("/", usuarioController.crear)
router.get("/", usuarioController.obtenerTodos)
router.get("/estadisticas", usuarioController.obtenerEstadisticas)
router.get("/:id", usuarioController.obtenerPorId)
router.put("/:id", usuarioController.actualizar)
router.delete("/:id", usuarioController.eliminar)

// Ruta de autenticación
router.post("/auth", usuarioController.autenticar)

module.exports = router
