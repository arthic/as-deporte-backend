const {Router} = require('express')
const {check} = require('express-validator')
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenClouddinary } = require('../constrollers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarArchivoSubir } = require('../middlewares/validar-archivo')
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router()

router.post('/', validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
// ], actualizarImagen)
], actualizarImagenClouddinary)

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
], mostrarImagen)

module.exports = router