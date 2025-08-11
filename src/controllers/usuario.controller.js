const Usuario = require("../models/usuario.model")
const TokenManager = require("../../utils/tokenManager")
const bcrypt = require("bcryptjs")

const usuarioController = {
  
  // Login local (email/password)
  login: async (req, res) => {
    try {
      const { correo, password } = req.body

      if (!correo || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos"
        })
      }

      // Buscar usuario
      const usuario = await Usuario.findOne({ where: { correo } })
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        })
      }

      // Validar contraseña
      const passwordValido = await usuario.validarPassword(password)
      
      if (!passwordValido) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        })
      }

      // Extraer información del dispositivo
      const deviceInfo = TokenManager.extractDeviceInfo(req)

      // Generar token único (invalida el anterior automáticamente)
      const token = await TokenManager.setUniqueToken(usuario, deviceInfo)

      // Respuesta exitosa
      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            provider: usuario.provider,
            avatar: usuario.avatar
          }
        }
      })

    } catch (error) {
      console.error("Error en login:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        code: "INTERNAL_SERVER_ERROR"
      })
    }
  },

  // Verificar token (para el contexto de auth del frontend)
  verify: async (req, res) => {
    console.log('=== Inicio de verificación de token ===');
    console.log('Token recibido:', req.token);
    console.log('Usuario en request:', req.user ? 'Sí' : 'No');
    
    try {
      if (!req.user || !req.user.id) {
        console.error('Error: No hay usuario en la solicitud o falta el ID');
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
          code: "UNAUTHORIZED"
        });
      }

      // Verificar que el usuario existe en la base de datos
      const usuario = await Usuario.findByPk(req.user.id, {
        attributes: ['id', 'nombre', 'correo', 'rol', 'provider', 'avatar', 'activeToken', 'tokenSignature']
      });

      if (!usuario) {
        console.error('Error: Usuario no encontrado en la base de datos');
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
          code: "USER_NOT_FOUND"
        });
      }

      console.log('Usuario encontrado en BD:', {
        id: usuario.id,
        correo: usuario.correo,
        activeToken: usuario.activeToken ? 'Presente' : 'Ausente',
        tokenSignature: usuario.tokenSignature ? 'Presente' : 'Ausente'
      });

      // Verificar token único con TokenManager
      try {
        console.log('Verificando token con TokenManager...');
        await TokenManager.verifyUniqueToken(req.token, usuario);
        console.log('Token verificado exitosamente');
      } catch (tokenError) {
        console.error('Error al verificar token único:', tokenError.message);
        return res.status(401).json({
          success: false,
          message: "Sesión inválida o expirada",
          code: "TOKEN_INVALID",
          debug: {
            error: tokenError.message,
            tokenReceived: req.token,
            expectedToken: usuario.activeToken
          }
        });
      }

      // Datos seguros para enviar al frontend
      console.log('Preparando respuesta exitosa');
      const userData = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        provider: usuario.provider,
        avatar: usuario.avatar
      };

      res.json({
        success: true,
        data: { usuario: userData }
      });
    } catch (error) {
      console.error('Error en verify:', error);
      res.status(500).json({
        success: false,
        message: "Error al verificar la sesión",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Logout - Invalidar token actual
  logout: async (req, res) => {
    try {
      await req.user.invalidarToken()
      
      res.json({
        success: true,
        message: "Logout exitoso"
      })
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: "Error al cerrar sesión",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Callback exitoso de OAuth (para redirección)
  oauthSuccess: async (req, res) => {
    console.log('=== OAuth Success Callback ===');
    console.log('Usuario autenticado:', req.user ? 'Sí' : 'No');
    
    if (!req.user) {
      console.error('Error en autenticación OAuth: No se encontró el usuario');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
    
    try {
      console.log('Datos del usuario autenticado:', {
        id: req.user.id,
        correo: req.user.correo,
        provider: req.user.provider
      });
      
      // Extraer información del dispositivo
      const deviceInfo = TokenManager.extractDeviceInfo(req);
      console.log('Información del dispositivo:', deviceInfo);

      // Generar token único
      const token = await TokenManager.setUniqueToken(req.user, deviceInfo);
      console.log('Token generado exitosamente');

      // Preparar datos del usuario para el frontend
      const userData = {
        id: req.user.id,
        nombre: req.user.nombre,
        correo: req.user.correo,
        rol: req.user.rol,
        provider: req.user.provider,
        avatar: req.user.avatar
      };
      
      // Codificar los datos del usuario para la URL
      const userDataString = encodeURIComponent(JSON.stringify(userData));
      
      // Redireccionar al frontend con el token y los datos del usuario
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/oauth-callback?token=${token}&user=${userDataString}`;
      
      console.log('Redirigiendo a:', redirectUrl);
      return res.redirect(redirectUrl);
      
    } catch (error) {
      console.error("Error en OAuth callback:", error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=oauth_error`);
    }
  },

  // Crear usuario
  crear: async (req, res) => {
    try {
      const { nombre, correo, password, rol } = req.body

      const usuarioExistente = await Usuario.findOne({ where: { correo } })
      
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado"
        })
      }

      const nuevoUsuario = await Usuario.create({
        nombre,
        correo,
        password,
        rol,
        provider: 'local'
      })

      // No devolver el password en la respuesta
      const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON()

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: usuarioSinPassword
      })

    } catch (error) {
      console.error('Error en crear usuario:', error);
      res.status(500).json({
        success: false,
        message: "Error al crear usuario",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Cambiar contraseña (invalida todas las sesiones)
  cambiarPassword: async (req, res) => {
    try {
      const { passwordActual, passwordNueva } = req.body
      const usuario = req.user

      // Validar contraseña actual solo si el usuario tiene password local
      if (usuario.provider === 'local' && usuario.password) {
        const passwordValido = await usuario.validarPassword(passwordActual)
        if (!passwordValido) {
          return res.status(400).json({
            success: false,
            message: "Contraseña actual incorrecta"
          })
        }
      }

      // Actualizar contraseña
      usuario.password = passwordNueva
      usuario.provider = 'local' // Cambiar a local si era OAuth
      await usuario.save()

      // Invalidar todas las sesiones (forzar re-login)
      await usuario.invalidarToken()

      res.json({
        success: true,
        message: "Contraseña actualizada. Por favor, inicia sesión nuevamente."
      })

    } catch (error) {
      console.error('Error en cambiar contraseña:', error);
      res.status(500).json({
        success: false,
        message: "Error al cambiar contraseña",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Obtener todos los usuarios
  obtenerTodos: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password', 'activeToken', 'tokenSignature'] }
      })
      
      res.json({
        success: true,
        data: usuarios
      })
    } catch (error) {
      console.error('Error en obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Obtener usuario por ID
  obtenerPorId: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ['password', 'activeToken', 'tokenSignature'] }
      })
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        })
      }

      res.json({
        success: true,
        data: usuario
      })
    } catch (error) {
      console.error('Error en obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: "Error al obtener usuario",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Obtener usuarios por rol
  obtenerPorRol: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        where: { rol: req.params.rol },
        attributes: { exclude: ['password', 'activeToken', 'tokenSignature'] }
      })
      
      res.json({
        success: true,
        data: usuarios
      })
    } catch (error) {
      console.error('Error en obtener usuarios por rol:', error);
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios por rol",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Actualizar usuario
  actualizar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id)
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        })
      }

      // No permitir actualizar campos sensibles directamente
      const { password, activeToken, tokenSignature, ...datosActualizar } = req.body

      await usuario.update(datosActualizar)

      const { password: _, activeToken: __, tokenSignature: ___, ...usuarioActualizado } = usuario.toJSON()

      res.json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: usuarioActualizado
      })
    } catch (error) {
      console.error('Error en actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  },

  // Eliminar usuario
  eliminar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id)
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        })
      }

      // Invalidar token antes de eliminar
      await usuario.invalidarToken()
      await usuario.destroy()

      res.json({
        success: true,
        message: "Usuario eliminado exitosamente"
      })
    } catch (error) {
      console.error('Error en eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  }
}

module.exports = usuarioController;