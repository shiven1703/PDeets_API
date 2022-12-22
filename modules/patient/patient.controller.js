const schema = require('./patient.schema')
const validator = require('../../utils/schemaValidator')
const patientService = require('./patient.service')

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

const patientErrorHandler = (err, req, res, next) => {
  if (err.name === 'DbError') {
    res.status(400).json({
      error: err.message
    })
  } else {
    next(err)
  }
}

module.exports = {
  registerPatient,
  patientErrorHandler
}
