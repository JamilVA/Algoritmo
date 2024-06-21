const {
  TipoUsuario,
  Usuario,
  Persona,
  Docente,
  Grado,
  Curso,
  Nivel,
} = require("../config/relations");

const { sequelize } = require("../config/database");

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
    let docente = null;
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

      docente = await Docente.create(
        {
          Codigo: null,
          FechaNacimiento: req.body.FechaNacimiento,
          Telefono: req.body.Telefono,
          Email: req.body.Email,
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
          CodigoTipoUsuario: 2,
        },
        {
          transaction: t,
        }
      );
    });
    res.json({ message: "Docente guardado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el Docente" });
  }
};

const actualizarDocente = async (req, res) => {
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
    let docente = null;
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

      docente = await Docente.update(
        {
          FechaNacimiento: req.body.FechaNacimiento,
          Telefono: req.body.Telefono,
          Email: req.body.Email,
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
        },
        {
          where: {
            CodigoPersona: req.body.CodigoPersona,
          },
          transaction: t,
        }
      );
    });
    res.json({ message: "Docente actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el Docente" });
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
    res.json({
      ok: true,
      grupos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar Grados" });
  }
};

const cursosDocente = async (req, res) => {
  try {
    const { CodigoDocente } = req.query;
    const datosCursos = await Curso.findAll({
      include: [
        {
          model: Grado,
          attributes: ['Nombre'],
          include: [
            {
              model: Nivel,
              attributes: ['Nombre']
            }
          ]
        }
      ],
      where: {CodigoDocente}
    })

    const cursos = datosCursos.map((curso) => ({Codigo: curso.Codigo, Curso: curso.Nombre, Grado: curso.Grado.Nombre, Nivel: curso.Grado.Nivel.Nombre}))

    const grado = await Grado.findOne({
      where: {CodigoDocente}
    })

    res.json({
      message: "Datos cargados correctamente",
      cursos,
      grado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar cursos del Docente" });
  }
};

module.exports = {
  getDocentes,
  crearDocente,
  actualizarDocente,
  asignarGrado,
  cargarGrados,
  cursosDocente
};
