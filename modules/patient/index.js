const express = require('express')
const patientController = require('./patient.controller')

const router = express.Router()

router.post('/register', patientController.registerPatient)

router.use(patientController.patientErrorHandler)

module.exports = router
