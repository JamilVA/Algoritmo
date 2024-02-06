const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require('../config/database')

const Apoderado = sequelize.define('Apoderado',{
    Codigo:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    Direccion: DataTypes.STRING(100),
    Telefono: DataTypes.STRING(9),
});

module.exports = Apoderado