const Usuario = require('../models/usuario.model');
const Persona = require('../models/persona.model');
const Usuario = require('../models/usuario.model');
const Persona = require('../models/persona.model');
const TipoUsuario = require('../models/tipoUsuario.model');
const Apoderado = require('../models/apoderado.model');
const Estudiante = require('../models/estudiante.model');
const Docente = require('../models/docente.model');
const Grupo = require('../models/grupo.model');
const Pago = require('../models/pago.model');
const ConceptoPago = require('../models/conceptoPago.model');
const Nivel = require('../models/nivel.model');
const Grado = require('../models/grado.model');
const Curso = require('../models/curso.model');
const Horario = require('../models/horario.model');
const Tema = require('../models/tema.model');
const Pregunta = require('../models/pregunta.model');
const Respuesta = require('../models/respuesta.model');

Persona.hasOne(Usuario, {foreignKey:'CodigoPersona'});
Usuario.belongsTo(Persona, {foreignKey:'CodigoPersona'});

TipoUsuario.hasMany(Usuario, {foreignKey:'CodigoTipoUsuario'})
Usuario.belongsTo(TipoUsuario, {foreignKey:'CodigoTipoUsuario'})

Persona.hasOne(Apoderado, {foreignKey:'CodigoPersona'})
Apoderado.belongsTo(Persona, {foreignKey:'CodigoPersona'})

Persona.hasOne(Docente, {foreignKey:'CodigoPersona'})
Docente.belongsTo(Persona, {foreignKey:'CodigoPersona'})

Apoderado.hasMany(Estudiante, {foreignKey:'CodigoApoderado'})
Estudiante.belongsTo(Apoderado, {foreignKey:'CodigoApoderado'})

Grupo.hasMany(Estudiante, {foreignKey:'CodigoGrupo'})
Estudiante.belongsTo(Grupo, {foreignKey:'CodigoGrupo'})

Docente.hasOne(Grupo, {foreignKey:'CodigoDocente'})
Grupo.belongsTo(Docente, {foreignKey:'CodigoDocente'})

Estudiante.hasMany(Pago, {foreignKey:'CodigoEstudiante'})
Pago.belongsTo(Estudiante, {foreignKey:'CodigoEstudiante'})

ConceptoPago.hasMany(Pago, {foreignKey:'CodigoConceptoPago'})
Pago.belongsTo(ConceptoPago, {foreignKey:'CodigoConceptoPago'})

Nivel.hasMany(Grado, {foreignKey: 'CodigoNivel'})
Grado.belongsTo(Nivel, {foreignKey: 'CodigoNivel'})

Grado.hasMany(Curso, {foreignKey: 'CodigoGrado'})
Curso.belongsTo(Grado, {foreignKey: 'CodigoGrado'})

Curso.hasMany(Horario, {foreignKey: 'CodigoCurso'})
Horario.belongsTo(Curso, {foreignKey: 'CodigoCurso'})

Curso.hasMany(Tema, {foreignKey: 'CodigoCurso'})
Tema.belongsTo(Curso, {foreignKey: 'CodigoCurso'})

Tema.hasMany(Pregunta, {foreignKey: 'CodigoTema'})
Pregunta.belongsTo(Tema, {foreignKey: 'CodigoTema'})

Pregunta.hasMany(Respuesta, {foreignKey: 'CodigoPregunta'})
Respuesta.belongsTo(Pregunta, {foreignKey: 'CodigoPregunta'})


module.exports = {
    Persona,
    Usuario,
    TipoUsuario,
    Apoderado,
    Estudiante,
    Docente,
    Grupo,
    Pago,
    ConceptoPago,
    Nivel,
    Grado,
    Curso,
    Horario,
    Tema,
    Pregunta,
    Respuesta
}