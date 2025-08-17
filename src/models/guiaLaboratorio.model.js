const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const GuiaLaboratorio = sequelize.define(
  "GuiaLaboratorio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "laboratorios",
        key: "id",
      },
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "asignaturas",
        key: "id",
      },
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    parcial: {
      type: DataTypes.ENUM("1", "2", "3"),
      allowNull: false,
    },
    archivo_pdf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    habilitada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hora_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hora_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "guias_laboratorio",
    timestamps: true,
  }
);

module.exports = GuiaLaboratorio;
