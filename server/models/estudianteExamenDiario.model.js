const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const estudianteExamenDiario = sequelize.define("estudianteExamenDiario", {
  CodigoEstudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  CodigoExamenDiario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  Nota: DataTypes.DECIMAL(10, 0),
  Correctas: DataTypes.INTEGER,
  Incorrectas: DataTypes.INTEGER,
  EnBlanco: DataTypes.INTEGER,
  Estado: DataTypes.BOOLEAN
});

module.exports = estudianteExamenDiario;
