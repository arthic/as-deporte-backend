const {Schema, model} = require('mongoose')

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

// Quitar password de la resp
CategoriaSchema.methods.toJSON = function() {
    // Quitando version el resto es enviado a la res
    const {__v, estado, ...categoria} = this.toObject();
    // Solo retornamos el lo demas de la categoria
    return categoria
}

module.exports = model('Categoria', CategoriaSchema)