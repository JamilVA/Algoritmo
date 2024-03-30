const { Router } = require('express');

const {getEstudiantes, crearEstudiante, actualizarEstudiante, asignarApoderado} = require("../controllers/estudiante.controller");

const router = Router();

router.get('/', getEstudiantes);

router.post('/', crearEstudiante);

router.put('/', actualizarEstudiante);

router.put('/asignarApoderado', asignarApoderado);

// router.get('/buscar', buscarEstudiante);

module.exports = router;