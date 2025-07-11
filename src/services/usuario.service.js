const usuarioRepository = require("../repositories/usuario.repository")
const bcrypt = require("bcrypt")

class UsuarioService {
  async crearUsuario(datosUsuario) {
    try {
      // Validar que el email no exista
      const usuarioExistente = await usuarioRepository.obtenerPorEmail(datosUsuario.email)
      if (usuarioExistente) {
        throw new Error("El email ya está registrado")
      }

      // Encriptar contraseña
      const saltRounds = 10
      const passwordEncriptada = await bcrypt.hash(datosUsuario.password, saltRounds)

      // Crear usuario
      const nuevoUsuario = await usuarioRepository.crear({
        ...datosUsuario,
        password: passwordEncriptada,
      })

      // Retornar usuario sin contraseña
      const { password, ...usuarioSinPassword } = nuevoUsuario.toJSON()
      return usuarioSinPassword
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async obtenerUsuario(id) {
    try {
      const usuario = await usuarioRepository.obtenerPorId(id)
      if (!usuario) {
        throw new Error("Usuario no encontrado")
      }
      return usuario
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async obtenerUsuarios(filtros = {}) {
    try {
      return await usuarioRepository.obtenerTodos(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async actualizarUsuario(id, datosActualizacion) {
    try {
      // Si se actualiza la contraseña, encriptarla
      if (datosActualizacion.password) {
        const saltRounds = 10
        datosActualizacion.password = await bcrypt.hash(datosActualizacion.password, saltRounds)
      }

      return await usuarioRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async eliminarUsuario(id) {
    try {
      return await usuarioRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async autenticarUsuario(email, password) {
    try {
      const usuario = await usuarioRepository.obtenerPorEmail(email)
      if (!usuario) {
        throw new Error("Credenciales inválidas")
      }

      const passwordValida = await bcrypt.compare(password, usuario.password)
      if (!passwordValida) {
        throw new Error("Credenciales inválidas")
      }

      if (!usuario.activo) {
        throw new Error("Usuario inactivo")
      }

      // Retornar usuario sin contraseña
      const { password: _, ...usuarioSinPassword } = usuario.toJSON()
      return usuarioSinPassword
    } catch (error) {
      throw new Error(`Error en autenticación: ${error.message}`)
    }
  }

  async obtenerEstadisticasUsuarios() {
    try {
      return await usuarioRepository.contarPorRol()
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }
}

module.exports = new UsuarioService()
