const express = require('express')
const appointmentController = require('./appointment.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.get('/list', authMiddleware(), appointmentController.appointmentList)

router.get('/locations', authMiddleware(), appointmentController.locations)

router.use(appointmentController.locationModuleErrorHandler)

module.exports = router
