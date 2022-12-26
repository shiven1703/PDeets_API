const express = require('express')
const appointmentController = require('./appointment.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()
console.log('inside appointment index')
router.get('/list', authMiddleware(), appointmentController.appointmentList)
// router.use()

module.exports = router
