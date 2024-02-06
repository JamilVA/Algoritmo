const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Nivel = sequelize.define('Nivel', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Nombre: DataTypes.STRING(15),
    
})

module.exports = Nivel