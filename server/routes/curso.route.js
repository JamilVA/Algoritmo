const { Router } = require('express');

const {getNiveles, getCursos} = require("../controllers/curso.controller");

const router = Router();

router.get('/niveles', getNiveles);

router.get('/', getCursos);

module.exports = router;
