const express = require('express')
const patientController = require('./patient.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/register', patientController.registerPatient)

router.post('/login', patientController.patientLogin)

router.post('/token/refresh', patientController.refreshTokens)

router.post('/test_route', authMiddleware(), (req, res, next) => { res.send('hit') })

router.use(patientController.patientErrorHandler)

module.exports = router
