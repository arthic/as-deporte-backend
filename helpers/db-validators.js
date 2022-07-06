const Role = require('../models/role')
const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
        // Error personalizado en express validator
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        // Error personalizado en express validator
        throw new Error(`El correo ${correo}, ya esta registrado.`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        // Error personalizado en express validator
        throw new Error(`El id: ${id}, no existe.`)
    }
}

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        // Error personalizado en express validator
        throw new Error(`El id: ${id}, no existe.`)
    }
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        // Error personalizado en express validator
        throw new Error(`El id: ${id}, no existe.`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)

    if(!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, solo: ${colecciones}`)
    }
    return true
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}