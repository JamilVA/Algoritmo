const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Pregunta = sequelize.define('Pregunta', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Descripcion: DataTypes.TEXT,
    RutaImagen: DataTypes.STRING(60),
})

module.exports = Pregunta