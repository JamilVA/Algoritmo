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
module.exports = {
    getDocentes,
}