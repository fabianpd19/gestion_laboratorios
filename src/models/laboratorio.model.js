const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Laboratorio = sequelize.define(
  "Laboratorio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
  },
  {
    tableName: "laboratorios",
    timestamps: true,
  },
)

module.exports = Laboratorio
