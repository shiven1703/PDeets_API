// model imports
const { db } = require('../../db')

// // lib imports
// const { DateTime } = require('luxon')
// const config = require('config')
// const otpGenerator = require('otp-generator')

// helpers imports
// const encrypter = require('../../utils/encryption')

// custom errors
const {
  DatabaseError
//   InvalidUser,
//   UnknownServerError
} = require('../../utils/customErrors')

const getCallbackRequestReasons = async () => {
  const reasons = await db.callback_reason.findAll({
    raw: true
  })
  return reasons
}

const addCallRequest = async (patientId, {
  callbackReasonId,
  preferredContactOption,
  preferredTime,
  isSevere,
  remark,
  status
}) => {
  try {
    const newCallBackRequest = await db.callback_requests.build({
      patient_id: patientId,
      callback_reason_id: callbackReasonId,
      preferred_contact_option: preferredContactOption,
      preferred_time: preferredTime,
      is_severe: isSevere,
      remark,
      status
    })
    await newCallBackRequest.save()
    const newlyAddedCallRequest = newCallBackRequest.toJSON()
    return newlyAddedCallRequest
  } catch (err) {
    // handling unique db error - need unique phone number
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        `call request already exist. ${err.errors[0].message}`
      )
    } else {
      throw err
    }
  }
}

const getAllCallRequest = async () => {
  try {
    const allCallBackRequest = await db.callback_request.findAll({
      include: [{
        model: db.callback_reason
      }]
    })
    return allCallBackRequest
  } catch (err) {
    // handling unique db error - need unique phone number
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        `call request doesn't exist. ${err.errors[0].message}`
      )
    } else {
      throw err
    }
  }
}

const getAllCallRequestById = async (patientId) => {
  try {
    const allCallBackRequest = await db.callback_request.findAll({
      where: {
        patient_id: patientId
      },
      include: [{
        model: db.callback_reason
      }]
    })
    return allCallBackRequest
  } catch (err) {
    // handling unique db error - need unique phone number
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        `call request doesn't exist. ${err.errors[0].message}`
      )
    } else {
      throw err
    }
  }
}

const updateAllCallRequestById = async (patientId) => {
  try {
    const allCallBackRequest = await db.callback_request.findAll({
      where: {
        patient_id: patientId
      },
      include: [{
        model: db.callback_reason
      }]
    })
    return allCallBackRequest
  } catch (err) {
    // handling unique db error - need unique phone number
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        `call request doesn't exist. ${err.errors[0].message}`
      )
    } else {
      throw err
    }
  }
}

module.exports = {
  getCallbackRequestReasons,
  addCallRequest,
  getAllCallRequest,
  getAllCallRequestById,
  updateAllCallRequestById
}
