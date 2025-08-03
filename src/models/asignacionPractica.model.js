const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const AsignacionPractica = sequelize.define(
  "AsignacionPractica",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
    },
    estudiante_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    equipo_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "equipos",
        key: "id",
      },
    },
    guia_laboratorio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "guias_laboratorio",
        key: "id",
      },
    },
  },
  {
    tableName: "asignaciones_practicas",
    timestamps: true,
  },
)

module.exports = AsignacionPractica
