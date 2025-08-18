const EquipoLaboratorio = require("../models/equipoLaboratorio.model");

class EquipoLaboratorioSimpleService {
  async createEquipoSimple(data) {
    try {
      // Crear registro con datos mínimos
      const equipo = await EquipoLaboratorio.create({
        nombre: `Equipo ${data.equipo_id} - Guía ${data.guia_id}`,
        descripcion: data.observaciones,
        estado: "asignado",
        laboratorio_id: 1, // Ajustar según tu lógica
        // Resto de campos con valores por defecto
      });

      return equipo;
    } catch (error) {
      throw new Error(`Error al crear equipo simple: ${error.message}`);
    }
  }
}

module.exports = new EquipoLaboratorioSimpleService();
