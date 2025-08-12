const usoLaboratorioRepository = require("../repositories/usoLaboratorio.repository");
const laboratorioService = require("./laboratorio.service");
const usuarioService = require("./usuario.service");

class UsoLaboratorioService {
  async registrarUso(datosUso) {
    try {
      // Validar que el usuario existe (idealmente viene del token, no debe enviarse en body)
      await usuarioService.obtenerUsuario(datosUso.usuario_id);

      // Validar que el laboratorio existe
      await laboratorioService.obtenerLaboratorio(datosUso.laboratorio_id);

      // Validar capacidad del laboratorio
      await laboratorioService.validarCapacidad(datosUso.laboratorio_id, datosUso.numero_estudiantes);

      // Validar que la fecha de inicio no sea en el pasado
      const fechaInicio = new Date(datosUso.fecha_inicio);
      const ahora = new Date();
      if (fechaInicio < ahora) {
        throw new Error("La fecha de inicio no puede ser en el pasado");
      }

      // Validar que la fecha de fin sea posterior a la de inicio (si se proporciona)
      if (datosUso.fecha_fin) {
        const fechaFin = new Date(datosUso.fecha_fin);
        if (fechaFin <= fechaInicio) {
          throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
        }
      }

      // Validar estado permitido al crear (normalmente 'programado' o vacío)
      const estadosValidos = ["programado", "en_curso", "finalizado", "cancelado"];
      if (datosUso.estado && !estadosValidos.includes(datosUso.estado.toLowerCase())) {
        throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}`);
      }

      // Validar que se seleccione equipo (no crear equipo desde aquí)
      if (!datosUso.equipo_id) {
        throw new Error("Debe seleccionar un equipo válido");
      }

      return await usoLaboratorioRepository.crear(datosUso);
    } catch (error) {
      throw new Error(`Error en servicio de uso de laboratorio: ${error.message}`);
    }
  }

  async obtenerUso(id) {
    try {
      const uso = await usoLaboratorioRepository.obtenerPorId(id);
      if (!uso) {
        throw new Error("Uso de laboratorio no encontrado");
      }
      return uso;
    } catch (error) {
      throw new Error(`Error en servicio de uso de laboratorio: ${error.message}`);
    }
  }

  async obtenerUsos(filtros = {}) {
    try {
      return await usoLaboratorioRepository.obtenerTodos(filtros);
    } catch (error) {
      throw new Error(`Error en servicio de uso de laboratorio: ${error.message}`);
    }
  }

  async obtenerHistorialLaboratorio(laboratorioId, filtros = {}) {
    try {
      // Validar que el laboratorio existe
      await laboratorioService.obtenerLaboratorio(laboratorioId);

      return await usoLaboratorioRepository.obtenerPorLaboratorio(laboratorioId, filtros);
    } catch (error) {
      throw new Error(`Error en servicio de uso de laboratorio: ${error.message}`);
    }
  }

  async actualizarUso(id, datosActualizacion) {
    try {
      // Validar que el uso existe
      const usoExistente = await this.obtenerUso(id);

      // Validar transiciones de estado si se cambia estado
      if (datosActualizacion.estado) {
        this.validarTransicionEstado(usoExistente.estado, datosActualizacion.estado);
      }

      // Si se actualiza fecha_fin y no hay estado, poner estado finalizado
      if (datosActualizacion.fecha_fin && !datosActualizacion.estado) {
        datosActualizacion.estado = "finalizado";
      }

      return await usoLaboratorioRepository.actualizar(id, datosActualizacion);
    } catch (error) {
      throw new Error(`Error en servicio de uso de laboratorio: ${error.message}`);
    }
  }

  async eliminarUso(id) {
    try {
      return await usoLaboratorioRepository.eliminar(id);
    } catch (error) {
      throw new Error(`Error en servicio de uso de laboratorio: ${error.message}`);
    }
  }

  async iniciarUso(id) {
    try {
      return await this.actualizarUso(id, {
        estado: "en_curso",
        fecha_inicio: new Date(),
      });
    } catch (error) {
      throw new Error(`Error al iniciar uso: ${error.message}`);
    }
  }

  async finalizarUso(id, datosFinalizacion = {}) {
    try {
      return await this.actualizarUso(id, {
        estado: "finalizado",
        fecha_fin: new Date(),
        ...datosFinalizacion,
      });
    } catch (error) {
      throw new Error(`Error al finalizar uso: ${error.message}`);
    }
  }

  async generarReporte(filtros = {}) {
    try {
      const usos = await this.obtenerUsos(filtros);
      const estadisticas = await usoLaboratorioRepository.obtenerEstadisticas(filtros);

      return {
        usos,
        estadisticas,
        resumen: {
          total_usos: usos.length,
          usos_finalizados: usos.filter((uso) => uso.estado === "finalizado").length,
          usos_en_curso: usos.filter((uso) => uso.estado === "en_curso").length,
          usos_programados: usos.filter((uso) => uso.estado === "programado").length,
          promedio_estudiantes: usos.reduce((sum, uso) => sum + uso.numero_estudiantes, 0) / (usos.length || 1),
        },
      };
    } catch (error) {
      throw new Error(`Error al generar reporte: ${error.message}`);
    }
  }

  validarTransicionEstado(estadoActual, nuevoEstado) {
    const transicionesValidas = {
      programado: ["en_curso", "cancelado"],
      en_curso: ["finalizado", "cancelado"],
      finalizado: [],
      cancelado: ["programado"],
    };

    if (!transicionesValidas[estadoActual]?.includes(nuevoEstado)) {
      throw new Error(`Transición de estado inválida: ${estadoActual} -> ${nuevoEstado}`);
    }
  }
}

module.exports = new UsoLaboratorioService();