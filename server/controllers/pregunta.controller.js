const { Curso, Tema, Pregunta, Respuesta } = require("../config/relations");

const getTemas = async (req, res) => {
  try {
    const { CodigoCurso } = req.query;

    const curso = await Curso.findOne({
      where: { Codigo: CodigoCurso },
    });
    const temas = await Tema.findAll({
      where: { CodigoCurso: CodigoCurso },
    });

    res.json({
      ok: true,
      curso,
      temas,
    });
  } catch (error) {
    console.log(error);
  }
};

const cargarPreguntas = async (req, res) => {
  try {
    const { CodigoTema } = req.query;

    const preguntas = Pregunta.findAll({
      include: [
        {
          model: Respuesta,
        },
      ],
      where: { CodigoTema },
    });

    res.json({
      ok: true,
      preguntas,
    });
  } catch (error) {
    console.log(error);
  }
};

const crearTema = async (req, res) => {
  try {
    const tema = await Tema.create({
      Codigo: null,
      Descripcion: req.body.Descripcion,
      CodigoCurso: req.body.CodigoCurso,
    });

    res.json({
      ok: true,
      tema,
    });
  } catch (error) {
    console.error(error);
  }
};

const crearPregunta = async (req, res) => {
  try {
    const { CodigoPregunta } = req.body;
    const { respuestas } = req.body;
    let pregunta;

    if (CodigoPregunta != 0) {
      pregunta = await Pregunta.update(
        {
          Descripcion: req.body.Descripcion,
        },
        {
          where: {
            Codigo: req.body.Codigo,
          },
        }
      );
    } else {
      pregunta = await Pregunta.create({
        Codigo: null,
        Descripcion: req.body.Descripcion,
        CodigoTema: req.body.CodigoTema,
      });

      console.log(respuestas)
    }

    // const actividadE = await ActividadEstudiante.findOne({
    //   where: {
    //     CodigoActividad: req.body.CodigoActividad,
    //     CodigoEstudiante: req.body.CodigoEstudiante,
    //   },
    // });

    // let actividadEstudiante;

    // if (!actividadE) {
    //   actividadEstudiante = await ActividadEstudiante.create(req.body);
    // } else {
    //   actividadE.RutaTarea = req.body.RutaTarea;
    //   actividadEstudiante = actividadE.save();
    // }

    res.json({
      pregunta,
      message: "Pregunta Creada Correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la pregunta" });
  }
};

const editarTema = async (req, res) => {
  try {
    const tema = await Tema.update(
      {
        Descripcion: req.body.Descripcion,
      },
      {
        where: {
          Codigo: req.body.Codigo,
        },
      }
    );

    res.json({
      ok: true,
      tema,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getTemas,
  crearTema,
  editarTema,
  cargarPreguntas,
  crearPregunta
};
