const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const TipoUsuario = sequelize.define('TipoUsuario', {
    Codigo: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Nombre: DataTypes.STRING(45),  
})

module.exports = TipoUsuario