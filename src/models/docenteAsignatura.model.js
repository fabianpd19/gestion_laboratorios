const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const DocenteAsignatura = sequelize.define(
  "DocenteAsignatura",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
    },
    docente_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    asignatura_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "asignaturas",
        key: "id",
      },
    },
  },
  {
    tableName: "docente_asignaturas",
    timestamps: true,
  },
)

module.exports = DocenteAsignatura
