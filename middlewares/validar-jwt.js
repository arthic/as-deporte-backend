const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario' )

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token')
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        // Obtenes el usuario que intenta borrar al otro usuario
        const usuario = await Usuario.findById(uid)
        // Si el usuario no existe
        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existente'
            })
        }
        /// Crear propiedad de usuario para mandar a los siguientes
        // next que permitiran leer en la res el usuario que cambio
        // el estado de otro usuario
        // req.uid = uid
        req.usuario = usuario
        req.uid = uid

        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}

module.exports = {
    validarJWT
}