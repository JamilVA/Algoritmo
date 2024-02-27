const { TipoUsuario, Usuario, Persona, Apoderado} = require('../config/relations');

const getApoderados = async(req,res) => {
    const apoderados = await Apoderado.findAll({
        include : [
            {
                model: Persona,
            }
        ]
    })

    res.json({
        ok:true,
        apoderados
    })
}

const crearApoderado = async(req,res) =>{
    try {
        const persona = await Persona.create({
            Codigo: null,
            Nombres: req.body.Nombres,
            ApellidoPaterno: req.body.ApellidoPaterno,
            ApellidoMaterno: req.body.ApellidoMaterno,
            DNI: req.body.DNI,    
             
        });

        const apoderado = await Apoderado.create({
            Codigo: null,
            Telefono: req.body.Telefono,
            Direccion: req.body.Direccion, 
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
            apoderado,
        })
            
    } catch (error) {
        console.error(error)
    }
}

const actualizarApoderado = async(req,res) =>{
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

        const apoderado = await Apoderado.update({
            CodigoPersona: persona.Codigo,
            Direccion: req.body.Direccion,
            Telefono: req.body.Telefono,
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
            apoderado,
        })
            
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    getApoderados,
    crearApoderado,
    actualizarApoderado,
}