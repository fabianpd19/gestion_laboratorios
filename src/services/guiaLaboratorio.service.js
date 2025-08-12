const guiaLaboratorioRepository = require("../repositories/guiaLaboratorio.repository");

class GuiaLaboratorioService {
  async crearGuia(datosGuia) {
    try {
      // Aquí puedes agregar validaciones específicas antes de crear
      if (!datosGuia.titulo || datosGuia.titulo.trim() === "") {
        throw new Error("El título de la guía es obligatorio");
      }

      if (!datosGuia.laboratorio_id) {
        throw new Error("El laboratorio es obligatorio");
      }

      // Más validaciones según sea necesario...

      return await guiaLaboratorioRepository.crear(datosGuia);
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`);
    }
  }

  async obtenerGuia(id) {
    try {
      const guia = await guiaLaboratorioRepository.obtenerPorId(id);
      if (!guia) {
        throw new Error("Guía no encontrada");
      }
      return guia;
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`);
    }
  }

  async obtenerGuias(filtros = {}) {
    try {
      return await guiaLaboratorioRepository.obtenerTodas(filtros);
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`);
    }
  }

  async actualizarGuia(id, datosActualizacion) {
    try {
      // Opcional: validar existencia antes de actualizar
      const guiaExistente = await this.obtenerGuia(id);

      // Opcional: validar datos de actualización, ejemplo:
      if (datosActualizacion.titulo && datosActualizacion.titulo.trim() === "") {
        throw new Error("El título no puede estar vacío");
      }

      return await guiaLaboratorioRepository.actualizar(id, datosActualizacion);
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`);
    }
  }

  async eliminarGuia(id) {
    try {
      // Opcional: validar existencia antes de eliminar
      const guiaExistente = await this.obtenerGuia(id);

      return await guiaLaboratorioRepository.eliminar(id);
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`);
    }
  }
}

module.exports = new GuiaLaboratorioService();