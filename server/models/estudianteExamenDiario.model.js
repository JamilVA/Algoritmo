const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const estuandianteExamenDiario = sequelize.define('estuandianteExamenDiario', {
    Nota: DataTypes.DECIMAL(10,0),
})

module.exports = estuandianteExamenDiario