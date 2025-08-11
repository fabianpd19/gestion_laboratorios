const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")
const TokenManager = require("../../utils/tokenManager")

const auth = async (req, res, next) => {
  console.log('=== Middleware de autenticación ===');
  
  try {
    // Obtener el token del header o query string (útil para websockets o pruebas)
    let token = req.header("Authorization")?.replace(/^Bearer\s+/i, '');
    
    if (!token && req.query.token) {
      token = req.query.token;
    }

    console.log('Token recibido:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
      console.error('Error: No se proporcionó token de autenticación');
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
        code: "TOKEN_REQUIRED"
      });
    }

    // Verificar JWT básico primero
    let decoded;
    try {
      console.log('Verificando JWT...');
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
      
      if (!decoded || !decoded.id) {
        throw new Error("Token inválido: estructura incorrecta");
      }
      
      console.log('JWT verificado. ID de usuario:', decoded.id);
      
    } catch (jwtError) {
      console.error("Error al verificar token JWT:", jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
        code: "TOKEN_INVALID",
        debug: {
          error: jwtError.message,
          name: jwtError.name
        }
      });
    }
    
    // Obtener el usuario de la base de datos
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { include: ['activeToken', 'tokenSignature'] }
    });

    if (!usuario) {
      console.error('Error: Usuario no encontrado en la base de datos');
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
        code: "USER_NOT_FOUND"
      });
    }

    console.log('Usuario encontrado:', {
      id: usuario.id,
      correo: usuario.correo,
      activeToken: usuario.activeToken ? 'Presente' : 'Ausente'
    });

    // Verificar token único con TokenManager
    try {
      console.log('Verificando token único...');
      await TokenManager.verifyUniqueToken(token, usuario);
      console.log('Token único verificado correctamente');
      
    } catch (tokenError) {
      console.error('Error al verificar token único:', tokenError.message);
      
      // Invalidar el token en la base de datos
      try {
        await usuario.invalidarToken();
        console.log('Token inválido, se ha invalidado en la base de datos');
      } catch (invalidateError) {
        console.error('Error al invalidar token:', invalidateError);
      }
      
      return res.status(401).json({
        success: false,
        message: "Sesión inválida o expirada. Por favor, inicia sesión nuevamente.",
        code: "TOKEN_INVALID",
        debug: {
          error: tokenError.message,
          expectedToken: usuario.activeToken,
          receivedToken: token
        }
      });
    }

    // Añadir usuario y token al request para su uso posterior
    req.user = usuario;
    req.token = token;
    
    console.log('Autenticación exitosa para el usuario:', usuario.correo);
    next();
    
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    // Manejar diferentes tipos de errores
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "La sesión ha expirado",
        code: "TOKEN_EXPIRED"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
        code: "TOKEN_INVALID"
      });
    }
    
    // Error inesperado
    console.error('Error inesperado en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor durante la autenticación",
      code: "AUTH_ERROR"
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Acceso no autorizado"
      })
    }

    const userRole = req.user.rol
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(" o ")}`
      })
    }

    next()
  }
}

// Middleware específicos para roles comunes
const requireJefeLaboratorio = requireRole("jefe_laboratorio")
const requireDocente = requireRole(["docente", "admin", "jefe_laboratorio"])
const requireAdmin = requireRole("admin")

// Middleware para endpoints que requieren invalidar la sesión actual
const requireSessionInvalidation = async (req, res, next) => {
  // Útil para cambio de contraseña, etc.
  req.invalidateCurrentSession = async () => {
    if (req.user) {
      await req.user.invalidarToken()
    }
  }
  next()
}

module.exports = {
  auth,
  requireRole,
  requireJefeLaboratorio,
  requireDocente,
  requireAdmin,
  requireSessionInvalidation
}
