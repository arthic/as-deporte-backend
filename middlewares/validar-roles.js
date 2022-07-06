const esAdminRol = (req, res, next) => {
    // Tenemos acceso al usuario ya que fue inyextada
    // en los headers e las validaciones anteriores "validar-jwt"

    // En caaaasoo que por alguna razon no existe
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere validar el token antes de validar el rol'
        })
    }
    const {rol, nombre} = req.usuario
    // Si no es admin rol
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador - peticiión inválida`
        })
    }

    next()
}

// expred en los argumentos une todo en un array
const tieneRole = (...roles) => {
    return (req, res, next) => {
        // En caaaasoo que por alguna razon no existe
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere validar el token antes de validar el rol'
            })
        }
        // Si en los roles no incluye el que estoy pidiendo
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        next()
    }
}

module.exports = {
    esAdminRol,
    tieneRole
}