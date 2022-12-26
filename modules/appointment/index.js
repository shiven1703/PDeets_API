const express = require('express')
const appointmentController = require('./appointment.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.get('/list', authMiddleware(), appointmentController.appointmentList)

module.exports = router
