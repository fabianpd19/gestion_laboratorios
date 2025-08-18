"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero, actualizar los registros problemáticos con id_guia = 0 a NULL
    await queryInterface.sequelize.query(
      'UPDATE "equipos_laboratorio" SET "id_guia" = NULL WHERE "id_guia" = 0'
    );

    // Luego, eliminar la restricción existente
    try {
      await queryInterface.removeConstraint("equipos_laboratorio", "equipos_laboratorio_id_guia_fkey");
    } catch (error) {
      // La restricción puede no existir, continuar
    }

    // Finalmente, agregar la restricción con ON DELETE SET NULL
    await queryInterface.addConstraint("equipos_laboratorio", {
      fields: ["id_guia"],
      type: "foreign key",
      name: "equipos_laboratorio_id_guia_fkey",
      references: {
        table: "guias_laboratorio",
        field: "id"
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("equipos_laboratorio", "equipos_laboratorio_id_guia_fkey");
  }
};
