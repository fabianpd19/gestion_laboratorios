const laboratorioRepository = require("../repositories/laboratorio.repository")

class LaboratorioService {
  async crearLaboratorio(datosLaboratorio) {
    try {
      // Validar que el código no exista
      const laboratorioExistente = await laboratorioRepository.obtenerPorCodigo(datosLaboratorio.codigo)
      if (laboratorioExistente) {
        throw new Error("El código de laboratorio ya existe")
      }

      return await laboratorioRepository.crear(datosLaboratorio)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async obtenerLaboratorio(id) {
    try {
      const laboratorio = await laboratorioRepository.obtenerPorId(id)
      if (!laboratorio) {
        throw new Error("Laboratorio no encontrado")
      }
      return laboratorio
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async obtenerLaboratorios(filtros = {}) {
    try {
      return await laboratorioRepository.obtenerTodos(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async actualizarLaboratorio(id, datosActualizacion) {
    try {
      // Si se actualiza el código, validar que no exista
      if (datosActualizacion.codigo) {
        const laboratorioExistente = await laboratorioRepository.obtenerPorCodigo(datosActualizacion.codigo)
        if (laboratorioExistente && laboratorioExistente.id !== id) {
          throw new Error("El código de laboratorio ya existe")
        }
      }

      return await laboratorioRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async eliminarLaboratorio(id) {
    try {
      return await laboratorioRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async obtenerLaboratoriosDisponibles(fecha, horaInicio, horaFin) {
    try {
      return await laboratorioRepository.obtenerDisponibles(fecha, horaInicio, horaFin)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async validarCapacidad(laboratorioId, numeroEstudiantes) {
    try {
      const laboratorio = await this.obtenerLaboratorio(laboratorioId)

      if (numeroEstudiantes > laboratorio.capacidad_maxima) {
        throw new Error(
          `El número de estudiantes (${numeroEstudiantes}) excede la capacidad máxima del laboratorio (${laboratorio.capacidad_maxima})`,
        )
      }

      return true
    } catch (error) {
      throw new Error(`Error en validación de capacidad: ${error.message}`)
    }
  }
}

module.exports = new LaboratorioService()
