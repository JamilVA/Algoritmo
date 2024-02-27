const { TipoUsuario, Usuario, Persona, Estudiante, Grupo} = require('../config/relations');

const getEstudiantes = async(req,res) => {
    const estudiantes = await Estudiante.findAll({
        include : [
            {
                model: Persona,
            },{
                model: Grupo,
                attributes: ['Nombre']
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
            Password: req.body.Password,
            Email: req.body.Email,
            Estado: true,
            CodigoPersona: persona.Codigo,
            CodigoTipoUsuario: 2,
         });
         
        res.json({
            ok:true,
            persona,
            estudiante,
        })
            
    } catch (error) {
        console.error(error)
    }
}

const actualizarEstudiante = async(req,res) =>{
    try {
        const persona = await Persona.update({
            Nombres: req.body.Nombres,
            ApellidoPaterno: req.body.ApellidoPaterno,
            ApellidoMaterno: req.body.ApellidoMaterno,
            DNI: req.body.DNI,           
        },{
            where: {
                Codigo: req.body.CodigoPersona,
            }
        });

        const estudiante = await Estudiante.update({
            FechaNacimiento: req.body.FechaNacimiento,
            CodigoPersona: persona.Codigo,
        },{
            where: {
                Codigo: req.body.Codigo,
            }
        });
        const usuario = await Usuario.update({
            Password: req.body.Password,
            Email: req.body.Email,
         });
         
        res.json({
            ok:true,
            persona,
            estudiante,
        })
            
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    getEstudiantes,
    crearEstudiante,
    actualizarEstudiante,
}