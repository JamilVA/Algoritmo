const { Sequelize, json } = require("sequelize");
const {
  TipoUsuario,
  Usuario,
  Persona,
  Estudiante,
  Grupo,
  Apoderado,
} = require("../config/relations");

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
        model: Grupo,
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

const BUSCAREstudiante = async (req, res) => {
  const { DNI } = req.query;
  const estudiante = await Estudiante.findOne({
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
        model: Grupo,
        attributes: ["Nombre"],
      },
    ],
    where: { DNI: DNI },
  });

  res.json({
    ok: true,
    estudiante,
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
const cargarGrados = async(req, res) => {
  try {
    const grupos = await Grupo.findAll(
      {}
    )
    console.log("cualquiercosa", grupos)
    res.json({
      ok: true,
      grupos,
    });
  } catch (error) {
    console.error(error);
    }

}
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
    const usuario = await Usuario.update({
      Password: req.body.Password,
      Email: req.body.Email,
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
      { CodigoGrupo: req.body.CodigoGrupo },
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

module.exports = {
  getEstudiantes,
  crearEstudiante,
  actualizarEstudiante,
  asignarApoderado,
  asignarGrado,
  cargarGrados,
};
