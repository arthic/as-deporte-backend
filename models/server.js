const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT

        this.app.get('/*', function(req, res) {
            res.sendFile(path.join(__dirname, '..', 'public/index.html'), function(err) {
                if (err) {
                    res.status(500).send(err)
                }
            })
        })

        // PATHS
        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads',
            notas: '/api/notes'
        }

        // Coneccion DB
        this.conectarDB()
        // Middlewares
        this.middlewares()
        // Rutas
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use(cors())
        // Directorio publico
        this.app.use(express.static('public'))
        // Lectura y parseo del body
        this.app.use(express.json())
        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            // Crea la carpeta si no existe
            createParentPath: true
        }))
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use(this.paths.notas, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        })
    }
}

module.exports = Server