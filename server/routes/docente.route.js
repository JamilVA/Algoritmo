const { Router } = require('express');

const {getDocentes} = require("../controllers/docente.controller");

const router = Router();

router.get('/', getDocentes);


// router.get('/buscar', buscarEstudiante);

module.exports = router;