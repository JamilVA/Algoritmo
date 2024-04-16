const { Router } = require('express');

const {getDocentes, actualizarDocente, crearDocente, asignarGrado, cargarGrados} = require("../controllers/docente.controller");

const router = Router();

router.get('/', getDocentes);

router.get('/cargarGrados', cargarGrados);

router.post('/', crearDocente);

router.put('/asignarGrado', asignarGrado);

router.put('/', actualizarDocente);


// router.get('/buscar', buscarEstudiante);

module.exports = router;