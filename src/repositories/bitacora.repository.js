const Bitacora = require("../models/bitacora.model");
const Usuario = require("../models/usuario.model");
const Laboratorio = require("../models/laboratorio.model");
const { Op } = require("sequelize");

class BitacoraRepository {
  async crear(datosBitacora) {
    try {
      return await Bitacora.create(datosBitacora);
    } catch (error) {
      throw new Error(`Error al crear bitácora: ${error.message}`);
    }
  }

  async obtenerPorId(id) {
    try {
      return await Bitacora.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: { exclude: ["password"] },
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error al obtener bitácora: ${error.message}`);
    }
  }

  async obtenerTodas(filtros = {}) {
    try {
      const whereClause = {};

      if (filtros.usuario_id) {
        whereClause.usuario_id = filtros.usuario_id;
      }

      if (filtros.laboratorio_id) {
        whereClause.laboratorio_id = filtros.laboratorio_id;
      }

      if (filtros.estado) {
        whereClause.estado = filtros.estado;
      }

      if (filtros.departamento) {
        whereClause.departamento = { [Op.iLike]: `%${filtros.departamento}%` };
      }

      if (filtros.carrera) {
        whereClause.carrera = { [Op.iLike]: `%${filtros.carrera}%` };
      }

      if (filtros.fecha_inicio && filtros.fecha_fin) {
        whereClause.fecha_uso_laboratorio = {
          [Op.between]: [filtros.fecha_inicio, filtros.fecha_fin],
        };
      }

      if (filtros.busqueda) {
        whereClause[Op.or] = [
          { tema_practica_proyecto: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { materia_asignatura: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { nombre_solicitante: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ];
      }

      return await Bitacora.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: { exclude: ["password"] },
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
        order: [["fecha_uso_laboratorio", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error al obtener bitácoras: ${error.message}`);
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Bitacora.update(
        {
          ...datosActualizacion,
          fecha_actualizacion: new Date(),
        },
        {
          where: { id },
        }
      );

      if (filasAfectadas === 0) {
        throw new Error("Bitácora no encontrada");
      }

      return await this.obtenerPorId(id);
    } catch (error) {
      throw new Error(`Error al actualizar bitácora: ${error.message}`);
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Bitacora.destroy({
        where: { id },
      });

      if (filasAfectadas === 0) {
        throw new Error("Bitácora no encontrada");
      }

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar bitácora: ${error.message}`);
    }
  }

  async obtenerPorUsuario(usuarioId, filtros = {}) {
    try {
      const whereClause = { usuario_id: usuarioId };

      if (filtros.estado) {
        whereClause.estado = filtros.estado;
      }

      return await Bitacora.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: { exclude: ["password"] },
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
        order: [["fecha_uso_laboratorio", "DESC"]],
      });
    } catch (error) {
      throw new Error(
        `Error al obtener bitácoras del usuario: ${error.message}`
      );
    }
  }

  async obtenerEstadisticas(filtros = {}) {
    try {
      const whereClause = {};

      if (filtros.fecha_inicio && filtros.fecha_fin) {
        whereClause.fecha_uso_laboratorio = {
          [Op.between]: [filtros.fecha_inicio, filtros.fecha_fin],
        };
      }

      const estadisticas = await Bitacora.findAll({
        where: whereClause,
        attributes: [
          "estado",
          "departamento",
          "carrera",
          [
            Bitacora.sequelize.fn("COUNT", Bitacora.sequelize.col("id")),
            "cantidad",
          ],
          [
            Bitacora.sequelize.fn(
              "AVG",
              Bitacora.sequelize.col("numero_usuarios")
            ),
            "promedio_usuarios",
          ],
        ],
        group: ["estado", "departamento", "carrera"],
        raw: true,
      });

      return estadisticas;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = new BitacoraRepository();
