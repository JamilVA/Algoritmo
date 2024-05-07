const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/database')

const Usuario = sequelize.define('Usuario',{
    Codigo: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Estado: DataTypes.TINYINT,
    Email: {
        type: DataTypes.STRING(45),
        unique: true,
    },
    Password: DataTypes.STRING(20),
})

module.exports = Usuario