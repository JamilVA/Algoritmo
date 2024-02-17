const {
  TipoUsuario,
  Usuario,
  Persona,
  Estudiante,
  Grupo,
  Nivel,
  Curso,
  Grado,
} = require("../config/relations");

const getNiveles = async (req, res) => {
  const niveles = await Nivel.findAll({});

  res.json({
    ok: true,
    niveles,
  });
};

const getCursos = async (req, res) => {
  const { CodigoNivel } = req.query;

  const cursos = await Curso.findAll({
    include: [
      {
        model: Grado,
        where: { CodigoNivel: CodigoNivel },
        required: true,
      },
    ],
  });

  res.json({
    ok: true,
    cursos,
  });
};

const crearEstudiante = async (req, res) => {
  try {
    const persona = await Persona.create({
      Codigo: null,
      Nombres: req.body.Nombres,
      ApellidoPaterno: req.body.ApellidoPaterno,
      ApellidoMaterno: req.body.ApellidoMaterno,
      DNI: req.body.DNI,
    });

    const estudiante = await Estudiante.create({
      Codigo: null,
      FechaNacimiento: req.body.FechaNacimiento,
      CodigoPersona: persona.Codigo,
    });

    const usuario = await Usuario.create({
      Codigo: null,
      Estado: true,
      Email: req.body.Email,
      Password: req.body.Password,
      CodigoPersona: persona.Codigo,
      CodigoTipoUsuario: 3,
    });

    res.json({
      ok: true,
      persona,
      estudiante,
      usuario,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getNiveles,
  getCursos,
  crearEstudiante,
};
