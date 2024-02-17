const { Router } = require('express');

const {getDocentes, actualizarDocente, crearDocente} = require("../controllers/docente.controller");

const router = Router();

router.get('/', getDocentes);

router.post('/', crearDocente);

router.put('/', actualizarDocente);


// router.get('/buscar', buscarEstudiante);

module.exports = router;