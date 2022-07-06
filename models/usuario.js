const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type: 'string',
        required: [true, 'El nombre es obligatorio'],
    },
    correo : {
        type: 'string',
        required: [true, 'Correo es obligatorio'],
        unique: true,
    },
    password : {
        type: 'string',
        required: [true, 'Contraseña es obligatoria'],
    },
    imagen : {
        type: 'string',
    },
    direccion : {
        type: 'string',
    },
    ciudad : {
        type: 'string',
    },
    pais : {
        type: 'string',
    },
    telefono : {
        type: 'string',
    },
    notas: [{
        id: Number,
        title: 'string',
        content: 'string',
        noteImg: 'string'
    }]
    // img: {type: String}
})

// Quitar password de la resp
UsuarioSchema.methods.toJSON = function() {
    // Quitando version y password de la res y el resto es enviado a la res
    const {__v, password, _id, ...usuario} = this.toObject();
    // La res va ser uid en lugar de _id
    usuario.uid = _id;
    // Solo retornasmos el usuario
    return usuario
}

module.exports = model('Usuario', UsuarioSchema)