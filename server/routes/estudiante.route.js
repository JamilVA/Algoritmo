const { Router } = require('express');

const {getEstudiantes, crearEstudiante, actualizarEstudiante, asignarApoderado, asignarGrado, cargarGrados} = require("../controllers/estudiante.controller");

const router = Router();

router.get('/', getEstudiantes);

router.get('/cargarGrados', cargarGrados);

router.post('/', crearEstudiante);

router.put('/', actualizarEstudiante);

router.put('/asignarApoderado', asignarApoderado);

router.put('/asignarGrado', asignarGrado);

// router.get('/buscar', buscarEstudiante);

module.exports = router;