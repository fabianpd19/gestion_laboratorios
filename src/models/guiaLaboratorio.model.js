const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const GuiaLaboratorio = sequelize.define(
  "GuiaLaboratorio",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    laboratorio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "laboratorios",
        key: "id",
      },
    },
    asignatura_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "asignaturas",
        key: "id",
      },
    },
    docente_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "guias_laboratorio",
    timestamps: true,
  },
)

module.exports = GuiaLaboratorio
