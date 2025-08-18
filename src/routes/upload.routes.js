const express = require("express");
const router = express.Router();
const UploadController = require("../controllers/upload.controller");
const {
  upload,
  handleUploadError,
} = require("../middlewares/upload.middleware");
// Prueba con auth.js primero
const { auth } = require("../middlewares/auth");
router.use(auth);

// POST /api/upload - Subir archivo
router.post(
  "/",
  upload.single("file"),
  handleUploadError,
  UploadController.uploadFile
);

// DELETE /api/upload - Eliminar archivo
router.delete("/", UploadController.deleteFile);

// GET /api/upload/info/:filePath - Obtener información de archivo
router.get("/info/*", UploadController.getFileInfo);

// GET /api/upload/download/* - Descargar archivo
router.get("/download/*", UploadController.downloadFile);

module.exports = router;
