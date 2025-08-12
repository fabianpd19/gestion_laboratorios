const guiaLaboratorioService = require("../services/guiaLaboratorio.service");

class GuiaLaboratorioController {
  // Crear guía con validación de estado permitido
  async crear(req, res) {
    try {
      const { estado } = req.body;
      const estadosValidos = ["pendiente", "realizada", "finalizada"];
      if (estado && !estadosValidos.includes(estado.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Estado inválido. Valores permitidos: ${estadosValidos.join(", ")}`,
        });
      }

      // Validar número de guías por materia (debe ir en service)
      const guia = await guiaLaboratorioService.crearGuia(req.body);
      res.status(201).json({
        success: true,
        message: "Guía creada exitosamente",
        data: guia,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener todas las guías, con filtro opcional por estado
  async obtenerTodas(req, res) {
    try {
      const filtros = {
        laboratorio_id: req.query.laboratorio_id,
        asignatura_id: req.query.asignatura_id,
        docente_id: req.query.docente_id,
        estado: req.query.estado, // Agregado filtro por estado
        busqueda: req.query.busqueda,
      };

      const guias = await guiaLaboratorioService.obtenerGuias(filtros);
      res.json({
        success: true,
        data: guias,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener solo guías habilitadas/disponibles (ejemplo: estado pendiente o habilitada)
  async obtenerGuiasHabilitadas(req, res) {
    try {
      const estadosHabilitados = ["pendiente", "habilitada"];
      const guias = await guiaLaboratorioService.obtenerGuias({ estado: estadosHabilitados });
      res.json({
        success: true,
        data: guias,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener guía por ID
  async obtenerPorId(req, res) {
    try {
      const guia = await guiaLaboratorioService.obtenerGuia(req.params.id);
      res.json({
        success: true,
        data: guia,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Actualizar guía con validación de estado permitido
  async actualizar(req, res) {
    try {
      const { estado } = req.body;
      const estadosValidos = ["pendiente", "realizada", "finalizada"];
      if (estado && !estadosValidos.includes(estado.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Estado inválido. Valores permitidos: ${estadosValidos.join(", ")}`,
        });
      }

      const guia = await guiaLaboratorioService.actualizarGuia(req.params.id, req.body);
      res.json({
        success: true,
        message: "Guía actualizada exitosamente",
        data: guia,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Eliminar guía
  async eliminar(req, res) {
    try {
      await guiaLaboratorioService.eliminarGuia(req.params.id);
      res.json({
        success: true,
        message: "Guía eliminada exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new GuiaLaboratorioController();