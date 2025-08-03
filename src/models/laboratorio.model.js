const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Laboratorio = sequelize.define(
  "Laboratorio",
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    responsable_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "laboratorios",
    timestamps: true,
  },
)

module.exports = Laboratorio
