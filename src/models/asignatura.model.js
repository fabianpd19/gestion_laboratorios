const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Asignatura = sequelize.define(
  "Asignatura",
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
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "asignaturas",
    timestamps: true,
  },
)

module.exports = Asignatura
