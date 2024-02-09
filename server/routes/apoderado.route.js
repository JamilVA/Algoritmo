const { Router } = require('express');

const {getApoderados} = require("../controllers/apoderado.controller");

const router = Router();

router.get('/', getApoderados);

// router.get('/buscar', buscarEstudiante);

module.exports = router;