const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')

const usuariosGet = async (req, res) => {
    // const {q, nombre = "no name", apikey, limit = 1, page} = req.query
    const {limite = 5, desde = 0} = req.query
    const estado = {estado: true}

    // const usuarios = await Usuario.find(estado)
    //     .skip(desde)
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(estado)

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(estado),
        Usuario.find(estado)
            .skip(desde)
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res) => {

    const {
        nombre, correo, password, imagen,
        direccion, ciudad, pais, telefono,
        notas
    } = req.body
    const usuario = new Usuario(req.body)

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    // Guardar DB
    await usuario.save({
        nombre,
        correo,
        password,
        imagen,
        direccion,
        ciudad,
        pais,
        telefono,
        notas
    })

    res.json({
        ok: true,
        usuario
    })
}

const usuariosPut = async (req, res) => {
    const {id} = req.params
    // Filtrar password, _id & google
    const {_id, password, google, correo, ...resto} = req.body

    // Validar vs BD
    if (password) {
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)
    console.log(usuario);

    res.json(usuario)
}

const usuariosPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - usuariosPatch'
    })
}
const usuariosDelete = async (req, res) => {
    const {id} = req.params
    const parseId = Number(id)

    // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)

    // Cambiar estado
    const usuario = await Usuario.findByIdAndUpdate(parseId, {estado: false})
    //Viene de la propiedad creada en el validar-jwt
    // const usuarioAutenticado = req.usuario

    // res.json({usuario, usuarioAutenticado})
    res.json(usuario)
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}