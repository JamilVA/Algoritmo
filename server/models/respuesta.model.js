const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Respuesta = sequelize.define('Respuesta', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Tipo: DataTypes.TINYINT,
    Valor: DataTypes.VARCHAR(200),
})

module.exports = Respuesta