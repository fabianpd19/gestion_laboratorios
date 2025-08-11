const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const DocenteAsignatura = sequelize.define(
  "DocenteAsignatura",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    docente_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
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
