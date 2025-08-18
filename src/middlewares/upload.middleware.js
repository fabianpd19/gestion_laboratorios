const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear directorios si no existen
const createUploadDirs = () => {
  const dirs = ["uploads", "uploads/guias"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createUploadDirs();
    const folder = req.body.folder || "general";
    const uploadPath = "uploads/guias"; // 🔑 siempre guias
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Crear nombre único: timestamp-random-nombre_original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Limpiar el nombre del archivo
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${uniqueSuffix}-${cleanName}${ext}`;
    cb(null, filename);
  },
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    guias: ["application/pdf"],
    general: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
  };

  const folder = req.body.folder || "general";
  const allowed = allowedTypes[folder] || allowedTypes.general;

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Tipo de archivo no permitido para ${folder}. Tipos permitidos: ${allowed.join(
        ", "
      )}`
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1, // Solo un archivo por vez
  },
  fileFilter: fileFilter,
});

// Middleware para manejar errores de multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "El archivo es demasiado grande. Máximo 10MB permitido.",
          error: "FILE_TOO_LARGE",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Demasiados archivos. Solo se permite un archivo.",
          error: "TOO_MANY_FILES",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Campo de archivo inesperado.",
          error: "UNEXPECTED_FIELD",
        });
      default:
        return res.status(400).json({
          success: false,
          message: "Error en la subida del archivo.",
          error: error.code,
        });
    }
  } else if (error && error.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: "INVALID_FILE_TYPE",
    });
  }

  next(error);
};

module.exports = {
  upload,
  handleUploadError,
  createUploadDirs,
};
