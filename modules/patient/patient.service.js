// model imports
const { db } = require('../../db')

// helpers imports
const encrypter = require('../../utils/encryption')
const { DatabaseError } = require('../../utils/customErrors')

const addPatient = async ({ firstName, lastName, email, phoneNumber, gender, dateOfBirth, password }) => {
  try {
    const newPatient = db.patient.build({
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      gender,
      date_of_birth: dateOfBirth,
      password
    })

    // encrypting password and saving patient details to the db
    newPatient.password = await encrypter.makeHash(newPatient.password)
    await newPatient.save()

    // returning saved patient
    const newlyAddedPatient = newPatient.toJSON()
    delete newlyAddedPatient.password

    return newlyAddedPatient
  } catch (err) {
    // handling unique db error - need unique phone number
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(err.errors[0].message)
    } else {
      throw err
    }
  }
}

module.exports = {
  addPatient
}
