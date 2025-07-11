const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Usuario = sequelize.define(
  "Usuario",
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
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    rol: {
      type: DataTypes.ENUM("estudiante", "docente", "jefe_laboratorio"),
      allowNull: false,
      defaultValue: "estudiante",
    },
    codigo_estudiante: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    programa_academico: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["rol"],
      },
    ],
  },
)

module.exports = Usuario
