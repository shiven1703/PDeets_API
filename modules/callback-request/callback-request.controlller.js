const schema = require('./callback-request.schema')
const validator = require('../../utils/schemaValidator')
const callBackRequestService = require('./callback-request.service')

const addCallBackRequest = async (req, res, next) => {
  try {
    const callRequestBody = await validator.validate(
      schema.callBackRequestSchema,
      req.body
    )
    await callBackRequestService.addCallRequest(req.patient.id, callRequestBody)
    res.status(201).json({
      message: 'Request of callback is sent successfully'
    })
  } catch (err) {
    next(err)
  }
}

const getAllCallBackRequests = async (req, res, next) => {
  try {
    await validator.validate(
      schema.callBackRequestSchema,
      req.body
    )
    await callBackRequestService.getAllCallRequest()
    res.status(200).json({
      message: 'Request of callback is sent successfully'
    })
  } catch (err) {
    next(err)
  }
}

const getAllCallBackRequestById = async (req, res, next) => {
  try {
    await validator.validate(
      schema.callBackRequestSchema,
      req.body
    )
    await callBackRequestService.getAllCallRequestById(req.patient.id)
    res.status(200).json({
      message: 'Request of callback is sent successfully'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addCallBackRequest,
  getAllCallBackRequests,
  getAllCallBackRequestById
}
