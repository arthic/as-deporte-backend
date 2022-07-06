const {Router} = require('express')
const {check} = require('express-validator')
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../constrollers/categorias')
const { existeCategoriaPorId } = require('../helpers/db-validators')
const {
    validarCampos,
    validarJWT,
    esAdminRol,
} = require('../middlewares')

const router = Router()
// /api/categorias

// Obtener todas las categorias - es publico
router.get('/', obtenerCategorias)

// Obtener una categoria
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria)

// Crear categoría - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,crearCategoria)

// Actualizar registro por id
router.put('/:id', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('id', 'No es un id de Mongo válido'),
    // check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria)

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria)

module.exports = router