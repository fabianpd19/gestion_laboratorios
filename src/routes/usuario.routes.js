const express = require("express");
const usuarioController = require("../controllers/usuario.controller");
const verificarToken = require("../middlewares/auth");

const router = express.Router();

// Rutas públicas
router.post("/auth", usuarioController.autenticar);
router.post("/", usuarioController.crear);

// Rutas protegidas
router.use(verificarToken); // Desde aquí, todas las rutas requieren token

router.get("/", usuarioController.obtenerTodos);
router.get("/estadisticas", usuarioController.obtenerEstadisticas);
router.get("/:id", usuarioController.obtenerPorId);
router.put("/:id", usuarioController.actualizar);
router.delete("/:id", usuarioController.eliminar);

module.exports = router;
