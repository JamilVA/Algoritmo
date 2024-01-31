const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const preguntaExamenDiarioEstudiante = sequelize.define('preguntaExamenDiarioEstudiante', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    RespuestaCorrecta: DataTypes.TINYINT(),
})

module.exports = preguntaExamenDiarioEstudiante