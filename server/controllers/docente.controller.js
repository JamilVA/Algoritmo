const { TipoUsuario, Usuario, Persona, Docente, Grupo} = require('../config/relations');

const getDocentes = async(req,res) => {
    const docentes = await Docente.findAll({
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
        docentes
    })
}

const crearDocente = async(req,res) =>{
    try {
        const persona = await Persona.create({
            Codigo: null,
            Nombres: req.body.Nombres,
            ApellidoPaterno: req.body.ApellidoPaterno,
            ApellidoMaterno: req.body.ApellidoMaterno,
            DNI: req.body.DNI,          
        });

        const docente = await Docente.create({
            Codigo: null,
            FechaNacimiento: req.body.FechaNacimiento,
            Telefono: req.body.Telefono,
            Email: req.body.Email,
            CodigoPersona: persona.Codigo,
        });
        const usuario = await Usuario.create({
           Password: req.body.Password,
        });

        res.json({
            ok:true,
            persona,
            docente,
            usuario,
        })
            
    } catch (error) {
        console.error(error)
    }
}

const actualizarDocente = async(req,res) =>{
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

        const docente = await Docente.update({
            FechaNacimiento: req.body.FechaNacimiento,
            Telefono: req.body.Telefono,
            Email: req.body.Email,
            CodigoPersona: persona.Codigo,
        },{
            where: {
                Codigo: req.body.Codigo,
            }
        });
        const usuario = await Usuario.create({
            Password: req.body.Password,
         });
        res.json({
            ok:true,
            persona,
            docente,
            usuario,
        })
            
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    getDocentes,
    crearDocente,
    actualizarDocente,
}