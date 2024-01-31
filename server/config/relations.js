const Usuario = require('../models/usuario.model');
const Persona = require('../models/persona.model');

Persona.hasOne(Usuario, {foreignKey:'CodigoPersona'});
Usuario.belongsTo(Persona, {foreignKey:'CodigoPersona'});


module.exports ={
    Persona,
    Usuario
}