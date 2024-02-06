const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Docente = sequelize.define('Docente', {
    Codigo:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Email: DataTypes.STRING(45),
    Telefono: DataTypes.STRING(9),
    FechaNacimiento: DataTypes.DATEONLY,
})

module.exports = Docente