const express = require('express')
const medicationController = require('./medication.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/', authMiddleware(), medicationController.addReminder)

module.exports = router
