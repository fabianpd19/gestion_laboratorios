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
    // Encabezado de la bitácora
    titulo_laboratorio: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "Bitácora del Laboratorio de xxxxxxxxx",
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Departamento de XXXXXX",
    },
    fecha_bitacora: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha dd/mmm/aaaa",
    },
    pagina: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "1 de 1",
      comment: "Página: 1 de 1",
    },
    pao: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "PAO",
    },

    // Información de la sesión
    nombre_profesor: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fecha_sesion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha(aa-mm-dd)",
    },
    nrc: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "NRC del curso",
    },
    numero_alumnos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: "Número de alumnos",
    },
    duracion_sesion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "dos horas",
      comment: "Cada sesión de laboratorio es de dos horas",
    },

    // Contenido académico
    tema: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Tema de la práctica",
    },
    objetivo: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Objetivo de la práctica",
    },

    // Detalles de trabajo
    mesas_trabajo: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment:
        "Array de mesas con {numero_mesa, alumno_responsable, equipos_entregados, observaciones}",
    },

    // Control y firmas
    firma_profesor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Indica si el profesor ha firmado",
    },
    fecha_firma_profesor: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Estados y control
    estado: {
      type: DataTypes.ENUM(
        "borrador",
        "en_sesion",
        "completada",
        "firmada",
        "bloqueada",
        "pendiente"
      ),
      allowNull: false,
      defaultValue: "borrador",
    },
    bloqueada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    motivo_bloqueo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_bloqueo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bloqueada_por: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Usuario,
        key: "id",
      },
    },

    // Observaciones generales
    observaciones_generales: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Metadatos
    creada_por: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
    ultima_modificacion_por: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Usuario,
        key: "id",
      },
    },
  },
  {
    tableName: "bitacoras",
    timestamps: true,
    indexes: [
      {
        fields: ["fecha_bitacora"],
      },
      {
        fields: ["fecha_sesion"],
      },
      {
        fields: ["estado"],
      },
      {
        fields: ["nrc"],
      },
      {
        fields: ["departamento"],
      },
      {
        fields: ["bloqueada"],
      },
    ],
  }
);

// Definir asociaciones
Bitacora.belongsTo(Usuario, {
  foreignKey: "creada_por",
  as: "creador",
});

Bitacora.belongsTo(Usuario, {
  foreignKey: "ultima_modificacion_por",
  as: "ultimo_editor",
});

Bitacora.belongsTo(Usuario, {
  foreignKey: "bloqueada_por",
  as: "bloqueador",
});

Bitacora.belongsTo(Laboratorio, {
  foreignKey: "laboratorio_id",
  as: "laboratorio",
});

Usuario.hasMany(Bitacora, {
  foreignKey: "creada_por",
  as: "bitacoras_creadas",
});

Laboratorio.hasMany(Bitacora, {
  foreignKey: "laboratorio_id",
  as: "bitacoras",
});

module.exports = Bitacora;
