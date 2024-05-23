const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const PreguntaExamenDiarioEstudiante = sequelize.define('PreguntaExamenDiarioEstudiante', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    CodigoPregunta: DataTypes.INTEGER(),
    CodigoRespuesta: DataTypes.INTEGER(),
})

module.exports = PreguntaExamenDiarioEstudiante