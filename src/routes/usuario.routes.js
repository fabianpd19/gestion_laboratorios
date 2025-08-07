const express = require("express");
const usuarioController = require("../controllers/usuario.controller");
const auth = require("../middlewares/auth");

console.log("typeof auth:", typeof auth); // 👈 agrega esta línea

const router = express.Router();

// Rutas públicas
router.post("/login", usuarioController.login);
router.post("/", usuarioController.crear);

// Rutas protegidas
router.use(auth); // línea 12 con error

router.get("/", usuarioController.obtenerTodos);
router.get("/rol/:rol", usuarioController.obtenerPorRol);
router.get("/:id", usuarioController.obtenerPorId);
router.put("/:id", usuarioController.actualizar);
router.delete("/:id", usuarioController.eliminar);

module.exports = router;
