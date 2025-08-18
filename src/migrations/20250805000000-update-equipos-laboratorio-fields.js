"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columnas faltantes que están en el modelo pero no en la migración original
    await queryInterface.addColumn("equipos_laboratorio", "observacion", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("equipos_laboratorio", "fecha_actual", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Renombrar columna id_guia a id_guia (si es necesario)
    await queryInterface.renameColumn("equipos_laboratorio", "guia_id", "id_guia");

    // Eliminar columnas duplicadas si existen
    await queryInterface.removeColumn("equipos_laboratorio", "laboratorio_id");
    
    // Agregar índices faltantes
    await queryInterface.addIndex("equipos_laboratorio", ["id_guia"]);
    await queryInterface.addIndex("equipos_laboratorio", ["estado"]);
  },

  async down(queryInterface, Sequelize) {
    // Revertir cambios en caso de rollback
    await queryInterface.removeColumn("equipos_laboratorio", "observacion");
    await queryInterface.removeColumn("equipos_laboratorio", "fecha_actual");
    await queryInterface.renameColumn("equipos_laboratorio", "id_guia", "guia_id");
    await queryInterface.addColumn("equipos_laboratorio", "laboratorio_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "laboratorios",
        key: "id",
      },
    });
    await queryInterface.removeIndex("equipos_laboratorio", ["id_guia"]);
    await queryInterface.removeIndex("equipos_laboratorio", ["estado"]);
  },
};
