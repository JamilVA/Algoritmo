const { Router } = require('express');

const { getTemas, crearTema, editarTema, cargarPreguntas, crearPregunta } = require("../controllers/pregunta.controller");

const router = Router();

router.get('/cargarTemas', getTemas);

router.get('/cargarPreguntas', cargarPreguntas);

router.post('/', crearTema);

router.post('/crearPregunta', crearPregunta);

router.put('/', editarTema);

module.exports = router;