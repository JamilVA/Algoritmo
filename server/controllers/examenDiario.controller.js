const {
  ExamenDiario,
  EstudianteExamenDiario,
  Tema,
  Curso,
  Grado,
} = require("../config/relations");

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

const asignarDocente = async (req, res) => {
  try {
    const curso = await Curso.update(
      { CodigoDocente: req.body.CodigoDocente },
      {
        where: { Codigo: req.body.Codigo },
      }
    );
    console.log("Docente", req.body.CodigoDocente);
    console.log("Curso", req.body.Codigo);

    console.log("Curso", curso);

    res.json({ message: "Docente asignado correctamente", curso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asignar el docente" });
  }
};

module.exports = {
  getExamenes,
  getCursos,
  getTemas,
  crearExamen,
  asignarDocente,
};
