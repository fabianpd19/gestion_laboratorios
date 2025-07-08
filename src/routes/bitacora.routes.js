const express = require("express");
const bitacoraController = require("../controllers/bitacora.controller");

const router = express.Router();

// Rutas CRUD para bitácoras
router.post("/", bitacoraController.crear);
router.get("/", bitacoraController.obtenerTodas);
router.get("/reporte", bitacoraController.generarReporte);
router.get("/:id", bitacoraController.obtenerPorId);
router.put("/:id", bitacoraController.actualizar);
router.delete("/:id", bitacoraController.eliminar);

// Rutas específicas para manejo de estados
router.patch("/:id/enviar", bitacoraController.enviar);
router.patch("/:id/aprobar", bitacoraController.aprobar);
router.patch("/:id/rechazar", bitacoraController.rechazar);

// Ruta para obtener bitácoras por usuario
router.get("/usuario/:usuarioId", bitacoraController.obtenerPorUsuario);

module.exports = router;
