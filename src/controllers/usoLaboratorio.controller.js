const usoLaboratorioService = require("../services/usoLaboratorio.service");

class UsoLaboratorioController {
  async crear(req, res) {
    try {
      const usuarioId = req.user.id;

      if (req.user.rol === "estudiante") {
        const { equipo_id, guia_id } = req.body;
        if (!equipo_id || !guia_id) {
          return res.status(400).json({
            success: false,
            message: "Debes seleccionar un equipo y una guía existentes"
          });
        }
        const uso = await usoLaboratorioService.asociarEquipoAGuia(usuarioId, equipo_id, guia_id);
        return res.status(201).json({
          success: true,
          message: "Equipo asociado exitosamente a la guía",
          data: uso
        });
      }

      // Docente o Admin sí pueden registrar uso completo
      const uso = await usoLaboratorioService.registrarUso({
        ...req.body,
        usuario_id: usuarioId
      });

      res.status(201).json({
        success: true,
        message: "Uso de laboratorio registrado exitosamente",
        data: uso,
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const filtros = {
        usuario_id: req.user.rol === "estudiante" ? req.user.id : req.query.usuario_id,
        laboratorio_id: req.query.laboratorio_id,
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
      };

      const usos = await usoLaboratorioService.obtenerUsos(filtros);
      res.json({
        success: true,
        data: usos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const uso = await usoLaboratorioService.obtenerUso(req.params.id);

      // Evitar que un estudiante vea datos de otro
      if (req.user.rol === "estudiante" && uso.usuario_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para ver este registro"
        });
      }

      res.json({
        success: true,
        data: uso,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerHistorialLaboratorio(req, res) {
    try {
      const filtros = {
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
      };

      const historial = await usoLaboratorioService.obtenerHistorialLaboratorio(
        req.params.laboratorioId,
        filtros
      );

      res.json({
        success: true,
        data: historial,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      // Evitar que un estudiante actualice uso ajeno
      if (req.user.rol === "estudiante") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para actualizar el uso de laboratorio"
        });
      }

      const uso = await usoLaboratorioService.actualizarUso(req.params.id, req.body);
      res.json({
        success: true,
        message: "Uso de laboratorio actualizado exitosamente",
        data: uso,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async eliminar(req, res) {
    try {
      if (req.user.rol === "estudiante") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para eliminar usos de laboratorio"
        });
      }

      await usoLaboratorioService.eliminarUso(req.params.id);
      res.json({
        success: true,
        message: "Uso de laboratorio eliminado exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async iniciar(req, res) {
    try {
      if (req.user.rol === "estudiante") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para iniciar un uso de laboratorio"
        });
      }

      const uso = await usoLaboratorioService.iniciarUso(req.params.id);
      res.json({
        success: true,
        message: "Uso de laboratorio iniciado exitosamente",
        data: uso,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async finalizar(req, res) {
    try {
      if (req.user.rol === "estudiante") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para finalizar un uso de laboratorio"
        });
      }

      const uso = await usoLaboratorioService.finalizarUso(req.params.id, req.body);
      res.json({
        success: true,
        message: "Uso de laboratorio finalizado exitosamente",
        data: uso,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generarReporte(req, res) {
    try {
      const filtros = {
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        laboratorio_id: req.query.laboratorio_id,
        usuario_id: req.user.rol === "estudiante" ? req.user.id : req.query.usuario_id,
      };

      const reporte = await usoLaboratorioService.generarReporte(filtros);
      res.json({
        success: true,
        data: reporte,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generarReportePerfil(req, res) {
    try {
      const reporte = await usoLaboratorioService.generarReportePerfil(req.user.id);
      res.json({
        success: true,
        data: reporte
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UsoLaboratorioController();
