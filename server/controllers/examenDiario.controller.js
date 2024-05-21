const {
  ExamenDiario,
  EstudianteExamenDiario,
  Tema,
  Curso,
  Grado,
  Pregunta,
  Respuesta,
  PreguntaExamenDiarioEstudiante,
  Estudiante,
  Nivel,
} = require("../config/relations");

const { sequelize } = require("../config/database");
const estudianteExamenDiario = require("../models/estudianteExamenDiario.model");
const examenDiario = require("../models/examenDiario.model");

const getExamenes = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": CodigoGrado },
    });
    res.json({ message: "Examenes cargados correctamente", examenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getExamenesEstudiante = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;

    const estudiante = await Estudiante.findOne({
      where: { Codigo: CodigoEstudiante },
    });

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
        {
          model: EstudianteExamenDiario,
          required: false,
          where: { CodigoEstudiante },
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": estudiante.CodigoGrado },
    });
    res.json({ message: "Examenes cargados correctamente", examenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getReporteExamenesEstudiante = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;

    const listaExamenes = await EstudianteExamenDiario.findAll({
      include: [
        {
          model: ExamenDiario,
          attributes: ["Fecha"],
          include: [
            {
              model: Tema,
              attributes: ["Descripcion"],
              include: [
                {
                  model: Curso,
                  attributes: ["Nombre"],
                },
              ],
            },
          ],
        },
      ],
      where: { CodigoEstudiante: CodigoEstudiante },
    });

    const examenes = listaExamenes.map((examen) => ({
      Nota: examen.Nota,
      Correctas: examen.Correctas,
      Incorrectas: examen.Incorrectas,
      EnBlanco: examen.EnBlanco,
      Fecha: examen.examenDiario.Fecha,
      Tema: examen.examenDiario.Tema.Descripcion,
      Curso: examen.examenDiario.Tema.Curso.Nombre,
    }));

    res.json({ message: "Examenes cargados correctamente", examenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getCursos = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const cursos = await Curso.findAll({
      where: { CodigoGrado: CodigoGrado },
    });
    res.json({ message: "Cursos cargados correctamente", cursos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los cursos" });
  }
};

const getExamen = async (req, res) => {
  try {
    const { CodigoExamen } = req.query;

    const examen = await ExamenDiario.findOne({
      where: { Codigo: CodigoExamen },
    });

    const preguntas = await Pregunta.findAll({
      include: [
        {
          model: Respuesta,
          order: sequelize.literal("RAND()"),
        },
      ],
      where: { CodigoTema: examen.CodigoTema },
      order: sequelize.literal("RAND()"), // Orden aleatorio
      limit: 10, // Limitar a 10 registros
    });

    res.json({ message: "Examen cargado correctamente", examen, preguntas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar el examen" });
  }
};

const getTemas = async (req, res) => {
  try {
    const { CodigoCurso } = req.query;

    const temas = await Tema.findAll({
      where: { CodigoCurso },
    });
    res.json({ message: "Temas cargados correctamente", temas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los temas" });
  }
};

const crearExamen = async (req, res) => {
  try {
    const examen = req.body.examen;

    if (examen.Codigo == 0) {
      await ExamenDiario.create(examen);
      res.json({ message: "Examen creado correctamente" });
    } else {
      await ExamenDiario.update(examen, {
        where: { Codigo: examen.Codigo },
      });
      res.json({ message: "Examen actualizado correctamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el examen" });
  }
};

const guardarExamen = async (req, res) => {
  try {
    const { estudianteExamenDiario, preguntaEstudianteExamenDiario } = req.body;

    console.log(
      "Examen GGG",
      estudianteExamenDiario,
      preguntaEstudianteExamenDiario
    );

    await sequelize.transaction(async (t) => {
      await EstudianteExamenDiario.create(estudianteExamenDiario, {
        transaction: t,
      });

      await PreguntaExamenDiarioEstudiante.bulkCreate(
        preguntaEstudianteExamenDiario,
        {
          transaction: t,
        }
      );
    });

    res.json({ message: "Examen guardado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el examen" });
  }
};

const getDetalleExamen = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;

    const estudiante = await Estudiante.findOne({
      where: { Codigo: CodigoEstudiante },
    });

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": estudiante.CodigoGrado },
    });
    res.json({ message: "Examenes cargados correctamente", examenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getInfoReporte = async (req, res) => {
  const niveles = await Nivel.findAll({});
  const grados = await Grado.findAll({});
  const examenes = await ExamenDiario.count({});
  const estudiantes = await Estudiante.count({});

  res.json({
    ok: true,
    niveles,
    grados,
    examenes,
    estudiantes,
  });
};

const getReporteGrado = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
        {
          model: EstudianteExamenDiario,
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": CodigoGrado },
    });

    const datos = examenes.map((examen) => ({
      Codigo: examen.Codigo,
      Curso: examen.Tema.Curso.Nombre,
      Tema: examen.Tema.Descripcion,
      Resueltos: examen?.estudianteExamenDiarios.length ?? 0,
    }));

    res.json({ message: "Examenes cargados correctamente", datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getReporteCurso = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;

    const datos = await ExamenDiario.findOne({});

    res.json({ message: "Examenes cargados correctamente", datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const obtenerChartData = async () => {};

const getDataChart = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const cursos = await Curso.findAll({
      where: { CodigoGrado },
    });

    const datos = await EstudianteExamenDiario.findAll({
      include: [
        {
          model: Estudiante,
          attributes: ["Codigo", 'CodigoGrado'],
        },
        {
          model: ExamenDiario,
          attributes: ["Fecha"],
          include:[
            {
              model: Tema,
              attributes: ['Codigo'],
              include:[
                {
                  model: Curso,
                  attributes: ['Codigo']
                }
              ]
            }
          ]
        },
      ],
      attributes: ["Nota"],
      where: { "$Estudiante.CodigoGrado$": CodigoGrado },
    });

    const labels = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const colors = [
      "#f97316",
      "#06b6d4",
      "#ec4899",
      "#22c55e",
      "#a855f7",
      "#eab308",
      '#3b82f6',
      '#ff3d32',
      '#64748b',
      '#6366f1',
      '#14b8a6',
      '#6366f1',
      '#6b7280'
    ];

    const colorsText = ["orange", "cyan", "pink", "green", "purple", "yellow", 'blue', 'red', 'bluegray', 'indigo', 'teal', 'primary', 'gray'];

    let datosCurso = [];
    let datosFinales = [];
    let datosPromedios = [];

    cursos.forEach((f, index) => {
      const curso = datos
        .filter((examen) => examen.examenDiario.Tema.Curso.Codigo == f.Codigo)
        .map((dato) => ({ Nota: dato.Nota, Fecha: dato.examenDiario.Fecha }));
      datosCurso.push([]);

      for (let j = 0; j < 12; j++) {
        const cursomes = curso
          .filter((examen) => new Date(examen.Fecha).getMonth() == j)
          .map((dato) => dato.Nota);
        if (cursomes.length > 0) {
          const suma = cursomes.reduce((total, numero) => total + numero, 0);
          const promedio = suma / cursomes?.length;
          datosCurso[index].push(promedio);
        } else datosCurso[index].push(0);
      }
    });

    const promedios = [];

    datosCurso.forEach((curso) => {
      const cursoLimpio = curso.filter((nota) => nota != 0);
      if (cursoLimpio.length > 0) {
        const suma = cursoLimpio.reduce((total, numero) => total + numero, 0);
        const promedio = suma / cursoLimpio?.length;
        promedios.push(promedio);
      } else promedios.push(0);
    });

    cursos.forEach((curso, index) => {
      const y = {
        curso: curso.Nombre,
        promedio: promedios[index],
        porcentaje: (promedios[index] / 20) * 100,
        color: colorsText[index],
      };
      datosPromedios.push(y);

      const x = {
        label: curso.Nombre,
        data: datosCurso[index],
        fill: false,
        backgroundColor: colors[index],
        borderColor: colors[index],
        tension: 0.4,
      };
      datosFinales.push(x);
    });

    res.json({
      message: "Datos cargados correctamente",
      labels,
      datosPromedios,
      datosFinales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los datos" });
  }
};

const getDataChartEstudiante = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;

    const datos = await EstudianteExamenDiario.findAll({
      include: [
        {
          model: ExamenDiario,
          attributes: ["Fecha"],
        },
      ],
      attributes: ["Nota"],
      where: { CodigoEstudiante },
    });

    const labels = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const colors = [
      "#f97316",
      "#06b6d4",
      "#ec4899",
      "#22c55e",
      "#a855f7",
      "#eab308",
      '#3b82f6',
      '#ff3d32',
      '#64748b',
      '#6366f1',
      '#14b8a6',
      '#6366f1',
      '#6b7280'
    ];

    const colorsText = ["orange", "cyan", "pink", "green", "purple", "yellow", 'blue', 'red', 'bluegray', 'indigo', 'teal', 'primary', 'gray'];


    const datosLimpios = datos.map((dato) => ({
      Nota: dato.Nota,
      Fecha: dato.examenDiario.Fecha,
    }));

    let datosEstudiante = [];
    let datosFinales = [];

    for (let j = 0; j < 12; j++) {
      const mes = datosLimpios
        .filter((examen) => new Date(examen.Fecha).getMonth() == j)
        .map((dato) => dato.Nota);
      if (mes.length > 0) {
        const suma = mes.reduce((total, numero) => total + numero, 0);
        const promedio = suma / mes?.length;
        datosEstudiante.push(promedio);
      } else datosEstudiante.push(0);
    }

    const x = {
      label: 'Notas del Estudiante',
      data: datosEstudiante,
      fill: false,
      backgroundColor: colors[0],
      borderColor: colors[0],
      tension: 0.4,
    };
    datosFinales.push(x);

    res.json({
      message: "Datos cargados correctamente",
      labels,
      datosFinales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los datos" });
  }
};

const getDataPromedioGrado = async (req, res) => {
  try {
    const { CodigoNivel } = req.query;

    const datos = await ExamenDiario.findOne({});

    res.json({ message: "Examenes cargados correctamente", datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

module.exports = {
  getExamenes,
  getExamenesEstudiante,
  getReporteExamenesEstudiante,
  getInfoReporte,
  getReporteGrado,
  getReporteCurso,
  getDataChart,
  getDataChartEstudiante,
  getDataPromedioGrado,
  getDetalleExamen,
  getExamen,
  getCursos,
  getTemas,
  crearExamen,
  guardarExamen,
};
