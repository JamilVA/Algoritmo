const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Curso = sequelize.define('Curso', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Nombre: DataTypes.STRING(30),
    
})

module.exports = Curso