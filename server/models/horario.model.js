const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Horario = sequelize.define('Horario', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Dia: DataTypes.STRING(10),
    HoraInicio: DataTypes.TIME,
    HoraFin: DataTypes.TIME,
    
})

module.exports = Horario