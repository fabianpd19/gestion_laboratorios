const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Usuario = require("./usuario.model");
const Laboratorio = require("./laboratorio.model");

const Bitacora = sequelize.define(
  "Bitacora",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Información institucional
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    carrera: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // Información del laboratorio (se obtiene de la relación)
    nombre_laboratorio: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codigo_laboratorio: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    // Información del usuario/solicitante (se obtiene de la relación)
    nombre_solicitante: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Información de uso
    fecha_uso_laboratorio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    materia_asignatura: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nivel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    numero_usuarios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    tema_practica_proyecto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // Descargo de equipos, materiales, etc.
    descargo_equipos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "Array de objetos con {cantidad, detalle}",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Campos de control
    estado: {
      type: DataTypes.ENUM("borrador", "enviada", "aprobada", "rechazada"),
      allowNull: false,
      defaultValue: "borrador",
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bitacoras",
    timestamps: true,
    indexes: [
      {
        fields: ["fecha_uso_laboratorio"],
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
      {
        fields: ["departamento"],
      },
      {
        fields: ["carrera"],
      },
    ],
  }
);

// Definir asociaciones
Bitacora.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

Bitacora.belongsTo(Laboratorio, {
  foreignKey: "laboratorio_id",
  as: "laboratorio",
});

Usuario.hasMany(Bitacora, {
  foreignKey: "usuario_id",
  as: "bitacoras",
});

Laboratorio.hasMany(Bitacora, {
  foreignKey: "laboratorio_id",
  as: "bitacoras",
});

module.exports = Bitacora;
