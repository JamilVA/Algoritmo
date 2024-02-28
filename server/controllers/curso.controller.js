const {
  Persona,
  Nivel,
  Curso,
  Grado,
  Docente,
} = require("../config/relations");

const getNiveles = async (req, res) => {
  const niveles = await Nivel.findAll({});
  const grados = await Grado.findAll({});
  const docentes = await Docente.findAll({
    include: [
      {
        model: Persona,
      },
    ],
  });

  res.json({
    ok: true,
    niveles,
    grados,
    docentes
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
      {
        model: Docente,
        include: [
          {
            model: Persona,
            attributes: ['Nombres', 'ApellidoPaterno', 'ApellidoMaterno'],
          }
        ]
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
        await Curso.update({ CodigoDocente: req.query.CodigoDocente }, {
            where: { Codigo: req.query.Codigo }
        })
        res.json({ message: 'Docente asignado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al asignar el docente' })
    }
}

module.exports = {
  getNiveles,
  getGrados,
  getCursos,
  crearCurso,
  editarCurso,
  asignarDocente
};
