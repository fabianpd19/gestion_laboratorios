const bitacoraService = require("../services/bitacora.service");

class BitacoraController {
  async crear(req, res) {
    try {
      // En un sistema real, el usuarioId vendría del token de autenticación
      const usuarioId = req.body.usuario_id || req.headers["x-user-id"];

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.crearBitacora(req.body, usuarioId);
      res.status(201).json({
        success: true,
        message: "Bitácora creada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerTodas(req, res) {
    try {
      const filtros = {
        departamento: req.query.departamento,
        nrc: req.query.nrc,
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        bloqueada: req.query.bloqueada,
        creada_por: req.query.creada_por,
        laboratorio_id: req.query.laboratorio_id,
      };

      const bitacoras = await bitacoraService.obtenerBitacoras(filtros);
      res.json({
        success: true,
        data: bitacoras,
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
      const bitacora = await bitacoraService.obtenerBitacora(req.params.id);
      res.json({
        success: true,
        data: bitacora,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const usuarioId = req.body.usuario_id || req.headers["x-user-id"];

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.actualizarBitacora(
        req.params.id,
        req.body,
        usuarioId
      );
      res.json({
        success: true,
        message: "Bitácora actualizada exitosamente",
        data: bitacora,
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
      const usuarioId = req.headers["x-user-id"];

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      await bitacoraService.eliminarBitacora(req.params.id, usuarioId);
      res.json({
        success: true,
        message: "Bitácora eliminada exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async iniciarSesion(req, res) {
    try {
      const usuarioId = req.headers["x-user-id"];

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.iniciarSesion(
        req.params.id,
        usuarioId
      );
      res.json({
        success: true,
        message: "Sesión iniciada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async completarSesion(req, res) {
    try {
      const usuarioId = req.headers["x-user-id"];
      const { observaciones } = req.body;

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.completarSesion(
        req.params.id,
        usuarioId,
        observaciones
      );
      res.json({
        success: true,
        message: "Sesión completada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async firmar(req, res) {
    try {
      const usuarioId = req.headers["x-user-id"];

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.firmarBitacora(
        req.params.id,
        usuarioId
      );
      res.json({
        success: true,
        message: "Bitácora firmada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async bloquear(req, res) {
    try {
      const usuarioId = req.headers["x-user-id"];
      const { motivo } = req.body;

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.bloquearBitacora(
        req.params.id,
        usuarioId,
        motivo
      );
      res.json({
        success: true,
        message: "Bitácora bloqueada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async desbloquear(req, res) {
    try {
      const usuarioId = req.headers["x-user-id"];

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.desbloquearBitacora(
        req.params.id,
        usuarioId
      );
      res.json({
        success: true,
        message: "Bitácora desbloqueada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizarMesa(req, res) {
    try {
      const usuarioId = req.headers["x-user-id"];
      const numeroMesa = Number.parseInt(req.params.numeroMesa);

      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      const bitacora = await bitacoraService.actualizarMesaTrabajo(
        req.params.id,
        numeroMesa,
        req.body,
        usuarioId
      );
      res.json({
        success: true,
        message: "Mesa de trabajo actualizada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorProfesor(req, res) {
    try {
      const filtros = {
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
      };

      const bitacoras = await bitacoraService.obtenerBitacorasPorProfesor(
        req.params.profesorId,
        filtros
      );
      res.json({
        success: true,
        data: bitacoras,
      });
    } catch (error) {
      res.status(500).json({
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
        departamento: req.query.departamento,
        estado: req.query.estado,
        nrc: req.query.nrc,
      };

      const reporte = await bitacoraService.generarReporte(filtros);
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
}

module.exports = new BitacoraController();
