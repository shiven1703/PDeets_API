const express = require('express')
const appointmentController = require('./appointment.controller')
const authMiddleware = require('../../middleware/auth')
const cors = require('cors')

const router = express.Router()

router.get('/list', authMiddleware(), appointmentController.appointmentList)

console.log('inside index.js')

router.delete('/:id', authMiddleware(), appointmentController.deleteAppointment)

router.get('/locations', authMiddleware(), appointmentController.locations)

router.get('/departments', authMiddleware(), appointmentController.departments)

router.get('/doctors', authMiddleware(), appointmentController.doctors)

router.use(appointmentController.locationModuleErrorHandler)
router.use(cors())

module.exports = router
