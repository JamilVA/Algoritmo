const {
  ExamenDiario,
  EstudianteExamenDiario,
  Tema,
  Curso,
  Grado,
  Pregunta,
  Respuesta,
  PreguntaExamenDiarioEstudiante,
} = require("../config/relations");

const { sequelize } = require("../config/database");

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

    // const preguntas = await Pregunta.findAll({
    //   where: { CodigoTema: examenDiario.CodigoTema },
    // });

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

module.exports = {
  getExamenes,
  getExamen,
  getCursos,
  getTemas,
  crearExamen,
  guardarExamen,
};
