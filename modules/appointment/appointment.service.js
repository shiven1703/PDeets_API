// model imports
const { db } = require('../../db')

// lib imports
// const { DateTime } = require('luxon')
// const config = require('config')

// helpers imports
// const encrypter = require('../../utils/encryption')
// const tokenHelper = require('../../utils/token')
// const mailer = require('../../utils/mailer')
// const { PasswordActionEnum } = require('../../utils/enums')

// custom errors
const {
  DatabaseError,
  UnknownServerError
} = require('../../utils/customErrors')

const showAppointments = async (patientId) => {
  console.log('inside showappointment')
  try {
    // const findQuery = email ? { email } : { phone_number: phoneNumber }
    const listOfAppointments = await db.appointment.findAll({
      where: {
        patient_id: patientId
      }
    })

    if (listOfAppointments) {
      return {
        listOfAppointments
      }
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
