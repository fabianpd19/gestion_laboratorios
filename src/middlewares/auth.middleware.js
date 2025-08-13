// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta";

// Middleware para verificar el token
function verificarToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Guardamos datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// Middleware para verificar rol
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user?.rol) {
      return res.status(403).json({ error: "Rol no definido" });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
}

module.exports = {
  verificarToken,
  verificarRol
};
