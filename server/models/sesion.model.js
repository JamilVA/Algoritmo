const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Sesion = sequelize.define('Sesion', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Fecha: DataTypes.TIME(),
    Descripcion: DataTypes.STRING(45),
})

module.exports = Sesion