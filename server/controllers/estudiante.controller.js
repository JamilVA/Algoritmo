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

const crearEstudiante = async(req,res) =>{
    try {
        const persona = await Persona.create({
            Codigo: null,
            Nombres: req.body.Nombres,
            ApellidoPaterno: req.body.ApellidoPaterno,
            ApellidoMaterno: req.body.ApellidoMaterno,
            DNI: req.body.DNI,          
        });

        const estudiante = await Estudiante.create({
            Codigo: null,
            FechaNacimiento: req.body.FechaNacimiento,
            CodigoPersona: persona.Codigo,
        });

        const usuario = await Usuario.create({
            Codigo: null,
            Estado: true,
            Email: req.body.Email,
            Password: req.body.Password,
            CodigoPersona: persona.Codigo,
            CodigoTipoUsuario: 3,
        })

        res.json({
            ok:true,
            persona,
            estudiante,
            usuario
        })
            
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    getEstudiantes,
    crearEstudiante,
}