const {Schema, model} = require('mongoose')

const ProductoSchema = Schema({
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
    },
    precio: {
        type: Number,
        default: 0
    },
    // Relación con las categorias
    categoria : {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {type: String},
    disponible: {type: String, default: true},
    img: {type: String}
})

// Quitar password de la resp
ProductoSchema.methods.toJSON = function() {
    // Quitando version el resto es enviado a la res
    const {__v, estado, ...producto} = this.toObject();
    // Solo retornamos el lo demas de la categoria
    return producto
}

module.exports = model('Producto', ProductoSchema)