const usuarioService = require("../services/usuario.service")
const jwt = require("jsonwebtoken")

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

  async login(req, res) {
    try {
      const { correo, password } = req.body
      const usuario = await usuarioService.autenticarUsuario(correo, password)

      // Generar JWT token
      const token = jwt.sign(
        {
          id: usuario.id,
          correo: usuario.correo,
          rol: usuario.rol,
        },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "24h" },
      )

      res.json({
        success: true,
        message: "Autenticación exitosa",
        data: {
          usuario,
          token,
        },
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerPorRol(req, res) {
    try {
      const { rol } = req.params
      const usuarios = await usuarioService.obtenerUsuariosPorRol(rol)
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
}

module.exports = new UsuarioController()
