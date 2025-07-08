const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Laboratorio = sequelize.define(
  "Laboratorio",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    ubicacion: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    capacidad_maxima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    tipo_laboratorio: {
      type: DataTypes.ENUM("quimica", "fisica", "biologia", "computacion", "electronica"),
      allowNull: false,
    },
    equipos_disponibles: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    horario_disponible: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "laboratorios",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["codigo"],
      },
      {
        fields: ["tipo_laboratorio"],
      },
    ],
  },
)

module.exports = Laboratorio
