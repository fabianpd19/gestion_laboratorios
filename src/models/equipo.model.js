const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Equipo = sequelize.define(
  "Equipo",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
    },
    nombre: {
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
  },
  {
    tableName: "equipos",
    timestamps: true,
  },
)

module.exports = Equipo
