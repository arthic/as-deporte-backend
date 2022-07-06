const path = require('path');
const {v4: uuidv4} = require('uuid')

const subirArchivo = (files, extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const {archivo} = files

        // Extenciones validas
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]
        if (!extencionesValidas.includes(extension)) {
            return reject(`La extension: ${extension} no es permitida, solo: ${extencionesValidas}`)
        }

        // Mover | Subir archivo
        // Crear id para el nombre
        const nombreTemp = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }

            resolve(nombreTemp)
        });
    })
}

module.exports = {subirArchivo}