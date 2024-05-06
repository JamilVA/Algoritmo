const { Router } = require('express');

const {getExamenes, getCursos, getTemas, crearExamen, getExamen, guardarExamen, } = require("../controllers/examenDiario.controller");

const router = Router();

router.post('/', crearExamen);

router.post('/guardar', guardarExamen);

router.get('/', getExamenes);

router.get('/cursos', getCursos);

router.get('/temas', getTemas);

router.get('/datos', getExamen);

module.exports = router;
