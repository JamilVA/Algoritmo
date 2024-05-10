const {
  TipoUsuario,
  Usuario,
  Persona,
  Apoderado,
  Estudiante,
  Grado,
  Nivel,
} = require("../config/relations");

const getApoderados = async (req, res) => {
  const apoderados = await Apoderado.findAll({
    include: [
      {
        model: Persona,
        include: [
          {
            model: Usuario,
          },
        ],
      },
    ],
  });

  res.json({
    ok: true,
    apoderados,
  });
};

const crearApoderado = async (req, res) => {
  try {
    const persona = await Persona.create({
      Codigo: null,
      Nombres: req.body.Nombres,
      ApellidoPaterno: req.body.ApellidoPaterno,
      ApellidoMaterno: req.body.ApellidoMaterno,
      DNI: req.body.DNI,
    });

    const apoderado = await Apoderado.create({
      Codigo: null,
      Telefono: req.body.Telefono,
      Direccion: req.body.Direccion,
      CodigoPersona: persona.Codigo,
    });
    const usuario = await Usuario.create({
      Password: req.body.Password,
      Email: req.body.Email,
      Estado: true,
      CodigoPersona: persona.Codigo,
      CodigoTipoUsuario: 4,
    });
    res.json({
      ok: true,
      persona,
      apoderado,
      usuario,
    });
  } catch (error) {
    console.error(error);
  }
};

const actualizarApoderado = async (req, res) => {
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

    const apoderado = await Apoderado.update(
      {
        CodigoPersona: persona.Codigo,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
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
      apoderado,
      usuario,
    });
  } catch (error) {
    console.error(error);
  }
};

const getHijos = async (req, res) => {
  try {
    const { CodigoApoderado } = req.query;

    const hijos = await Estudiante.findAll({
      attributes: ["Codigo", "CodigoApoderado"],
      include: [
        {
          model: Persona,
          attributes: ["Nombres", "ApellidoPaterno", "ApellidoMaterno"],
        },

        {
          model: Grado,
          attributes: ["Nombre"],
          include: [
            {
              model: Nivel,
              attributes: ["Nombre"],
            },
          ],
        },
      ],
      where: { CodigoApoderado },
    });

    const datos = hijos.map((hijo) => ({
      Codigo: hijo.Codigo,
      Nombres: hijo.Persona?.Nombres,
      Apellidos:
        hijo.Persona?.ApellidoPaterno + " " + hijo.Persona?.ApellidoMaterno,
      Grado: hijo.Grado?.Nombre,
      Nivel: hijo.Grado?.Nivel?.Nombre,
    }));

    res.json({ message: "Hijos cargados correctamente", datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los hijos" });
  }
};

module.exports = {
  getApoderados,
  getHijos,
  crearApoderado,
  actualizarApoderado,
};
