const validarCampos = require('../middlewares/validar-campos')
const validarJWT = require('../middlewares/validar-jwt')
const validaRoles = require('../middlewares/validar-roles')

// Extrae todo lo que exporta cada middleware
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}