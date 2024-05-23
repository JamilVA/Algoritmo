const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const EstudianteExamenDiario = sequelize.define("EstudianteExamenDiario", {
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
  Estado: DataTypes.BOOLEAN,
  Fecha: DataTypes.DATE,
});

module.exports = EstudianteExamenDiario;
