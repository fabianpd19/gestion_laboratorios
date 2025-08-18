"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la restricción de clave foránea existente
    await queryInterface.removeConstraint(
      "equipos_laboratorio", 
      "equipos_laboratorio_id_guia_fkey"
    ).catch(() => {}); // Ignorar si no existe
    
    // Hacer id_guia completamente nullable sin restricción
    await queryInterface.changeColumn("equipos_laboratorio", "id_guia", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: null // Eliminar referencia
    });
  },

  async down(queryInterface, Sequelize) {
    // Restaurar la restricción de clave foránea
    await queryInterface.changeColumn("equipos_laboratorio", "id_guia", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "guias_laboratorio",
        key: "id",
      },
    });
  },
};
