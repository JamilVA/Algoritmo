const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Estudiante = sequelize.define('Estudiante',{
    Codigo:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    FechaNacimiento: DataTypes.DATEONLY,
})

module.exports = Estudiante;