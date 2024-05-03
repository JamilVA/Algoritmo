const { Router } = require('express');

const {getExamenes, getCursos, getTemas, crearExamen, } = require("../controllers/examenDiario.controller");

const router = Router();

router.post('/', crearExamen);

router.get('/', getExamenes);

router.get('/cursos', getCursos);

router.get('/temas', getTemas);

module.exports = router;
