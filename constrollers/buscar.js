const {response} = require('express')
const {ObjectId} = require("mongoose").Types
const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res) => {
    const esMongoId = ObjectId.isValid(termino)

    if(esMongoId) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    // hacer la busqueda agnostica a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')
    const usuario = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })
    res.json({
        results: (usuario) ? [usuario] : []
    })
}

const buscarCategorias = async (termino = '', res) => {
    const esMongoId = ObjectId.isValid(termino)

    if(esMongoId) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    // hacer la busqueda agnostica a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')
    const categoria = await Categoria.find({nombre: regex, estado: true})
    res.json({
        results: (categoria) ? [categoria] : []
    })
}

const buscarProductos = async (termino = '', res) => {
    const esMongoId = ObjectId.isValid(termino)

    if(esMongoId) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    // hacer la busqueda agnostica a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')
    const productos = await Producto.find({nombre: regex, estado: true})
        .populate('categoria', 'nombre')
    res.json({
        results: (productos) ? [productos] : []
    })
}

const buscar = (req, res) => {
    const {coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break
        case 'categorias':
            buscarCategorias(termino, res)
            break
        case 'productos':
            buscarProductos(termino, res)
            break
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
    }
}

module.exports = {
    buscar
}