const schema = require('./patient.schema')
const validator = require('../../utils/schemaValidator')
const patientService = require('./patient.service')
const tokenHelper = require('../../utils/token')

const registerPatient = async (req, res, next) => {
  try {
    const patient = await validator.validate(schema.patientRegitserSchema, req.body)
    const newlyAddedPatient = await patientService.addPatient(patient)

    res.status(201).json({
      message: 'Patient registration successful',
      data: {
        patient: newlyAddedPatient
      }
    })
  } catch (err) {
    next(err)
  }
}

const patientLogin = async (req, res, next) => {
  try {
    const patient = await validator.validate(schema.patientLoginSchema, req.body)
    const tokens = await patientService.validatePatientLogin(patient)
    res.status(200).json({
      message: 'Login successful',
      data: {
        tokens
      }
    })
  } catch (err) {
    next(err)
  }
}

const refreshTokens = async (req, res, next) => {
  try {
    const receivedRefreshToken = req.headers.authorization
    if (receivedRefreshToken) {
      const refreshTokenData = await tokenHelper.verifyRefreshToken(receivedRefreshToken)
      const newTokenPair = await patientService.issueNewTokenPair(refreshTokenData)
      res.status(200).json({
        message: 'Success',
        data: {
          tokens: newTokenPair
        }
      })
    } else {
      res.status(401).send({
        error: 'Auhtnetication header not found in the request header.'
      })
    }
  } catch (err) {
    next(err)
  }
}

const patientErrorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'DbError':
      res.status(400).json({
        error: err.message
      })
      break
    case 'InvalidUser':
      res.status(401).json({
        error: err.message
      })
      break
    default:
      next(err)
  }
}

module.exports = {
  registerPatient,
  patientLogin,
  refreshTokens,
  patientErrorHandler
}
