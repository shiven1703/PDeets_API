const appointmentService = require('./appointment.service')
const validator = require('../../utils/schemaValidator')
const schema = require('./appointment.schema')

const appointmentList = async (req, res, next) => {
  try {
    const patientId = req.patient.id
    const patientAppointmentList = await appointmentService.showAppointments(patientId)
    res.status(200).json({
      message: 'Patient appointment list fetched successful',
      data: {
        appointments: patientAppointmentList
      }
    })
  } catch (err) {
    next(err)
  }
}

const updateAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id
    // const params = await validator.validate(schema.doctorListSchema, req.body)
    await appointmentService.changeAppointmentData(appointmentId, req.body)
    res.status(200).json({
      message: 'Successfully updated appointment data'
    })
  } catch (err) {
    next(err)
  }
}

const deleteAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id
    await appointmentService.removeAppointmentData(appointmentId)
    res.status(200).json({
      message: 'appoinment data deleted successfully'
    })
  } catch (err) {
    next(err)
  }
}

const locations = async (req, res, next) => {
  try {
    const filterBy = await validator.validate(schema.locationSchema, req.body)
    const locationList = await appointmentService.getLocations(filterBy)
    res.status(200).json({
      message: 'Successfully fetched locations',
      data: {
        locations: locationList
      }
    })
  } catch (err) {
    next(err)
  }
}

const departments = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.departmentSchema, req.body)
    const departments = await appointmentService.getDepartments(params)
    res.status(200).json({
      message: 'Successfully fetched departments',
      data: departments
    })
  } catch (err) {
    next(err)
  }
}

const doctors = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.doctorListSchema, req.body)
    const doctors = await appointmentService.getDoctors(params)
    res.status(200).json({
      message: 'Successfully fetched doctors',
      data: {
        doctors
      }
    })
  } catch (err) {
    next(err)
  }
}

const locationModuleErrorHandler = (err, req, res, next) => {
  console.log(err)
  next(err)
}

module.exports = {
  appointmentList,
  updateAppointment,
  deleteAppointment,
  locations,
  departments,
  doctors,
  locationModuleErrorHandler
}
