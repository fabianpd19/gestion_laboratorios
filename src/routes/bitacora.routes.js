const express = require("express");
const bitacoraController = require("../controllers/bitacora.controller");
const verificarToken = require("../middlewares/auth");

const router = express.Router();

// Todas las rutas de bitácoras requieren autenticación
router.use(verificarToken);

// Rutas CRUD básicas
router.post("/", bitacoraController.crear);
router.get("/", bitacoraController.obtenerTodas);
router.get("/reporte", bitacoraController.generarReporte);
router.get("/:id", bitacoraController.obtenerPorId);
router.put("/:id", bitacoraController.actualizar);
router.delete("/:id", bitacoraController.eliminar);

// Rutas para control de sesión
router.patch("/:id/iniciar-sesion", bitacoraController.iniciarSesion);
router.patch("/:id/completar-sesion", bitacoraController.completarSesion);
router.patch("/:id/firmar", bitacoraController.firmar);

// Rutas para bloqueo/desbloqueo
router.patch("/:id/bloquear", bitacoraController.bloquear);
router.patch("/:id/desbloquear", bitacoraController.desbloquear);

// Rutas para mesas de trabajo
router.put("/:id/mesa/:numeroMesa", bitacoraController.actualizarMesa);

// Rutas por profesor
router.get("/profesor/:profesorId", bitacoraController.obtenerPorProfesor);

module.exports = router;
