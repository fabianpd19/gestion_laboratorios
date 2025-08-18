const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const EquipoLaboratorio = sequelize.define(
  "EquipoLaboratorio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    id_guia: {
      type: DataTypes.INTEGER,
      allowNull: true, // Cambiado a true temporalmente
      references: {
        model: "guias_laboratorio",
        key: "id",
      },
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("disponible", "en_uso", "mantenimiento", "dañado", "fuera_servicio"),
      allowNull: false,
      defaultValue: "disponible",
    },
    fecha_actual: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "equipos_laboratorio",
    timestamps: true,
    indexes: [
      {
        fields: ["id_guia"],
      },
      {
        fields: ["estado"],
      },
    ],
  },
)

module.exports = EquipoLaboratorio
