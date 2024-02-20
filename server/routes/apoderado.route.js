const { Router } = require('express');

const {getApoderados, crearApoderado, actualizarApoderado} = require("../controllers/apoderado.controller");

const router = Router();

router.get('/', getApoderados);

router.post('/', crearApoderado);

router.put('/', actualizarApoderado);

module.exports = router;