"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("equipos_laboratorio", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      id_guia: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "guias_laboratorio",
          key: "id",
        },
      },
      observacion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("disponible", "en_uso", "mantenimiento", "dañado", "fuera_servicio"),
        allowNull: false,
        defaultValue: "disponible",
      },
      fecha_actual: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Agregar índices
    await queryInterface.addIndex("equipos_laboratorio", ["id_guia"]);
    await queryInterface.addIndex("equipos_laboratorio", ["estado"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("equipos_laboratorio");
  },
};
