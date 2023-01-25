const express = require('express')
const medicationController = require('./medication.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/reminder', authMiddleware(), medicationController.addReminder)

router.get('/reminder', authMiddleware(), medicationController.getReminders)

module.exports = router
