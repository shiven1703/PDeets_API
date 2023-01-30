const express = require('express')
const reportController = require('./reports.controller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/lab', reportController.uploadReport)

router.get('/lab', authMiddleware(), reportController.getReports)

router.use(reportController.reportModuleErrorHandler)

module.exports = router
