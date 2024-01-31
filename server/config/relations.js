const Usuario = require('../models/usuario.model');
const Persona = require('../models/persona.model');

Persona.hasOne(Usuario, {foreignKey:'CodigoPersona'});
Usuario.belongsTo(Persona, {foreignKey:'CodigoPersona'});

module.exports ={
    Persona,
    Usuario
}

const Nivel = require('../models/nivel.model');
const Grado = require('../models/grado.model');

Nivel.hasMany(Grado, {foreignKey: 'CodigoNivel'});
Grado.belongsTo(Nivel, {foreignKey: 'CodigoNivel'})

module.exports ={
    Nivel,
    Grado
}

const Grado = require('../models/grado.model');
const Curso = require('../models/curso.model');

Grado.hasMany(Curso, {foreignKey: 'CodigoGrado'});
Curso.belongsTo(Grado, {foreignKey: 'CodigoGrado'})

module.exports ={
    Grado,
    Curso
}

const Curso = require('../models/curso.model');
const Horario = require('../models/horario.model');

Curso.hasMany(Horario, {foreignKey: 'CodigoCurso'});
Horario.belongsTo(Curso, {foreignKey: 'CodigoCurso'})

module.exports ={
    Curso,
    Horario
}


const Curso = require('../models/curso.model');
const Tema = require('../models/tema.model');

Curso.hasMany(Tema, {foreignKey: 'CodigoCurso'});
Tema.belongsTo(Curso, {foreignKey: 'CodigoCurso'})

module.exports ={
    Curso,
    Tema
}


const Pregunta = require('../models/pregunta.model');
const Respuesta = require('../models/respuesta.model');

Pregunta.hasMany(Respuesta, {foreignKey: 'CodigoPregunta'});
Respuesta.belongsTo(Pregunta, {foreignKey: 'CodigoPregunta'})

module.exports ={
    Pregunta,
    Respuesta
}