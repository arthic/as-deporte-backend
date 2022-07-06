const {Router} = require('express')
const router = Router()
const { buscar } = require('../constrollers/buscar')

router.get('/:coleccion/:termino', buscar)

module.exports = router