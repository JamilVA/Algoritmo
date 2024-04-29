const { Curso, Tema, Pregunta, Respuesta } = require("../config/relations");

const { sequelize } = require("../config/database");

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

    const preguntas = await Pregunta.findAll({
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

    console.log(preguntas);
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
    const { pregunta } = req.body;
    const { respuestas } = req.body;
    let preguntaNew;

    if (pregunta.Codigo != 0) {
      preguntaNew = await Pregunta.update(
        {
          Descripcion: pregunta.Descripcion,
          CodigoTema: pregunta.CodigoTema,
        },
        {
          where: {
            Codigo: pregunta.Codigo,
          },
        }
      );
    } else {
      preguntaNew = await Pregunta.create({
        Codigo: null,
        Descripcion: pregunta.Descripcion,
        CodigoTema: req.body.CodigoTema,
      });
    }
    const listaRespuestas = respuestas.map((respuesta) => ({
      ...respuesta,
      CodigoPregunta: preguntaNew.Codigo,
    }));

    await sequelize.transaction(async (t) => {
      await Respuesta.bulkCreate(listaRespuestas, {
        transaction: t,
      });
    });
    console.log("Resp: ", listaRespuestas);
    res.json({
      preguntaNew,
      listaRespuestas,
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
  crearPregunta,
};
