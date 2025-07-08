const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")
const Usuario = require("./usuario.model")
const Laboratorio = require("./laboratorio.model")

const UsoLaboratorio = sequelize.define(
  "UsoLaboratorio",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    proposito: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200],
      },
    },
    asignatura: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    numero_estudiantes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    equipos_utilizados: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("programado", "en_curso", "finalizado", "cancelado"),
      allowNull: false,
      defaultValue: "programado",
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comentarios_finales: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "usos_laboratorio",
    timestamps: true,
    indexes: [
      {
        fields: ["fecha_inicio"],
      },
      {
        fields: ["estado"],
      },
      {
        fields: ["usuario_id"],
      },
      {
        fields: ["laboratorio_id"],
      },
    ],
  },
)

// Definir asociaciones
UsoLaboratorio.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
})

UsoLaboratorio.belongsTo(Laboratorio, {
  foreignKey: "laboratorio_id",
  as: "laboratorio",
})

Usuario.hasMany(UsoLaboratorio, {
  foreignKey: "usuario_id",
  as: "usos_laboratorio",
})

Laboratorio.hasMany(UsoLaboratorio, {
  foreignKey: "laboratorio_id",
  as: "usos",
})

module.exports = UsoLaboratorio
