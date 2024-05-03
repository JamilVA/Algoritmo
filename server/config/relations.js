const Usuario = require("../models/usuario.model");
const Persona = require("../models/persona.model");
const TipoUsuario = require("../models/tipoUsuario.model");
const Apoderado = require("../models/apoderado.model");
const Estudiante = require("../models/estudiante.model");
const Docente = require("../models/docente.model");
const Pago = require("../models/pago.model");
const ConceptoPago = require("../models/conceptoPago.model");
const Nivel = require("../models/nivel.model");
const Grado = require("../models/grado.model");
const Curso = require("../models/curso.model");
const Horario = require("../models/horario.model");
const Tema = require("../models/tema.model");
const Pregunta = require("../models/pregunta.model");
const Respuesta = require("../models/respuesta.model");


const Asistencia = require('../models/asistencia.model');
const CursoEstudiante = require('../models/cursoestudiante.model');
const EstudianteExamenDiario = require('../models/estudianteexamendiario.model');
const PreguntaExamenDiarioEstudiante = require('../models/preguntaexamendiarioestudiante.model');
const Sesion = require('../models/sesion.model');
const ExamenDiario = require("../models/examenDiario.model");


Persona.hasOne(Usuario, { foreignKey: "CodigoPersona" });
Usuario.belongsTo(Persona, { foreignKey: "CodigoPersona" });

TipoUsuario.hasMany(Usuario, { foreignKey: "CodigoTipoUsuario" });
Usuario.belongsTo(TipoUsuario, { foreignKey: "CodigoTipoUsuario" });

Persona.hasOne(Apoderado, { foreignKey: "CodigoPersona" });
Apoderado.belongsTo(Persona, { foreignKey: "CodigoPersona" });

Persona.hasOne(Docente, { foreignKey: "CodigoPersona" });
Docente.belongsTo(Persona, { foreignKey: "CodigoPersona" });

Persona.hasOne(Estudiante, { foreignKey: "CodigoPersona" });
Estudiante.belongsTo(Persona, { foreignKey: "CodigoPersona" });

Apoderado.hasMany(Estudiante, { foreignKey: "CodigoApoderado" });
Estudiante.belongsTo(Apoderado, { foreignKey: "CodigoApoderado" });

Grado.hasMany(Estudiante, { foreignKey: "CodigoGrado" });
Estudiante.belongsTo(Grado, { foreignKey: "CodigoGrado" });

Docente.hasOne(Grado, { foreignKey: "CodigoDocente" });
Grado.belongsTo(Docente, { foreignKey: "CodigoDocente" });

Docente.hasMany(Curso, { foreignKey: "CodigoDocente" });
Curso.belongsTo(Docente, { foreignKey: "CodigoDocente" });

Estudiante.hasMany(Pago, { foreignKey: "CodigoEstudiante" });
Pago.belongsTo(Estudiante, { foreignKey: "CodigoEstudiante" });

ConceptoPago.hasMany(Pago, { foreignKey: "CodigoConceptoPago" });
Pago.belongsTo(ConceptoPago, { foreignKey: "CodigoConceptoPago" });

Nivel.hasMany(Grado, { foreignKey: "CodigoNivel" });
Grado.belongsTo(Nivel, { foreignKey: "CodigoNivel" });

Grado.hasMany(Curso, { foreignKey: "CodigoGrado" });
Curso.belongsTo(Grado, { foreignKey: "CodigoGrado" });

Curso.hasMany(Horario, { foreignKey: "CodigoCurso" });
Horario.belongsTo(Curso, { foreignKey: "CodigoCurso" });

Curso.hasMany(Tema, { foreignKey: "CodigoCurso" });
Tema.belongsTo(Curso, { foreignKey: "CodigoCurso" });

Tema.hasMany(Pregunta, { foreignKey: "CodigoTema" });
Pregunta.belongsTo(Tema, { foreignKey: "CodigoTema" });

Pregunta.hasMany(Respuesta, { foreignKey: "CodigoPregunta" });
Respuesta.belongsTo(Pregunta, { foreignKey: "CodigoPregunta" });

Estudiante.hasMany(CursoEstudiante, { foreignKey: "CodigoEstudiante" });
CursoEstudiante.belongsTo(Estudiante, { foreignKey: "CodigoEstudiante" });

Curso.hasMany(CursoEstudiante, { foreignKey: "CodigoCurso" });
CursoEstudiante.belongsTo(Curso, { foreignKey: "CodigoCurso" });

Tema.hasMany(ExamenDiario, { foreignKey: "CodigoTema" });
ExamenDiario.belongsTo(Tema, { foreignKey: "CodigoTema" });

ExamenDiario.hasMany(EstudianteExamenDiario, { foreignKey: "CodigoExamenDiario" });
EstudianteExamenDiario.belongsTo(ExamenDiario, { foreignKey: "CodigoExamenDiario" });

Estudiante.hasMany(EstudianteExamenDiario, { foreignKey: "CodigoEstudiante" });
EstudianteExamenDiario.belongsTo(Estudiante, { foreignKey: "CodigoEstudiante" });

module.exports = {
  Persona,
  Usuario,
  TipoUsuario,
  Apoderado,
  Estudiante,
  CursoEstudiante,
  EstudianteExamenDiario,
  ExamenDiario,
  Docente,
  Pago,
  ConceptoPago,
  Nivel,
  Grado,
  Curso,
  Horario,
  Tema,
  Pregunta,
  Respuesta,
};
