const Producto = require("../models/producto");

// Obtener productos
/*
    Forma paginada -el total
    Uso de populate para saber quien es el usuario que
    hice la ultima modificación en la categoría
*/
const obtenerProductos =  async(req, res) => {
    // const {q, nombre = "no name", apikey, limit = 1, page} = req.query
    const {limite = 5, desde = 0} = req.query
    const estado = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(estado),
        Producto.find(estado)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

// Obtener producto - con populate
const obtenerProducto = async (req, res) => {
    const {id} = req.params
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    res.json({
        producto
    })
}

const crearProducto = async (req, res) => {
    // el req.usuario viene del validarJWT y sacar estado, usuario
    const {estado, usuario, ...body} = req.body
    const productoDB = await Producto.findOne({nombre: body.nombre})

    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe.`
        })
    }
    // Datos a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto(data)
    //Guardar DB
    await producto.save()
    res.status(201).json(producto)
}

// Actualizar producto
const actualizarProducto = async (req, res) => {
    const {id} = req.params
    const {estado, usuario, ...data} = req.body

    // Si viene el nombre en el body
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }
    // Poner al ultimo usuario que modifico la categoria
    data.usuario = req.usuario._id

    // new true hace que la info actualizada se muestre en la res
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

    res.json({
        producto
    })
}

// Borrar categoría
const borrarProducto = async (req, res) => {
    const {id} = req.params
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({productoBorrado})
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}