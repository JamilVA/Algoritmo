const {
  TipoUsuario,
  Usuario,
  Persona,
  Docente,
  Grado,
} = require("../config/relations");

const getDocentes = async (req, res) => {
  const docentes = await Docente.findAll({
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
    ],
  });

  res.json({
    ok: true,
    docentes,
  });
};

const crearDocente = async (req, res) => {
  try {
    const persona = await Persona.create({
      Codigo: null,
      Nombres: req.body.Nombres,
      ApellidoPaterno: req.body.ApellidoPaterno,
      ApellidoMaterno: req.body.ApellidoMaterno,
      DNI: req.body.DNI,
    });

    const docente = await Docente.create({
      Codigo: null,
      FechaNacimiento: req.body.FechaNacimiento,
      Telefono: req.body.Telefono,
      Email: req.body.Email,
      CodigoPersona: persona.Codigo,
    });
    const usuario = await Usuario.create({
      Password: req.body.Password,
      Email: req.body.Email,
      Estado: true,
      CodigoPersona: persona.Codigo,
      CodigoTipoUsuario: 2,
    });

    res.json({
      ok: true,
      persona,
      docente,
      usuario,
    });
  } catch (error) {
    console.error(error);
  }
};

const actualizarDocente = async (req, res) => {
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

    const docente = await Docente.update(
      {
        FechaNacimiento: req.body.FechaNacimiento,
        Telefono: req.body.Telefono,
        Email: req.body.Email,
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
      docente,
      usuario,
    });
  } catch (error) {
    console.error(error);
  }
};

const asignarGrado = async (req, res) => {
  try {
    const grado = await Grado.update(
      { CodigoDocente: null },
      {
        where: { CodigoDocente: req.body.CodigoDocente },
      }
    );

    const docente = await Grado.update(
      { CodigoDocente: req.body.CodigoDocente },
      {
        where: { Codigo: req.body.CodigoGrupo },
      }
    );

    res.json({ message: "Grado asignado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asignar tutor al grado" });
  }
};

const cargarGrados = async (req, res) => {
  try {
    const grupos = await Grado.findAll({});
    console.log("cualquiercosa", grupos);
    res.json({
      ok: true,
      grupos,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getDocentes,
  crearDocente,
  actualizarDocente,
  asignarGrado,
  cargarGrados,
};
