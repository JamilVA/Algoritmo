const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Grado = sequelize.define('Grado', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Nombre: DataTypes.STRING(15),
    
})

module.exports = Grado