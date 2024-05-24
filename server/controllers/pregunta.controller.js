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

const modificarImagen = async (req, res) => {
  try {
    const { pregunta } = req.body;
    console.log('Pregunta para imagen' ,pregunta)
    await Pregunta.update({RutaImagen: pregunta.RutaImagen},{where: {Codigo: pregunta.Codigo}})
    res.json({
      message: "Pregunta modificada Correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo modificar la ruta de la Imagen" });
  }
}

const crearPregunta = async (req, res) => {
  try {
    const { pregunta } = req.body;
    const { respuestas } = req.body;
    let preguntaNew;

    if (pregunta.Codigo != 0) {
      preguntaNew = await Pregunta.update(
        {
          Descripcion: pregunta.Descripcion,
          RutaImagen: pregunta.RutaImagen,
        },
        {
          where: {
            Codigo: pregunta.Codigo,
          },
        }
      );

      const respuestas = await Promise.all(
        respuestas.map(async (respuesta) => {
          await Respuesta.update({
            respuesta,
          },{
            where: {Codigo: respuesta.Codigo}
          });

          // return {
          //   Codigo: pregunta.Codigo,
          //   Descripcion: pregunta.Descripcion,
          //   RutaImagen: pregunta.RutaImagen ?? "",
          //   Respuestas: pregunta.Respuesta,
          //   RespuestaSeleccionada: buscar.CodigoRespuesta ?? null,
          // };
        })
      );
      res.json({
        message: "Pregunta modificada Correctamente",
      });
    } else {
      preguntaNew = await Pregunta.create({
        Codigo: null,
        Descripcion: pregunta.Descripcion,
        CodigoTema: req.body.CodigoTema,
        RutaImagen: pregunta.RutaImagen,
      });

      const listaRespuestas = respuestas.map((respuesta) => ({
        ...respuesta,
        CodigoPregunta: preguntaNew.Codigo,
      }));

      await sequelize.transaction(async (t) => {
        await Respuesta.bulkCreate(listaRespuestas, {
          transaction: t,
        });
      });

      res.json({
        message: "Pregunta Creada Correctamente",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la petición" });
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
  modificarImagen
};
