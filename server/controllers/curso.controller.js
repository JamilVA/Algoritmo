const {
  Usuario,
  Persona,
  Estudiante,
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

const getGrados = async (req, res) => {
  const grados = await Grado.findAll({});

  res.json({
    ok: true,
    grados,
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

const crearCurso = async (req, res) => {
  try {
    const curso = await Curso.create({
      Codigo: null,
      Nombre: req.body.Nombre,
      CodigoGrado: req.body.CodigoGrado,
    });

    res.json({
      ok: true,
      curso
    });
  } catch (error) {
    console.error(error);
  }
};

const editarCurso = async (req, res) => {
    try {
      const curso = await Curso.update({
        Nombre: req.body.Nombre,
        CodigoGrado: req.body.CodigoGrado,
      },{
        where: {
            Codigo: req.body.Codigo,
        }
      });
  
      res.json({
        ok: true,
        curso
      });
    } catch (error) {
      console.error(error);
    }
  };

const asignarDocente = async (req, res) => {
    try {
      const curso = await Curso.update({
        CodigoDocente: req.body.CodigoDocente,
      },{
        where: {
            Codigo: req.body.Codigo,
        }
      });
  
      res.json({
        ok: true,
        curso
      });
    } catch (error) {
      console.error(error);
    }
  };

module.exports = {
  getNiveles,
  getGrados,
  getCursos,
  crearCurso,
  editarCurso,
  asignarDocente
};
