// src/controllers/docenteMateria.controller.js
const { DocenteAsignatura, Asignatura, Usuario, GuiaLaboratorio, InscripcionAsignatura } = require("../models/associations")
const { sequelize } = require("../../config/db")

// Obtener materias asignadas a un docente con información de unidades
const obtenerMateriasDocente = async (req, res) => {
  try {
    const { docente_id } = req.params
    const { periodo_academico = "2025-1" } = req.query

    // Verificar que el docente existe
    const docente = await Usuario.findByPk(docente_id)
    if (!docente || docente.rol !== 'docente') {
      return res.status(404).json({
        success: false,
        message: "Docente no encontrado"
      })
    }

    // Obtener materias asignadas al docente
    const materiasAsignadas = await DocenteAsignatura.findAll({
      where: {
        docente_id,
        periodo_academico
      },
      include: [
        {
          model: Asignatura,
          as: "asignatura",
          attributes: ['id', 'nombre', 'codigo', 'departamento', 'carrera', 'semestre', 'creditos', 'descripcion']
        }
      ]
    })

    // Enriquecer con información adicional de cada materia
    const materiasEnriquecidas = await Promise.all(
      materiasAsignadas.map(async (materiaAsignada) => {
        const asignatura = materiaAsignada.asignatura

        // Contar estudiantes inscritos
        const estudiantesCount = await InscripcionAsignatura.count({
          where: {
            asignatura_id: asignatura.id,
            periodo_academico,
            activa: true
          }
        })

        // Contar guías de laboratorio
        const guiasCount = await GuiaLaboratorio.count({
          where: {
            asignatura_id: asignatura.id,
            docente_id
          }
        })

        // Obtener guías por unidad (simulamos 3 unidades)
        const guiasPorUnidad = await GuiaLaboratorio.findAll({
          where: {
            asignatura_id: asignatura.id,
            docente_id
          },
          attributes: ['id', 'titulo', 'estado', 'createdAt'],
          order: [['createdAt', 'ASC']]
        })

        // Organizar guías en 3 unidades
        const unidades = [
          { numero: 1, nombre: "Primera Unidad", guias: [] },
          { numero: 2, nombre: "Segunda Unidad", guias: [] },
          { numero: 3, nombre: "Tercera Unidad", guias: [] }
        ]

        // Distribuir guías entre las 3 unidades
        guiasPorUnidad.forEach((guia, index) => {
          const unidadIndex = Math.floor(index / Math.ceil(guiasPorUnidad.length / 3))
          const unidadTarget = Math.min(unidadIndex, 2) // Asegurar que no exceda índice 2
          unidades[unidadTarget].guias.push({
            id: guia.id,
            titulo: guia.titulo,
            estado: guia.estado,
            fechaCreacion: guia.createdAt
          })
        })

        return {
          id: asignatura.id,
          nombre: asignatura.nombre,
          codigo: asignatura.codigo,
          departamento: asignatura.departamento,
          carrera: asignatura.carrera,
          semestre: asignatura.semestre,
          creditos: asignatura.creditos,
          descripcion: asignatura.descripcion,
          esCoordinador: materiaAsignada.es_coordinador,
          periodoAcademico: materiaAsignada.periodo_academico,
          estadisticas: {
            estudiantesInscritos: estudiantesCount,
            guiasCreadas: guiasCount,
            guiasPendientes: guiasPorUnidad.filter(g => g.estado === 'borrador').length,
            guiasPublicadas: guiasPorUnidad.filter(g => g.estado === 'publicada').length
          },
          unidades: unidades
        }
      })
    )

    res.json({
      success: true,
      message: "Materias del docente obtenidas correctamente",
      data: materiasEnriquecidas,
      meta: {
        docente: {
          id: docente.id,
          nombre: docente.nombre,
          correo: docente.correo
        },
        periodoAcademico,
        totalMaterias: materiasEnriquecidas.length
      }
    })

  } catch (error) {
    console.error("Error al obtener materias del docente:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Obtener detalle de una materia específica
const obtenerDetalleMateria = async (req, res) => {
  try {
    const { docente_id, materia_id } = req.params
    const { periodo_academico = "2025-1" } = req.query

    // Verificar que el docente tiene asignada esta materia
    const asignacion = await DocenteAsignatura.findOne({
      where: {
        docente_id,
        asignatura_id: materia_id,
        periodo_academico
      },
      include: [
        {
          model: Asignatura,
          as: "asignatura"
        },
        {
          model: Usuario,
          as: "docente",
          attributes: ['id', 'nombre', 'correo']
        }
      ]
    })

    if (!asignacion) {
      return res.status(404).json({
        success: false,
        message: "Materia no asignada al docente"
      })
    }

    // Obtener estudiantes inscritos
    const estudiantes = await InscripcionAsignatura.findAll({
      where: {
        asignatura_id: materia_id,
        periodo_academico,
        activa: true
      },
      include: [
        {
          model: Usuario,
          as: "estudiante",
          attributes: ['id', 'nombre', 'correo', 'programa_academico']
        }
      ],
      order: [[{ model: Usuario, as: "estudiante" }, 'nombre', 'ASC']]
    })

    // Obtener todas las guías de laboratorio
    const guias = await GuiaLaboratorio.findAll({
      where: {
        asignatura_id: materia_id,
        docente_id
      },
      order: [['createdAt', 'ASC']]
    })

    // Organizar en unidades
    const unidades = [
      { numero: 1, nombre: "Primera Unidad", guias: [] },
      { numero: 2, nombre: "Segunda Unidad", guias: [] },
      { numero: 3, nombre: "Tercera Unidad", guias: [] }
    ]

    guias.forEach((guia, index) => {
      const unidadIndex = Math.floor(index / Math.ceil(guias.length / 3))
      const unidadTarget = Math.min(unidadIndex, 2)
      unidades[unidadTarget].guias.push(guia)
    })

    res.json({
      success: true,
      message: "Detalle de materia obtenido correctamente",
      data: {
        materia: asignacion.asignatura,
        docente: asignacion.docente,
        esCoordinador: asignacion.es_coordinador,
        periodoAcademico: asignacion.periodo_academico,
        estudiantes: estudiantes.map(inscripcion => inscripcion.estudiante),
        unidades: unidades,
        estadisticas: {
          totalEstudiantes: estudiantes.length,
          totalGuias: guias.length,
          guiasPorUnidad: unidades.map(u => ({
            unidad: u.numero,
            cantidad: u.guias.length
          }))
        }
      }
    })

  } catch (error) {
    console.error("Error al obtener detalle de materia:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Crear nueva guía en una unidad específica
const crearGuiaEnUnidad = async (req, res) => {
  try {
    const { docente_id, materia_id } = req.params
    const { 
      titulo, 
      descripcion, 
      objetivos, 
      procedimiento, 
      unidad,
      laboratorio_id,
      duracion_estimada,
      materiales_requeridos 
    } = req.body

    // Verificar que el docente tiene asignada esta materia
    const asignacion = await DocenteAsignatura.findOne({
      where: {
        docente_id,
        asignatura_id: materia_id
      }
    })

    if (!asignacion) {
      return res.status(403).json({
        success: false,
        message: "No tiene permisos para crear guías en esta materia"
      })
    }

    // Crear la guía
    const nuevaGuia = await GuiaLaboratorio.create({
      titulo,
      descripcion,
      objetivos,
      procedimiento,
      asignatura_id: materia_id,
      docente_id,
      laboratorio_id,
      duracion_estimada,
      materiales_requeridos: Array.isArray(materiales_requeridos) ? materiales_requeridos : [],
      estado: 'borrador'
    })

    res.status(201).json({
      success: true,
      message: `Guía creada exitosamente en la unidad ${unidad}`,
      data: nuevaGuia
    })

  } catch (error) {
    console.error("Error al crear guía:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

module.exports = {
  obtenerMateriasDocente,
  obtenerDetalleMateria,
  crearGuiaEnUnidad
}