const express = require("express");
const EquipoLaboratorioSimpleController = require("../controllers/equipoLaboratorioSimple.controller");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();
router.use(authenticateToken);

router.post("/simple", EquipoLaboratorioSimpleController.createEquipoSimple);

module.exports = router;
