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

module.exports = auth
