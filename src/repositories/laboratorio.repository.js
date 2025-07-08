const Laboratorio = require("../models/laboratorio.model")
const { Op } = require("sequelize")

class LaboratorioRepository {
  async crear(datosLaboratorio) {
    try {
      return await Laboratorio.create(datosLaboratorio)
    } catch (error) {
      throw new Error(`Error al crear laboratorio: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Laboratorio.findByPk(id)
    } catch (error) {
      throw new Error(`Error al obtener laboratorio: ${error.message}`)
    }
  }

  async obtenerPorCodigo(codigo) {
    try {
      return await Laboratorio.findOne({
        where: { codigo },
      })
    } catch (error) {
      throw new Error(`Error al buscar laboratorio por código: ${error.message}`)
    }
  }

  async obtenerTodos(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.tipo_laboratorio) {
        whereClause.tipo_laboratorio = filtros.tipo_laboratorio
      }

      if (filtros.activo !== undefined) {
        whereClause.activo = filtros.activo
      }

      if (filtros.busqueda) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { codigo: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { ubicacion: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ]
      }

      return await Laboratorio.findAll({
        where: whereClause,
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener laboratorios: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Laboratorio.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Laboratorio no encontrado")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar laboratorio: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Laboratorio.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Laboratorio no encontrado")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar laboratorio: ${error.message}`)
    }
  }

  async obtenerDisponibles(fecha, horaInicio, horaFin) {
    try {
      // Esta consulta se puede mejorar con lógica más compleja para verificar disponibilidad
      return await Laboratorio.findAll({
        where: {
          activo: true,
        },
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener laboratorios disponibles: ${error.message}`)
    }
  }
}

module.exports = new LaboratorioRepository()
