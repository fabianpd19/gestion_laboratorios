// src/routes/docenteMateria.routes.js
const express = require("express")
const { 
  obtenerMateriasDocente, 
  obtenerDetalleMateria, 
  crearGuiaEnUnidad 
} = require("../controllers/docenteMateria.controller")
const { verificarToken, verificarRol } = require("../middlewares/auth.middleware")

const router = express.Router()

// Middleware para verificar que es docente
const esDocente = verificarRol(['docente'])

// GET /api/docente-materias/:docente_id - Obtener materias asignadas a un docente
router.get("/:docente_id", verificarToken, esDocente, obtenerMateriasDocente)

// GET /api/docente-materias/:docente_id/:materia_id - Obtener detalle de materia específica
router.get("/:docente_id/:materia_id", verificarToken, esDocente, obtenerDetalleMateria)

// POST /api/docente-materias/:docente_id/:materia_id/guias - Crear nueva guía en una materia
router.post("/:docente_id/:materia_id/guias", verificarToken, esDocente, crearGuiaEnUnidad)

module.exports = router