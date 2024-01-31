const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Persona = sequelize.define('Persona', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Nombres: DataTypes.STRING(60),
    ApellidoPaterno: DataTypes.STRING(45),
    ApellidoMaterno: DataTypes.STRING(45),
    DNI: DataTypes.STRING(8),
})

module.exports = Persona