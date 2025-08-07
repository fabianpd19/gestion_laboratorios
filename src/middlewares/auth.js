const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key")
    const usuario = await Usuario.findByPk(decoded.id)

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      })
    }

    req.user = usuario
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token inválido",
    })
  }
}

const requireJefeLaboratorio = (req, res, next) => {
  if (req.user && req.user.rol === "jefe_laboratorio") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Acceso denegado. Se requiere rol de jefe de laboratorio.",
  });
};

module.exports = auth; // ✅ correcta exportación de la función
