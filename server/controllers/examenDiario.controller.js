const {
  ExamenDiario,
  EstudianteExamenDiario,
  Tema,
  Curso,
  Grado,
  Pregunta,
  Respuesta,
  PreguntaExamenDiarioEstudiante,
  Estudiante,
  Nivel,
  Persona,
} = require("../config/relations");

const { sequelize } = require("../config/database");

const multer = require("multer");
const { join } = require("path");
const fs = require("fs");

const getExamenes = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    console.log('Codigo', CodigoGrado)

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": CodigoGrado },
    });
    res.json({ message: "Examenes cargados correctamente", examenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getExamenesEstudiante = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;

    const fechaActual = new Date();
    const haceSieteDias = new Date(fechaActual);
    haceSieteDias.setDate(fechaActual.getDate() - 7);

    const estudiante = await Estudiante.findOne({
      where: { Codigo: CodigoEstudiante },
    });

    const listaExamenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
        {
          model: EstudianteExamenDiario,
          required: false,
          where: { CodigoEstudiante },
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": estudiante.CodigoGrado },
    });
    const examenes = listaExamenes.filter(
      (examen) => new Date(examen.Fecha) >= haceSieteDias
    );

    res.json({ message: "Examenes cargados correctamente", examenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getReporteExamenesEstudiante = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;
    const { DNI } = req.query;

    let usuario;
    let listaExamenes;

    if (CodigoEstudiante) {
      usuario = await Estudiante.findOne({
        include: [
          {
            model: Grado,
            attributes: ["Nombre"],
          },
          {
            model: Persona,
            attributes: ["Nombres", "ApellidoPaterno", "ApellidoMaterno"],
          },
        ],
        where: { Codigo: CodigoEstudiante },
      });

      listaExamenes = await EstudianteExamenDiario.findAll({
        include: [
          {
            model: ExamenDiario,
            attributes: ["Fecha", "HoraFin"],
            include: [
              {
                model: Tema,
                attributes: ["Descripcion"],
                include: [
                  {
                    model: Curso,
                    attributes: ["Nombre"],
                  },
                ],
              },
            ],
          },
        ],
        where: { CodigoEstudiante: CodigoEstudiante },
      });
    }

    if (DNI) {
      usuario = await Estudiante.findOne({
        include: [
          {
            model: Grado,
            attributes: ["Nombre"],
          },
          {
            model: Persona,
            attributes: [
              "Nombres",
              "ApellidoPaterno",
              "ApellidoMaterno",
              "DNI",
            ],
          },
        ],
        where: { "$Persona.DNI$": DNI },
      });

      if (!usuario) {
        return res.status(403).json({
          error: "No se ha encontrado ningun estudiante con DNI: " + DNI,
        });
      }

      listaExamenes = await EstudianteExamenDiario.findAll({
        include: [
          {
            model: ExamenDiario,
            attributes: ["Fecha"],
            include: [
              {
                model: Tema,
                attributes: ["Descripcion"],
                include: [
                  {
                    model: Curso,
                    attributes: ["Nombre"],
                  },
                ],
              },
            ],
          },
          {
            model: Estudiante,
            attributes: ["Codigo"],
            include: [
              {
                model: Persona,
                attributes: ["DNI"],
              },
            ],
          },
        ],
        where: { "$Estudiante.Persona.DNI$": DNI },
      });
    }

    const estudiante = {
      Codigo: usuario.Codigo,
      Nombres:
        usuario?.Persona.Nombres +
        " " +
        usuario?.Persona.ApellidoPaterno +
        " " +
        usuario?.Persona.ApellidoMaterno,
      Grado: usuario?.Grado.Nombre,
    };

    const examenes = listaExamenes.map((examen) => ({
      Codigo: examen.CodigoExamenDiario,
      Nota: examen.Nota,
      Correctas: examen.Correctas,
      Incorrectas: examen.Incorrectas,
      EnBlanco: examen.EnBlanco,
      Fecha: examen.ExamenDiario.Fecha,
      HoraFin: examen.ExamenDiario.HoraFin,
      Tema: examen.ExamenDiario.Tema.Descripcion,
      Curso: examen.ExamenDiario.Tema.Curso.Nombre,
    }));

    res.json({
      message: "Examenes cargados correctamente",
      examenes,
      estudiante,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getReporteExamenes = async (req, res) => {
  try {
    const { CodigoExamen } = req.query;

    let listaExamenes;

    listaExamenes = await EstudianteExamenDiario.findAll({
      include: [
        {
          model: Estudiante,
          include: [
            {
              model: Persona,
              attributes: ["Nombres", "ApellidoPaterno", "ApellidoMaterno"],
            },
          ],
        },
      ],
      where: { CodigoExamenDiario: CodigoExamen },
    });

    const examenes = listaExamenes.map((examen) => ({
      CodigoExamen: examen.CodigoExamenDiario,
      CodigoEstudiante: examen.Estudiante.Codigo,
      Estudiante:
        examen.Estudiante.Persona.Nombres +
        " " +
        examen.Estudiante.Persona.ApellidoPaterno +
        " " +
        examen.Estudiante.Persona.ApellidoMaterno,
      Nota: examen.Nota,
      Correctas: examen.Correctas,
      Incorrectas: examen.Incorrectas,
      EnBlanco: examen.EnBlanco,
      Fecha: examen.Fecha,
    }));

    res.json({
      message: "Examenes cargados correctamente",
      examenes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getCursos = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const cursos = await Curso.findAll({
      where: { CodigoGrado: CodigoGrado },
    });
    res.json({ message: "Cursos cargados correctamente", cursos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los cursos" });
  }
};

const getExamen = async (req, res) => {
  try {
    const { CodigoExamen } = req.query;

    const examen = await ExamenDiario.findOne({
      where: { Codigo: CodigoExamen },
    });

    const preguntas = await Pregunta.findAll({
      include: [
        {
          model: Respuesta,
          order: sequelize.literal("RAND()"),
        },
      ],
      where: { CodigoTema: examen.CodigoTema },
      order: sequelize.literal("RAND()"), // Orden aleatorio
      limit: 10, // Limitar a 10 registros
    });

    res.json({ message: "Examen cargado correctamente", examen, preguntas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar el examen" });
  }
};

const getTemas = async (req, res) => {
  try {
    const { CodigoCurso } = req.query;

    const temas = await Tema.findAll({
      where: { CodigoCurso },
    });
    res.json({ message: "Temas cargados correctamente", temas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los temas" });
  }
};

const crearExamen = async (req, res) => {
  try {
    const examen = req.body.examen;

    if (examen.Codigo == 0) {
      await ExamenDiario.create(examen);
      res.json({ message: "Examen creado correctamente" });
    } else {
      await ExamenDiario.update(examen, {
        where: { Codigo: examen.Codigo },
      });
      res.json({ message: "Examen actualizado correctamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el examen" });
  }
};

const guardarExamen = async (req, res) => {
  try {
    const { estudianteExamenDiario, preguntaEstudianteExamenDiario } = req.body;

    await sequelize.transaction(async (t) => {
      await EstudianteExamenDiario.create(estudianteExamenDiario, {
        transaction: t,
      });

      await PreguntaExamenDiarioEstudiante.bulkCreate(
        preguntaEstudianteExamenDiario,
        {
          transaction: t,
        }
      );
    });

    res.json({ message: "Examen guardado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el examen" });
  }
};

const getDetalleExamen = async (req, res) => {
  try {
    const { CodigoEstudiante, CodigoExamen } = req.query;
    if (!CodigoEstudiante || !CodigoExamen) {
      return res
        .status(400)
        .json({ error: "CodigoEstudiante y CodigoExamen son requeridos" });
    }

    const estudiante = await Estudiante.findOne({
      include: [
        {
          model: Persona,
          attributes: ["Nombres", "ApellidoPaterno", "ApellidoMaterno"],
        },
      ],
      where: {
        Codigo: CodigoEstudiante,
      },
    });

    const temaexamen = await ExamenDiario.findOne({
      include: [
        {
          model: Tema,
          attributes: ["Descripcion"],
        },
      ],
      where: {
        Codigo: CodigoExamen,
      },
    });

    const examen = await EstudianteExamenDiario.findOne({
      attributes: ["Nota", "Fecha"],
      where: {
        CodigoEstudiante: CodigoEstudiante,
        CodigoExamenDiario: CodigoExamen,
      },
    });

    const preguntasBuscar = await PreguntaExamenDiarioEstudiante.findAll({
      attributes: ["CodigoPregunta", "CodigoRespuesta"],
      where: {
        CodigoEstudiante: CodigoEstudiante,
        CodigoExamenDiario: CodigoExamen,
      },
    });

    // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
    const preguntas = await Promise.all(
      preguntasBuscar.map(async (buscar) => {
        const pregunta = await Pregunta.findOne({
          include: [
            {
              model: Respuesta,
              order: sequelize.literal("RAND()"),
              limit: 5,
            },
          ],
          where: { Codigo: buscar.CodigoPregunta },
        });

        let RutaImagen = "";

        if (pregunta.RutaImagen) {
          const filePath = join(__dirname, "../uploads/", pregunta.RutaImagen);

          if (fs.existsSync(filePath)) {
            RutaImagen = filePath;
          }
        }

        return {
          Codigo: pregunta.Codigo,
          Descripcion: pregunta.Descripcion,
          RutaImagen: RutaImagen,
          Respuestas: pregunta.Respuesta,
          RespuestaSeleccionada: buscar.CodigoRespuesta ?? null,
        };
      })
    );
    // console.log("RSP:", preguntas);

    const tema = {
      Descripcion: temaexamen.Tema.Descripcion,
    };

    res.json({
      message: "Examen cargados correctamente",
      examen,
      preguntas,
      estudiante,
      tema,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar el examen" });
  }
};

const getInfoReporte = async (req, res) => {
  const niveles = await Nivel.findAll({});
  const grados = await Grado.findAll({});
  const examenes = await ExamenDiario.count({});
  const estudiantes = await Estudiante.count({});

  res.json({
    ok: true,
    niveles,
    grados,
    examenes,
    estudiantes,
  });
};

const getReporteGrado = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
        {
          model: EstudianteExamenDiario,
        },
      ],
      where: { "$Tema.Curso.CodigoGrado$": CodigoGrado },
    });

    const datos = examenes.map((examen) => ({
      Codigo: examen.Codigo,
      Curso: examen.Tema.Curso.Nombre,
      Tema: examen.Tema.Descripcion,
      Resueltos: examen?.EstudianteExamenDiarios.length ?? 0,
    }));

    res.json({ message: "Examenes cargados correctamente", datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getReporteCurso = async (req, res) => {
  try {
    const { CodigoCurso } = req.query;

    const datosCurso = await Curso.findOne({
      include: [
        {
          model: Grado,
          attributes: ["Nombre"],
        },
      ],
      where: { Codigo: CodigoCurso },
    });

    const examenes = await ExamenDiario.findAll({
      include: [
        {
          model: Tema,
          include: [
            {
              model: Curso,
            },
          ],
        },
        {
          model: EstudianteExamenDiario,
        },
      ],
      where: { "$Tema.Curso.Codigo$": CodigoCurso },
    });

    const curso = {
      Codigo: datosCurso.Codigo,
      Nombre: datosCurso.Nombre,
      Grado: datosCurso.Grado.Nombre,
    };

    const datos = examenes.map((examen) => ({
      Codigo: examen.Codigo,
      Curso: examen.Tema.Curso.Nombre,
      Tema: examen.Tema.Descripcion,
      Resueltos: examen?.EstudianteExamenDiarios.length ?? 0,
    }));

    res.json({ message: "Examenes cargados correctamente", datos, curso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

const getDataChart = async (req, res) => {
  try {
    const { CodigoGrado } = req.query;

    const cursos = await Curso.findAll({
      where: { CodigoGrado },
    });

    const datos = await EstudianteExamenDiario.findAll({
      include: [
        {
          model: Estudiante,
          attributes: ["Codigo", "CodigoGrado"],
        },
        {
          model: ExamenDiario,
          attributes: ["Fecha"],
          include: [
            {
              model: Tema,
              attributes: ["Codigo"],
              include: [
                {
                  model: Curso,
                  attributes: ["Codigo"],
                },
              ],
            },
          ],
        },
      ],
      attributes: ["Nota"],
      where: { "$Estudiante.CodigoGrado$": CodigoGrado },
    });

    const labels = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const colors = [
      "#f97316",
      "#06b6d4",
      "#ec4899",
      "#22c55e",
      "#a855f7",
      "#eab308",
      "#3b82f6",
      "#ff3d32",
      "#64748b",
      "#6366f1",
      "#14b8a6",
      "#6366f1",
      "#6b7280",
    ];

    const colorsText = [
      "orange",
      "cyan",
      "pink",
      "green",
      "purple",
      "yellow",
      "blue",
      "red",
      "bluegray",
      "indigo",
      "teal",
      "primary",
      "gray",
    ];

    let datosCurso = [];
    let datosFinales = [];
    let datosPromedios = [];

    cursos.forEach((f, index) => {
      const curso = datos
        .filter((examen) => examen.ExamenDiario.Tema.Curso.Codigo == f.Codigo)
        .map((dato) => ({ Nota: dato.Nota, Fecha: dato.ExamenDiario.Fecha }));
      datosCurso.push([]);

      for (let j = 0; j < 12; j++) {
        const cursomes = curso
          .filter((examen) => new Date(examen.Fecha).getMonth() == j)
          .map((dato) => Number(dato.Nota));
        if (cursomes.length > 0) {
          const suma = cursomes.reduce((total, numero) => total + numero, 0);
          const promedio = suma / cursomes?.length;
          datosCurso[index].push(promedio);
        } else datosCurso[index].push(0);
      }
    });

    const promedios = [];

    datosCurso.forEach((curso) => {
      const cursoLimpio = curso.filter((nota) => nota != 0);
      if (cursoLimpio.length > 0) {
        const suma = cursoLimpio.reduce((total, numero) => total + numero, 0);
        const promedio = suma / cursoLimpio?.length;
        promedios.push(promedio);
      } else promedios.push(0);
    });

    cursos.forEach((curso, index) => {
      const y = {
        curso: curso.Nombre,
        promedio: promedios[index],
        porcentaje: (promedios[index] / 20) * 100,
        color: colorsText[index],
      };
      datosPromedios.push(y);

      const x = {
        label: curso.Nombre,
        data: datosCurso[index],
        fill: false,
        backgroundColor: colors[index],
        borderColor: colors[index],
        tension: 0.4,
      };
      datosFinales.push(x);
    });

    res.json({
      message: "Datos cargados correctamente",
      labels,
      datosPromedios,
      datosFinales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los datos" });
  }
};

const getDataChartCurso = async (req, res) => {
  try {
    const { CodigoCurso } = req.query;

    const curso = await Curso.findOne({
      where: { Codigo: CodigoCurso },
    });

    const cursos = [curso];

    const datos = await EstudianteExamenDiario.findAll({
      include: [
        {
          model: ExamenDiario,
          attributes: ["Fecha"],
          include: [
            {
              model: Tema,
              attributes: ["Codigo"],
              include: [
                {
                  model: Curso,
                  attributes: ["Codigo"],
                },
              ],
            },
          ],
        },
      ],
      attributes: ["Nota"],
      where: { "$ExamenDiario.Tema.Curso.Codigo$": CodigoCurso },
    });

    const labels = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const colors = [
      "#f97316",
      "#06b6d4",
      "#ec4899",
      "#22c55e",
      "#a855f7",
      "#eab308",
      "#3b82f6",
      "#ff3d32",
      "#64748b",
      "#6366f1",
      "#14b8a6",
      "#6366f1",
      "#6b7280",
    ];

    const colorsText = [
      "orange",
      "cyan",
      "pink",
      "green",
      "purple",
      "yellow",
      "blue",
      "red",
      "bluegray",
      "indigo",
      "teal",
      "primary",
      "gray",
    ];

    let datosCurso = [];
    let datosFinales = [];
    let datosPromedios = [];

    cursos.forEach((f, index) => {
      const curso = datos
        .filter((examen) => examen.ExamenDiario.Tema.Curso.Codigo == f.Codigo)
        .map((dato) => ({ Nota: dato.Nota, Fecha: dato.ExamenDiario.Fecha }));
      datosCurso.push([]);

      for (let j = 0; j < 12; j++) {
        const cursomes = curso
          .filter((examen) => new Date(examen.Fecha).getMonth() == j)
          .map((dato) => Number(dato.Nota));
        if (cursomes.length > 0) {
          const suma = cursomes.reduce((total, numero) => total + numero, 0);
          const promedio = suma / cursomes?.length;
          datosCurso[index].push(promedio);
        } else datosCurso[index].push(0);
      }
    });

    const promedios = [];

    datosCurso.forEach((curso) => {
      const cursoLimpio = curso.filter((nota) => nota != 0);
      if (cursoLimpio.length > 0) {
        const suma = cursoLimpio.reduce((total, numero) => total + numero, 0);
        const promedio = suma / cursoLimpio?.length;
        promedios.push(promedio);
      } else promedios.push(0);
    });

    cursos.forEach((curso, index) => {
      const y = {
        curso: curso.Nombre,
        promedio: promedios[index],
        porcentaje: (promedios[index] / 20) * 100,
        color: colorsText[index],
      };
      datosPromedios.push(y);

      const x = {
        label: curso.Nombre,
        data: datosCurso[index],
        fill: false,
        backgroundColor: colors[index],
        borderColor: colors[index],
        tension: 0.4,
      };
      datosFinales.push(x);
    });

    res.json({
      message: "Datos cargados correctamente",
      labels,
      datosPromedios,
      datosFinales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los datos" });
  }
};

const getDataChartEstudiante = async (req, res) => {
  try {
    const { CodigoEstudiante } = req.query;
    const { DNI } = req.query;

    let datos;
    let estudiante;

    if (CodigoEstudiante) {
      estudiante = await Estudiante.findOne({
        where: { Codigo: CodigoEstudiante },
      });
      datos = await EstudianteExamenDiario.findAll({
        include: [
          {
            model: ExamenDiario,
            attributes: ["Fecha"],
            include: [
              {
                model: Tema,
                attributes: ["Codigo"],
                include: [
                  {
                    model: Curso,
                    attributes: ["Codigo"],
                  },
                ],
              },
            ],
          },
        ],
        attributes: ["Nota"],
        where: { CodigoEstudiante },
      });
    }
    if (DNI) {
      estudiante = await Estudiante.findOne({
        include: [
          {
            model: Persona,
            attributes: ["DNI"],
          },
        ],
        where: { "$Persona.DNI$": DNI },
      });

      datos = await EstudianteExamenDiario.findAll({
        include: [
          {
            model: ExamenDiario,
            attributes: ["Fecha"],
            include: [
              {
                model: Tema,
                attributes: ["Codigo"],
                include: [
                  {
                    model: Curso,
                    attributes: ["Codigo"],
                  },
                ],
              },
            ],
          },
          {
            model: Estudiante,
            attributes: ["Codigo"],
            include: [
              {
                model: Persona,
                attributes: ["DNI"],
              },
            ],
          },
        ],
        attributes: ["Nota"],
        where: { "$Estudiante.Persona.DNI$": DNI },
      });
    }

    const labels = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const colors = [
      "#f97316",
      "#06b6d4",
      "#ec4899",
      "#22c55e",
      "#a855f7",
      "#eab308",
      "#3b82f6",
      "#ff3d32",
      "#64748b",
      "#6366f1",
      "#14b8a6",
      "#6366f1",
      "#6b7280",
    ];

    const colorsText = [
      "orange",
      "cyan",
      "pink",
      "green",
      "purple",
      "yellow",
      "blue",
      "red",
      "bluegray",
      "indigo",
      "teal",
      "primary",
      "gray",
    ];

    const cursos = await Curso.findAll({
      where: { CodigoGrado: estudiante.CodigoGrado },
    });

    let datosCurso = [];
    let datosFinales = [];
    let datosPromedios = [];

    cursos.forEach((f, index) => {
      const curso = datos
        .filter((examen) => examen.ExamenDiario.Tema.Curso.Codigo == f.Codigo)
        .map((dato) => ({ Nota: dato.Nota, Fecha: dato.ExamenDiario.Fecha }));
      datosCurso.push([]);

      for (let j = 0; j < 12; j++) {
        const cursomes = curso
          .filter((examen) => new Date(examen.Fecha).getMonth() == j)
          .map((dato) => Number(dato.Nota));
        if (cursomes.length > 0) {
          const suma = cursomes.reduce((total, numero) => total + numero, 0);
          const promedio = suma / cursomes?.length;
          datosCurso[index].push(promedio);
        } else datosCurso[index].push(0);
      }
    });

    const promedios = [];

    datosCurso.forEach((curso) => {
      const cursoLimpio = curso.filter((nota) => nota != 0);
      if (cursoLimpio.length > 0) {
        const suma = cursoLimpio.reduce((total, numero) => total + numero, 0);
        const promedio = suma / cursoLimpio?.length;
        promedios.push(promedio);
      } else promedios.push(0);
    });

    cursos.forEach((curso, index) => {
      const y = {
        curso: curso.Nombre,
        promedio: promedios[index],
        porcentaje: (promedios[index] / 20) * 100,
        color: colorsText[index],
      };
      datosPromedios.push(y);

      const x = {
        label: curso.Nombre,
        data: datosCurso[index],
        fill: false,
        backgroundColor: colors[index],
        borderColor: colors[index],
        tension: 0.4,
      };
      datosFinales.push(x);
    });

    res.json({
      message: "Datos cargados correctamente",
      labels,
      datosFinales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los datos" });
  }
};

const getDataPromedioGrado = async (req, res) => {
  try {
    const { CodigoNivel } = req.query;

    const datos = await ExamenDiario.findOne({});

    res.json({ message: "Examenes cargados correctamente", datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los examenes" });
  }
};

module.exports = {
  getExamenes,
  getReporteExamenes,
  getExamenesEstudiante,
  getReporteExamenesEstudiante,
  getInfoReporte,
  getReporteGrado,
  getReporteCurso,
  getDataChart,
  getDataChartCurso,
  getDataChartEstudiante,
  getDataPromedioGrado,
  getDetalleExamen,
  getExamen,
  getCursos,
  getTemas,
  crearExamen,
  guardarExamen,
};
