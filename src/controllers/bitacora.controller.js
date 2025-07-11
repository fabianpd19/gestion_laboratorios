const bitacoraService = require("../services/bitacora.service");

class BitacoraController {
  async crear(req, res) {
    try {
      const bitacora = await bitacoraService.crearBitacora(req.body);
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
        usuario_id: req.query.usuario_id,
        laboratorio_id: req.query.laboratorio_id,
        estado: req.query.estado,
        departamento: req.query.departamento,
        carrera: req.query.carrera,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        busqueda: req.query.busqueda,
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
      const bitacora = await bitacoraService.actualizarBitacora(
        req.params.id,
        req.body
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
      await bitacoraService.eliminarBitacora(req.params.id);
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

  async enviar(req, res) {
    try {
      const bitacora = await bitacoraService.enviarBitacora(req.params.id);
      res.json({
        success: true,
        message: "Bitácora enviada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async aprobar(req, res) {
    try {
      const { observaciones } = req.body;
      const bitacora = await bitacoraService.aprobarBitacora(
        req.params.id,
        observaciones
      );
      res.json({
        success: true,
        message: "Bitácora aprobada exitosamente",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async rechazar(req, res) {
    try {
      const { observaciones } = req.body;
      const bitacora = await bitacoraService.rechazarBitacora(
        req.params.id,
        observaciones
      );
      res.json({
        success: true,
        message: "Bitácora rechazada",
        data: bitacora,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorUsuario(req, res) {
    try {
      const filtros = {
        estado: req.query.estado,
      };

      const bitacoras = await bitacoraService.obtenerBitacorasUsuario(
        req.params.usuarioId,
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
        carrera: req.query.carrera,
        estado: req.query.estado,
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
