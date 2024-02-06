const { Router } = require('express');

const {getPago, crearPago} = require("../controllers/pago.controller");

const router = Router();

router.get('/', getPago);

router.post('/', crearPago);

module.exports = router;