const equipoRepository = require("../repositories/equipo.repository");

class EquipoService {
  async crearEquipo(datosEquipo) {
    try {
      // Validaciones básicas
      if (!datosEquipo.nombre || datosEquipo.nombre.trim() === "") {
        throw new Error("El nombre del equipo es obligatorio");
      }
      if (!datosEquipo.laboratorio_id) {
        throw new Error("El laboratorio es obligatorio");
      }

      // Puedes agregar más validaciones según las reglas de negocio

      return await equipoRepository.crear(datosEquipo);
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`);
    }
  }

  async obtenerEquipo(id) {
    try {
      const equipo = await equipoRepository.obtenerPorId(id);
      if (!equipo) {
        throw new Error("Equipo no encontrado");
      }
      return equipo;
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`);
    }
  }

  async obtenerEquipos(filtros = {}) {
    try {
      return await equipoRepository.obtenerTodos(filtros);
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`);
    }
  }

  async actualizarEquipo(id, datosActualizacion) {
    try {
      // Validar que el equipo existe
      const equipoExistente = await this.obtenerEquipo(id);

      // Validaciones sobre los datos de actualización si es necesario
      if (datosActualizacion.nombre && datosActualizacion.nombre.trim() === "") {
        throw new Error("El nombre del equipo no puede estar vacío");
      }

      return await equipoRepository.actualizar(id, datosActualizacion);
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`);
    }
  }

  async eliminarEquipo(id) {
    try {
      // Validar que el equipo existe antes de eliminar
      const equipoExistente = await this.obtenerEquipo(id);

      return await equipoRepository.eliminar(id);
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`);
    }
  }

  async obtenerEquiposPorLaboratorio(laboratorioId) {
    try {
      return await equipoRepository.obtenerPorLaboratorio(laboratorioId);
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`);
    }
  }
}

module.exports = new EquipoService();