const express = require('express')
const callbackRequestController = require('./callback-request.controlller')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.get('/reasons', authMiddleware(), callbackRequestController.getCallbackRequestReasons)

router.post('/add-call-request', authMiddleware(), callbackRequestController.addCallBackRequest)

router.get('/get-callback-requests', authMiddleware(), callbackRequestController.getAllCallBackRequests)

router.get('/:id', authMiddleware(), callbackRequestController.getAllCallBackRequestById)

router.put('/:id', authMiddleware(), callbackRequestController.updateAllCallBackRequestById)
module.exports = router
