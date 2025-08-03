const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const UsoLaboratorio = sequelize.define(
  "UsoLaboratorio",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
    },
    laboratorio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "laboratorios",
        key: "id",
      },
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    fecha_uso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "usos_laboratorio",
    timestamps: true,
  },
)

module.exports = UsoLaboratorio
