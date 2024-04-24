const {
  Usuario,
  Persona,
  Estudiante,
  Apoderado,
  Grado,
  CursoEstudiante,
  Curso,
} = require("../config/relations");

const { sequelize } = require("../config/database");

const getEstudiantes = async (req, res) => {
  const estudiantes = await Estudiante.findAll({
    include: [
      {
        model: Persona,
        include: [
          {
            model: Usuario,
          },
        ],
      },
      {
        model: Grado,
        attributes: ["Nombre"],
      },
      {
        model: Apoderado,
        include: [
          {
            model: Persona,
            attributes: ["Nombres", "ApellidoPaterno", "ApellidoMaterno"],
          },
        ],
      },
    ],
  });

  res.json({
    ok: true,
    estudiantes,
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
      Password: req.body.Password,
      Email: req.body.Email,
      Estado: true,
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
const cargarGrados = async (req, res) => {
  try {
    const grados = await Grado.findAll({});
    console.log("cualquiercosa", grados);
    res.json({
      ok: true,
      grados,
    });
  } catch (error) {
    console.error(error);
  }
};
const actualizarEstudiante = async (req, res) => {
  try {
    const persona = await Persona.update(
      {
        Nombres: req.body.Nombres,
        ApellidoPaterno: req.body.ApellidoPaterno,
        ApellidoMaterno: req.body.ApellidoMaterno,
        DNI: req.body.DNI,
      },
      {
        where: {
          Codigo: req.body.CodigoPersona,
        },
      }
    );

    const estudiante = await Estudiante.update(
      {
        FechaNacimiento: req.body.FechaNacimiento,
        CodigoPersona: persona.Codigo,
      },
      {
        where: {
          Codigo: req.body.Codigo,
        },
      }
    );
    const usuario = await Usuario.update(
      {
        Password: req.body.Password,
        Email: req.body.Email,
      },
      {
        where: {
          CodigoPersona: req.body.CodigoPersona,
        },
      }
    );

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

const asignarApoderado = async (req, res) => {
  try {
    const estudiante = await Estudiante.update(
      { CodigoApoderado: req.body.CodigoApoderado },
      {
        where: { Codigo: req.body.Codigo },
      }
    );

    res.json({ message: "Apoderado asignado correctamente", estudiante });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asignar el apoderado" });
  }
};
const asignarGrado = async (req, res) => {
  try {
    const estudiante = await Estudiante.update(
      { CodigoGrado: req.body.CodigoGrado },
      {
        where: { Codigo: req.body.Codigo },
      }
    );

    res.json({ message: "Grado asignado correctamente", estudiante });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asignar grado el apoderado" });
  }
};

const matricularEstudiante = async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      where: {
        CodigoGrado: req.body.CodigoGrado,
      },
    });

    const matriculas = cursos.map((curso) => ({
      CodigoEstudiante: req.body.Codigo,
      CodigoCurso: curso.Codigo,
      Nota1: 0,
    }));

    await sequelize.transaction(async (t) => {
      await CursoEstudiante.bulkCreate(matriculas, {
        ignoreDuplicates: true,
        transaction: t,
      });
    });

    res.json({ message: "Matrícula generada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al genera las matrícula" });
  }
};

module.exports = {
  getEstudiantes,
  crearEstudiante,
  actualizarEstudiante,
  asignarApoderado,
  asignarGrado,
  matricularEstudiante,
  cargarGrados,
};
