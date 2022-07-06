const Categoria = require("../models/categoria");
const Usuario = require('../models/usuario')

// Obtener categorias
/*
    Forma paginada -el total
    Uso de populate para saber quien es el usuario que
    hice la ultima modificación en la categoría
*/
const obtenerCategorias =  async(req, res) => {
    // const {q, nombre = "no name", apikey, limit = 1, page} = req.query
    const {limite = 5, desde = 0} = req.query
    const estado = {estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(estado),
        Categoria.find(estado)
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

// Obtener categoria - con populate
const obtenerCategoria = async (req, res) => {
    const {id} = req.params
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json({
        categoria
    })
}

const crearCategoria = async (req, res) => {
    // el req.usuario viene del validarJWT
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe.`
        })
    }
    // Datos a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data)
    //Guardar DB
    await categoria.save()
    res.status(201).json(categoria)
}

// Actualizar categoria
const actualizarCategoria = async (req, res) => {
    const {id} = req.params
    // req.usuario.notas = req.body
    const {_id, password, correo, ...resto} = req.usuario

    const usuario = await Usuario.findByIdAndUpdate(_id, req.body)
    const currentUsuario = await Usuario.findById(_id)

    res.status(201).json({
        ok: true,
        currentUsuario
    })
}

// Borrar categoría
const borrarCategoria = async (req, res) => {
    const {id} = req.params
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({categoriaBorrada})
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}