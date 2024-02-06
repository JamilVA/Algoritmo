const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Pago = sequelize.define('Pago',{
    Codigo:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    TipoPago: DataTypes.STRING(25),
    CodigoOperacion: DataTypes.STRING(15),
    Fecha: DataTypes.DATE,
})

module.exports = Pago