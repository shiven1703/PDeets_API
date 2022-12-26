// const schema = require('./appointment.schema')
// const validator = require('../../utils/schemaValidator')
const appointmentService = require('./appointment.service')
// const tokenHelper = require('../../utils/token')
// const { PasswordActionEnum } = require('../../utils/enums')

const appointmentList = async (req, res, next) => {
  console.log('inside appointmentList')
  try {
    const patientId = req.patient.patientId
    console.log(patientId)
    const patientAppointmentList = await appointmentService.showAppointments(patientId)
    res.status(201).json({
      message: 'Patient appointment list fetched successful',
      data: {
        list: patientAppointmentList
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  appointmentList
}
