const usuarioService = require("../services/usuario.service")

class UsuarioController {
  async crear(req, res) {
    try {
      const usuario = await usuarioService.crearUsuario(req.body)
      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: usuario,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerTodos(req, res) {
    try {
      const filtros = {
        rol: req.query.rol,
        activo: req.query.activo,
        busqueda: req.query.busqueda,
      }

      const usuarios = await usuarioService.obtenerUsuarios(filtros)
      res.json({
        success: true,
        data: usuarios,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerPorId(req, res) {
    try {
      const usuario = await usuarioService.obtenerUsuario(req.params.id)
      res.json({
        success: true,
        data: usuario,
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      })
    }
  }

  async actualizar(req, res) {
    try {
      const usuario = await usuarioService.actualizarUsuario(req.params.id, req.body)
      res.json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: usuario,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async eliminar(req, res) {
    try {
      await usuarioService.eliminarUsuario(req.params.id)
      res.json({
        success: true,
        message: "Usuario eliminado exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async autenticar(req, res) {
    try {
      const { email, password } = req.body
      const usuario = await usuarioService.autenticarUsuario(email, password)
      res.json({
        success: true,
        message: "Autenticación exitosa",
        data: usuario,
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await usuarioService.obtenerEstadisticasUsuarios()
      res.json({
        success: true,
        data: estadisticas,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new UsuarioController()
