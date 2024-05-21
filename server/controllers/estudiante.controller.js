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
    let _persona = await Persona.findOne({
      where: { DNI: req.body.DNI },
    });
    if (_persona)
      return res.status(403).json({ error: "Ese DNI ya está registrado" });

    let _usuario = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (_usuario) {
      return res.status(403).json({ error: "Ese email ya está registrado" });
    }

    let persona = null;
    let estudiante = null;
    let usuario = null;

    await sequelize.transaction(async (t) => {
      persona = await Persona.create(
        {
          Codigo: null,
          Nombres: req.body.Nombres,
          ApellidoPaterno: req.body.ApellidoPaterno,
          ApellidoMaterno: req.body.ApellidoMaterno,
          DNI: req.body.DNI,
        },
        {
          transaction: t,
        }
      );

      estudiante = await Estudiante.create(
        {
          Codigo: null,
          FechaNacimiento: req.body.FechaNacimiento,
          CodigoPersona: persona.Codigo,
        },
        {
          transaction: t,
        }
      );
      usuario = await Usuario.create(
        {
          Password: req.body.Password,
          Email: req.body.Email,
          Estado: true,
          CodigoPersona: persona.Codigo,
          CodigoTipoUsuario: 3,
        },
        {
          transaction: t,
        }
      );
    });
    res.json({ message: "Estudiante guardado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el Estudiante" });
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
  console.log('REQ: ', req.body)
  try {
    let _persona = await Persona.findOne({ where: { DNI: req.body.DNI } });
    if (_persona && _persona.Codigo != req.body.CodigoPersona) {
      return res.status(403).json({ error: "Ese DNI ya está registrado" });
    }

    let _usuario = await Usuario.findOne({ where: { Email: req.body.Email } });
    if (_usuario && _usuario.CodigoPersona != req.body.CodigoPersona) {
      return res.status(403).json({ error: "Ese email ya está registrado" });
    }

    let persona = null;
    let estudiante = null;
    let usuario = null;

    await sequelize.transaction(async (t) => {
      persona = await Persona.update(
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
          transaction: t,
        }
      );

      estudiante = await Estudiante.update(
        {
          FechaNacimiento: req.body.FechaNacimiento,
          CodigoPersona: persona.Codigo,
        },
        {
          where: {
            CodigoPersona: req.body.CodigoPersona,
          },
          transaction: t,
        }
      );
      usuario = await Usuario.update(
        {
          Password: req.body.Password,
          Email: req.body.Email,
          Estado: true,
        },
        {
          where: {
            CodigoPersona: req.body.CodigoPersona,
          },
          transaction: t,
        }
      );
    });
    res.json({ message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el Estudiante" });
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
