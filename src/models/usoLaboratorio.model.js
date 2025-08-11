const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const UsoLaboratorio = sequelize.define(
  "UsoLaboratorio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
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
