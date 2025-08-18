const EquipoLaboratorioService = require("../services/equipoLaboratorio.service");

class EquipoLaboratorioSimpleController {
  async createEquipoSimple(req, res) {
    try {
      const { guia_id, equipo_id, observaciones } = req.body;
      
      // Validar campos requeridos
      if (!guia_id || !equipo_id) {
        return res.status(400).json({
          success: false,
          message: "guia_id y equipo_id son requeridos"
        });
      }

      // Crear registro simplificado
      const equipo = await EquipoLaboratorioService.createEquipoSimple({
        guia_id: parseInt(guia_id),
        equipo_id: parseInt(equipo_id),
        observaciones: observaciones || ""
      });

      res.status(201).json({
        success: true,
        message: "Equipo asignado a guía exitosamente",
        data: equipo
      });
    } catch (error) {
      console.error("Error en createEquipoSimple:", error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new EquipoLaboratorioSimpleController();
