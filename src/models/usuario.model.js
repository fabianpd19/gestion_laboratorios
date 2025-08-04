const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["estudiante", "docente", "admin"]],
      },
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  },
)

module.exports = Usuario
