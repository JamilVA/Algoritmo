const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Asistencia = sequelize.define('Asistencia', {
    
    TipoAsistencia: DataTypes.STRING(20),
    Hora: DataTypes.TIME
})
module.exports = Asistencia
