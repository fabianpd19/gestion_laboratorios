const Usuario = require("../models/usuario.model")
const { Op } = require("sequelize")

class UsuarioRepository {
  async crear(datosUsuario) {
    try {
      return await Usuario.create(datosUsuario)
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Usuario.findByPk(id, {
        attributes: { exclude: ["password"] },
      })
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`)
    }
  }

  async obtenerPorEmail(email) {
    try {
      return await Usuario.findOne({
        where: { email },
      })
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`)
    }
  }

  async obtenerTodos(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.rol) {
        whereClause.rol = filtros.rol
      }

      if (filtros.activo !== undefined) {
        whereClause.activo = filtros.activo
      }

      if (filtros.busqueda) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { email: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ]
      }

      return await Usuario.findAll({
        where: whereClause,
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Usuario.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Usuario no encontrado")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Usuario.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Usuario no encontrado")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`)
    }
  }

  async contarPorRol() {
    try {
      return await Usuario.findAll({
        attributes: ["rol", [Usuario.sequelize.fn("COUNT", Usuario.sequelize.col("id")), "cantidad"]],
        group: ["rol"],
        raw: true,
      })
    } catch (error) {
      throw new Error(`Error al contar usuarios por rol: ${error.message}`)
    }
  }
}

module.exports = new UsuarioRepository()
