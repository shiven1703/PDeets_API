const express = require('express')
const appointmentController = require('./appointment.controller')
const authMiddleware = require('../../middleware/auth')
const cors = require('cors')
const auth = require('../../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware(), appointmentController.appointmentList)

router.put('/:id', authMiddleware(), appointmentController.updateAppointment)

router.delete('/:id', authMiddleware(), appointmentController.deleteAppointment)

router.post('/locations', authMiddleware(), appointmentController.locations)

router.post('/departments', authMiddleware(), appointmentController.departments)

router.post('/doctors', authMiddleware(), appointmentController.doctors)

router.post('/doctor/availability', authMiddleware(), appointmentController.doctorSchedule)

router.post('/questionnaire', authMiddleware(), appointmentController.questionnaire)

router.post('/', authMiddleware(), appointmentController.bookAppointment)

router.use(appointmentController.locationModuleErrorHandler)
router.use(cors())

module.exports = router
