const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const cursoEstudiante = sequelize.define('cursoEstudiante', {
    Nota1: DataTypes.STRING(2),
    Nota2: DataTypes.STRING(2),
    Nota3: DataTypes.STRING(2),
    PromedioFinal: DataTypes.STRING(2),
})

module.exports = cursoEstudiante