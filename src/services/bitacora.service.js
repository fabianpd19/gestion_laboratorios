const bitacoraRepository = require("../repositories/bitacora.repository");
const usuarioService = require("./usuario.service");
const laboratorioService = require("./laboratorio.service");

class BitacoraService {
  async crearBitacora(datosBitacora) {
    try {
      // Validar que el usuario existe
      const usuario = await usuarioService.obtenerUsuario(
        datosBitacora.usuario_id
      );

      // Validar que el laboratorio existe
      const laboratorio = await laboratorioService.obtenerLaboratorio(
        datosBitacora.laboratorio_id
      );

      // Completar datos automáticamente
      const bitacoraCompleta = {
        ...datosBitacora,
        nombre_solicitante: usuario.nombre,
        nombre_laboratorio: laboratorio.nombre,
        codigo_laboratorio: laboratorio.codigo,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Validar campos requeridos
      this.validarCamposRequeridos(bitacoraCompleta);

      // Validar formato de descargo de equipos
      this.validarDescargoEquipos(bitacoraCompleta.descargo_equipos);

      return await bitacoraRepository.crear(bitacoraCompleta);
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`);
    }
  }

  async obtenerBitacora(id) {
    try {
      const bitacora = await bitacoraRepository.obtenerPorId(id);
      if (!bitacora) {
        throw new Error("Bitácora no encontrada");
      }
      return bitacora;
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`);
    }
  }

  async obtenerBitacoras(filtros = {}) {
    try {
      return await bitacoraRepository.obtenerTodas(filtros);
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`);
    }
  }

  async actualizarBitacora(id, datosActualizacion) {
    try {
      // Verificar que la bitácora existe
      const bitacoraExistente = await this.obtenerBitacora(id);

      // Validar que se puede editar (solo borradores)
      if (
        bitacoraExistente.estado !== "borrador" &&
        datosActualizacion.estado !== "borrador"
      ) {
        throw new Error("Solo se pueden editar bitácoras en estado borrador");
      }

      // Si se actualiza laboratorio, actualizar datos relacionados
      if (
        datosActualizacion.laboratorio_id &&
        datosActualizacion.laboratorio_id !== bitacoraExistente.laboratorio_id
      ) {
        const laboratorio = await laboratorioService.obtenerLaboratorio(
          datosActualizacion.laboratorio_id
        );
        datosActualizacion.nombre_laboratorio = laboratorio.nombre;
        datosActualizacion.codigo_laboratorio = laboratorio.codigo;
      }

      // Validar descargo de equipos si se proporciona
      if (datosActualizacion.descargo_equipos) {
        this.validarDescargoEquipos(datosActualizacion.descargo_equipos);
      }

      return await bitacoraRepository.actualizar(id, datosActualizacion);
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`);
    }
  }

  async eliminarBitacora(id) {
    try {
      // Verificar que la bitácora existe y está en borrador
      const bitacora = await this.obtenerBitacora(id);

      if (bitacora.estado !== "borrador") {
        throw new Error("Solo se pueden eliminar bitácoras en estado borrador");
      }

      return await bitacoraRepository.eliminar(id);
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`);
    }
  }

  async enviarBitacora(id) {
    try {
      const bitacora = await this.obtenerBitacora(id);

      if (bitacora.estado !== "borrador") {
        throw new Error("Solo se pueden enviar bitácoras en estado borrador");
      }

      // Validar que todos los campos estén completos
      this.validarBitacoraCompleta(bitacora);

      return await bitacoraRepository.actualizar(id, {
        estado: "enviada",
      });
    } catch (error) {
      throw new Error(`Error al enviar bitácora: ${error.message}`);
    }
  }

  async aprobarBitacora(id, observaciones = "") {
    try {
      const bitacora = await this.obtenerBitacora(id);

      if (bitacora.estado !== "enviada") {
        throw new Error("Solo se pueden aprobar bitácoras enviadas");
      }

      return await bitacoraRepository.actualizar(id, {
        estado: "aprobada",
        observaciones: observaciones || bitacora.observaciones,
      });
    } catch (error) {
      throw new Error(`Error al aprobar bitácora: ${error.message}`);
    }
  }

  async rechazarBitacora(id, observaciones) {
    try {
      const bitacora = await this.obtenerBitacora(id);

      if (bitacora.estado !== "enviada") {
        throw new Error("Solo se pueden rechazar bitácoras enviadas");
      }

      if (!observaciones) {
        throw new Error(
          "Las observaciones son requeridas para rechazar una bitácora"
        );
      }

      return await bitacoraRepository.actualizar(id, {
        estado: "rechazada",
        observaciones,
      });
    } catch (error) {
      throw new Error(`Error al rechazar bitácora: ${error.message}`);
    }
  }

  async obtenerBitacorasUsuario(usuarioId, filtros = {}) {
    try {
      return await bitacoraRepository.obtenerPorUsuario(usuarioId, filtros);
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`);
    }
  }

  async generarReporte(filtros = {}) {
    try {
      const bitacoras = await this.obtenerBitacoras(filtros);
      const estadisticas = await bitacoraRepository.obtenerEstadisticas(
        filtros
      );

      return {
        bitacoras,
        estadisticas,
        resumen: {
          total_bitacoras: bitacoras.length,
          borradores: bitacoras.filter((b) => b.estado === "borrador").length,
          enviadas: bitacoras.filter((b) => b.estado === "enviada").length,
          aprobadas: bitacoras.filter((b) => b.estado === "aprobada").length,
          rechazadas: bitacoras.filter((b) => b.estado === "rechazada").length,
          promedio_usuarios:
            bitacoras.reduce((sum, b) => sum + b.numero_usuarios, 0) /
              bitacoras.length || 0,
        },
      };
    } catch (error) {
      throw new Error(`Error al generar reporte: ${error.message}`);
    }
  }

  // Métodos de validación
  validarCamposRequeridos(bitacora) {
    const camposRequeridos = [
      "departamento",
      "carrera",
      "fecha_uso_laboratorio",
      "materia_asignatura",
      "nivel",
      "numero_usuarios",
      "tema_practica_proyecto",
    ];

    for (const campo of camposRequeridos) {
      if (!bitacora[campo]) {
        throw new Error(`El campo ${campo} es requerido`);
      }
    }
  }

  validarDescargoEquipos(descargo) {
    if (!Array.isArray(descargo)) {
      throw new Error("El descargo de equipos debe ser un array");
    }

    for (const item of descargo) {
      if (!item.cantidad || !item.detalle) {
        throw new Error("Cada item del descargo debe tener cantidad y detalle");
      }

      if (typeof item.cantidad !== "number" || item.cantidad <= 0) {
        throw new Error("La cantidad debe ser un número mayor a 0");
      }

      if (
        typeof item.detalle !== "string" ||
        item.detalle.trim().length === 0
      ) {
        throw new Error("El detalle no puede estar vacío");
      }
    }
  }

  validarBitacoraCompleta(bitacora) {
    this.validarCamposRequeridos(bitacora);

    if (!bitacora.descargo_equipos || bitacora.descargo_equipos.length === 0) {
      throw new Error(
        "Debe especificar al menos un equipo, material o reactivo"
      );
    }

    this.validarDescargoEquipos(bitacora.descargo_equipos);
  }
}

module.exports = new BitacoraService();
