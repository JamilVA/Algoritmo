const { Router } = require('express');

const {getEstudiantes} = require("../controllers/estudiante.controller");

const router = Router();

router.get('/', getEstudiantes)