const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
    const {correo, password} = req.body;

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            })
        }
        // Verificar la constraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password: false'
            })
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id)

        // Respuesta
        res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async (req, res) => {
    const {id_token} = req.body

    try {
        const {nombre, img, correo} = await googleVerify(id_token)
        let usuario = await Usuario.findOne({correo})

        // Si no existe
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: 'xD',
                img,
                google: true
            }
            usuario = new Usuario(data)
            await usuario.save()
        }
        // Si es usuario esta en false
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el ADMIN - usuario bloqueado.'
            })
        }
        // Si ya llego hasta aca entonces hay que validar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo validar.'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}