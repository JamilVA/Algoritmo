const { ConceptoPago, Pago } = require('../config/relations');

const getPago = async(req,res) => {
    const pagos = await Pago.findAll({
        attributes: {
            exclude: ['CodigoEstudiante','CodigoConceptoPago'],
        },

            include: [{
                model: ConceptoPago,
                attributes: ['Concepto']
            }]

    })

    res.json({
        OK:true,
        pagos
    })
}

const crearPago = async(req, res) => {
    try {
        const pago = await Pago.create({
            Codigo: null,
            TipoPago: req.body.TipoPago,
            CodigoOperacion: req.body.CodigoOperacion,
            CodigoEstudiante: req.body.CodigoEstudiante,
            CodigoConceptoPago: req.body.CodigoConceptoPago,
        })
        res.json({
            OK: true,
            pago
        })
    } catch (error ) {
        console.error(error)
        
    }
   
}
module.exports = {
    getPago,
    crearPago,
}