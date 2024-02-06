const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Tema = sequelize.define('Tema', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Descripcion: DataTypes.STRING(100),
    
})

module.exports = Tema