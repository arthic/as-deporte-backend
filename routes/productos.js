const {Router} = require('express')
const {check} = require('express-validator')
const {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
} = require('../constrollers/productos')
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators')
const {
    validarCampos,
    validarJWT,
    esAdminRol,
} = require('../middlewares')

const router = Router()
// /api/categorias

// Obtener todos los productos - es publico
router.get('/', obtenerProductos)

// Obtener un producto
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

// Crear producto - Privado | cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
] ,crearProducto)

// Actualizar registro producto por id
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)

// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

module.exports = router