const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ mensaje: "Token requerido" });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido" });

    req.usuario = usuario; // El payload del token
    next();
  });
}

module.exports = verificarToken;
