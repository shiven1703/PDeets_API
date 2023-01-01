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

const doctorSchedule = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.doctorScheduleSchema, req.body)
    const { doctorSchedule, unavailableSlots } = await appointmentService.getDoctorSchedule(params)
    doctorSchedule.unavailableSlots = unavailableSlots
    res.status(200).json({
      message: 'Doctor schedule fecthed successfully',
      data: {
        schedule: doctorSchedule[0],
        unavailableSlots
      }
    })
  } catch (err) {
    next(err)
  }
}

const questionnaire = async (req, res, next) => {
  try {
    const questionnaireList = await appointmentService.getQuestionnaire()
    res.status(200).json({
      message: 'Questionnaire fetched successfully',
      data: {
        questionnaire: questionnaireList
      }
    })
  } catch (err) {
    next(err)
  }
}

const bookAppointment = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.appointmentBookingSchema, req.body)
    const bookedAppointment = await appointmentService.bookAppointment(params)
    res.status(200).json({
      message: 'Appointment booked.',
      data: {
        appointment: bookedAppointment
      }
    })
  } catch (err) {
    next(err)
  }
}

const locationModuleErrorHandler = (err, req, res, next) => {
  console.log(err)
  switch (err.name) {
    case 'DbError':
      res.status(400).json({
        error: err.message
      })
      break
    default:
      next(err)
  }
}

module.exports = {
  appointmentList,
  locations,
  departments,
  doctors,
  doctorSchedule,
  questionnaire,
  bookAppointment,
  locationModuleErrorHandler
}
