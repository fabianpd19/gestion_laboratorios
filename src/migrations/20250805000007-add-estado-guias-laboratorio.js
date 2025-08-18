"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero, agregar el campo estado a guias_laboratorio
    await queryInterface.addColumn("guias_laboratorio", "estado", {
      type: Sequelize.ENUM("activa", "inactiva", "archivada"),
      allowNull: false,
      defaultValue: "activa"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("guias_laboratorio", "estado");
  }
};
