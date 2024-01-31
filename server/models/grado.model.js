const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Grado = sequelize.define('Grado', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Nombre: DataTypes.VARCHAR(15),
    
})

module.exports = Grado