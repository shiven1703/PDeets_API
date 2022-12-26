const appointmentService = require('./appointment.service')

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

module.exports = {
  appointmentList
}
