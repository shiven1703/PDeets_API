const express = require('express')
const requestCallbackController = require('./callback-request.controlller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/add-call-request', authMiddleware(), requestCallbackController.addCallBackRequest)

router.get('/get-callback-requests', authMiddleware(), requestCallbackController.getAllCallBackRequests)

router.get('/:id', authMiddleware(), requestCallbackController.getAllCallBackRequestById)

router.put('/:id', authMiddleware(), requestCallbackController.updateAllCallBackRequestById)
module.exports = router
