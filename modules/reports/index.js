const express = require('express')
const reportController = require('./reports.controller')

const router = express.Router()

router.post('/lab', reportController.uploadReport)

router.use(reportController.reportModuleErrorHandler)

module.exports = router
