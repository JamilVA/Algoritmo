const { Router } = require('express');

const { getPreguntas, crearTema, editarTema } = require("../controllers/pregunta.controller");

const router = Router();

router.get('/', getPreguntas);

router.post('/', crearTema);

router.put('/', editarTema);

module.exports = router;