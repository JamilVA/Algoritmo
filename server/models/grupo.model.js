const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Grupo = sequelize.define('Grupo',{
    Codigo:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    Nombre: DataTypes.STRING(45),
})

module.exports = Grupo;