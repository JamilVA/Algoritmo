const { Router } = require('express');

const { getTemas, crearTema, editarTema, cargarPreguntas, crearPregunta, modificarImagen, eliminarPregunta } = require("../controllers/pregunta.controller");

const router = Router();

router.get('/cargarTemas', getTemas);

router.get('/cargarPreguntas', cargarPreguntas);

router.post('/', crearTema);

router.post('/crearPregunta', crearPregunta);

router.post('/eliminarPregunta', eliminarPregunta);

router.put('/', editarTema);

router.put('/imagenPregunta', modificarImagen);

module.exports = router;