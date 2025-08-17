"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("guias_laboratorio", "parcial", {
      type: Sequelize.ENUM("1", "2", "3"),
      allowNull: false,
      defaultValue: "1",
    });

    await queryInterface.addColumn("guias_laboratorio", "archivo_pdf", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("guias_laboratorio", "habilitada", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("guias_laboratorio", "hora_inicio", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("guias_laboratorio", "hora_fin", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("guias_laboratorio", "parcial");
    await queryInterface.removeColumn("guias_laboratorio", "archivo_pdf");
    await queryInterface.removeColumn("guias_laboratorio", "habilitada");
    await queryInterface.removeColumn("guias_laboratorio", "hora_inicio");
    await queryInterface.removeColumn("guias_laboratorio", "hora_fin");

    // Eliminar ENUM en caso de rollback
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_guias_laboratorio_parcial";`
    );
  },
};
