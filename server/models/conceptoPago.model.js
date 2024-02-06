const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const ConceptoPago = sequelize.define('ConceptoPago', {
    Codigo: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    Concepto: DataTypes.STRING(15),
    Monto: DataTypes.DECIMAL,
})

module.exports = ConceptoPago;