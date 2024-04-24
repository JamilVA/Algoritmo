const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CursoEstudiante = sequelize.define("CursoEstudiante", {
  CodigoCurso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  CodigoEstudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  Nota1: DataTypes.STRING(2),
  Nota2: DataTypes.STRING(2),
  Nota3: DataTypes.STRING(2),
  PromedioFinal: DataTypes.STRING(2),
});

module.exports = CursoEstudiante;
