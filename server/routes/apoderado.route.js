const { Router } = require('express');

const {getApoderados, crearApoderado, actualizarApoderado, getHijos} = require("../controllers/apoderado.controller");

const router = Router();

router.get('/', getApoderados);

router.get('/hijos', getHijos);

router.post('/', crearApoderado);

router.put('/', actualizarApoderado);

module.exports = router;