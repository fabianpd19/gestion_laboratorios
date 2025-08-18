const path = require("path");
const fs = require("fs");

class UploadController {
  // Subir un archivo
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó ningún archivo",
          error: "NO_FILE_PROVIDED",
        });
      }

      // Normalizar la ruta para que funcione en Windows y Linux
      const filePath = req.file.path.replace(/\\/g, "/");

      const fileInfo = {
        success: true,
        message: "Archivo subido exitosamente",
        data: {
          filePath: filePath,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          folder: req.body.folder || "general",
          uploadDate: new Date().toISOString(),
        },
      };

      console.log("Archivo subido:", fileInfo.data);
      res.status(200).json(fileInfo);
    } catch (error) {
      console.error("Error en uploadFile:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al subir archivo",
        error: error.message,
      });
    }
  }

  // Eliminar un archivo
  static async deleteFile(req, res) {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: "Ruta del archivo es requerida",
          error: "FILE_PATH_REQUIRED",
        });
      }

      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
          error: "FILE_NOT_FOUND",
        });
      }

      // Verificar que el archivo está dentro del directorio uploads (seguridad)
      const absoluteFilePath = path.resolve(filePath);
      const uploadsDir = path.resolve("uploads");

      if (!absoluteFilePath.startsWith(uploadsDir)) {
        return res.status(403).json({
          success: false,
          message: "Operación no permitida",
          error: "FORBIDDEN_PATH",
        });
      }

      // Eliminar el archivo
      fs.unlinkSync(filePath);

      res.status(200).json({
        success: true,
        message: "Archivo eliminado exitosamente",
        filePath: filePath,
      });
    } catch (error) {
      console.error("Error en deleteFile:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al eliminar archivo",
        error: error.message,
      });
    }
  }

  // Obtener información de un archivo
  static async getFileInfo(req, res) {
    try {
      const { filePath } = req.params;

      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: "Ruta del archivo es requerida",
          error: "FILE_PATH_REQUIRED",
        });
      }

      const decodedPath = decodeURIComponent(filePath);

      if (!fs.existsSync(decodedPath)) {
        return res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
          error: "FILE_NOT_FOUND",
        });
      }

      const stats = fs.statSync(decodedPath);
      const fileInfo = {
        success: true,
        data: {
          filePath: decodedPath,
          filename: path.basename(decodedPath),
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          isDirectory: stats.isDirectory(),
        },
      };

      res.status(200).json(fileInfo);
    } catch (error) {
      console.error("Error en getFileInfo:", error);
      res.status(500).json({
        success: false,
        message:
          "Error interno del servidor al obtener información del archivo",
        error: error.message,
      });
    }
  }

  // Descargar un archivo
  static async downloadFile(req, res) {
    try {
      const filePath = req.params[0]; // Captura toda la ruta después de /download/

      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: "Ruta del archivo es requerida",
        });
      }

      const fullPath = path.resolve(filePath);

      // Verificar seguridad - solo archivos dentro de uploads
      const uploadsDir = path.resolve("uploads");
      if (!fullPath.startsWith(uploadsDir)) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado",
        });
      }

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
        });
      }

      // Establecer headers apropiados
      const filename = path.basename(fullPath);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Enviar archivo
      res.sendFile(fullPath);
    } catch (error) {
      console.error("Error en downloadFile:", error);
      res.status(500).json({
        success: false,
        message: "Error al descargar archivo",
        error: error.message,
      });
    }
  }
}

module.exports = UploadController;
