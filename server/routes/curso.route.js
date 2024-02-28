const { Router } = require('express');

const {getNiveles, getCursos, crearCurso, editarCurso, asignarDocente, getGrados} = require("../controllers/curso.controller");

const router = Router();

router.get('/niveles', getNiveles);

router.get('/grados', getGrados);

router.get('/', getCursos);

router.post('/', crearCurso);

router.put('/', editarCurso);

router.put('/asignarDocente', asignarDocente);

module.exports = router;
