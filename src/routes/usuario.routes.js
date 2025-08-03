const express = require("express");
const usuarioController = require("../controllers/usuario.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

// Rutas públicas
router.post("/login", usuarioController.login);
router.post("/", usuarioController.crear); // <-- ahora es pública

// Rutas protegidas (requieren JWT)
router.use(auth);

router.get("/", usuarioController.obtenerTodos);
router.get("/rol/:rol", usuarioController.obtenerPorRol);
router.get("/:id", usuarioController.obtenerPorId);
router.put("/:id", usuarioController.actualizar);
router.delete("/:id", usuarioController.eliminar);

module.exports = router;
