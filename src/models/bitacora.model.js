const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Bitacora = sequelize.define(
  "Bitacora",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
    },
    guia_laboratorio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "guias_laboratorio",
        key: "id",
      },
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
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "bitacoras",
    timestamps: true,
  },
)

module.exports = Bitacora
