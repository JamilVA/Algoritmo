const { Model } = require('sequelize');
const { TipoUsuario, Usuario, Persona, Estudiante} = require('../config/relations');

const getEstudiantes = async(req,res) => {
    const estudiantes = await Estudiante.findAll({
        attributes: {
            exclude: ['FechaNacimiento'],
        },
        include : [
            {
                model: Persona,
                attributes:['Codigo','ApellidoPaterno','ApellidoMaterno']
            }

        ]
    })

    res.json({
        ok:true,
        estudiantes
    })
}


module.exports = {
    getEstudiantes,
}