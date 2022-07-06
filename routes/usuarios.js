const {Router} = require('express')
const {check} = require('express-validator')
const router = Router()
const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
} = require('../constrollers/usuarios')

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')
// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt')
// const { esAdminRol, tieneRole } = require('../middlewares/validar-roles')
const {
    validarCampos,
    validarJWT,
    esAdminRol,
    tieneRole
} = require('../middlewares')

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 letras').isLength({min:6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost)

router.patch('/', usuariosPatch)

router.delete('/:id', [
    validarJWT,
    // esAdminRol,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)

module.exports = router