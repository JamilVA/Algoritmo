const {
  Curso,
  Tema,
  Pregunta,
} = require("../config/relations");

const getPreguntas = async (req, res) => {
  const { CodigoCurso } = req.query;

  const curso = await Curso.findOne({
    where: { Codigo: CodigoCurso },
  });
  const temas = await Tema.findAll({
    include: [
      {
        model: Pregunta,
      },
    ],
    where: { CodigoCurso: CodigoCurso },
  });

  res.json({
    ok: true,
    curso,
    temas,
  });
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
      tema
    });
  } catch (error) {
    console.error(error);
  }
};

const editarTema = async (req, res) => {
  try {
    const tema = await Tema.update({
      Descripcion: req.body.Descripcion,
    },{
      where: {
          Codigo: req.body.Codigo,
      }
    });

    res.json({
      ok: true,
      tema
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
    getPreguntas,
    crearTema,
    editarTema
}
