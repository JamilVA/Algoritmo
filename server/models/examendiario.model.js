const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const ExamenDiario = sequelize.define('ExamenDiario', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Fecha: DataTypes.DATE(),
    HoraInicio: DataTypes.TIME(),
    HoraFin: DataTypes.TIME(),
    Duracion: DataTypes.INTEGER(),
})

module.exports = ExamenDiario