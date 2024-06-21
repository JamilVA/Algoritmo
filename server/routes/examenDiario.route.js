const { Router } = require('express');

const {getExamenes, getCursos, getTemas, crearExamen, getExamen, guardarExamen, getExamenesEstudiante, getDetalleExamen, getReporteCurso, getReporteGrado, getInfoReporte, getDataChart, getDataPromedioGrado, getReporteExamenesEstudiante, getDataChartEstudiante, getDataChartCurso, getReporteExamenes, } = require("../controllers/examenDiario.controller");

const router = Router();

router.post('/', crearExamen);

router.post('/guardar', guardarExamen);

router.get('/', getExamenes);

router.get('/cursos', getCursos);

router.get('/temas', getTemas);

router.get('/datos', getExamen);

router.get('/examenesEstudiante', getExamenesEstudiante);

router.get('/reporteExamenesEstudiante', getReporteExamenesEstudiante);

router.get('/reporteExamenes', getReporteExamenes);

router.get('/detalleExamen', getDetalleExamen);

router.get('/infoReporte', getInfoReporte);

router.get('/reporteGrado', getReporteGrado);

router.get('/reporteCurso', getReporteCurso);

router.get('/dataChart', getDataChart);

router.get('/dataChartCurso', getDataChartCurso);

router.get('/dataChartEstudiante', getDataChartEstudiante);

router.get('/dataPromedioGrado', getDataPromedioGrado);

router.get('/dataPromedioEstudiante', );

module.exports = router;
