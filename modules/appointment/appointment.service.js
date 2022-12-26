// model imports
const { db } = require('../../db')

// lib imports

// helpers imports

// custom errors
const {
  DatabaseError,
  UnknownServerError
} = require('../../utils/customErrors')

const showAppointments = async (patientId) => {
  console.log('inside showappointment')
  try {
    const listOfAppointments = await db.appointment.findAll({
      where: {
        patient_id: patientId
      }
    })

    if (listOfAppointments) {
      return listOfAppointments
    } else throw new DatabaseError('Something wrong with Database Operation')
  } catch (err) {
    if (!err.name === 'InvalidUser') {
      throw new UnknownServerError()
    } else {
      throw err
    }
  }
}

module.exports = {
  showAppointments
}
