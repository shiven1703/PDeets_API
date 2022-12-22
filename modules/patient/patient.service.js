// model imports
const { db } = require('../../db')

// helpers imports
const encrypter = require('../../utils/encryption')
const tokenHelper = require('../../utils/token')
const { DatabaseError, InvalidUser, UnknownServerError } = require('../../utils/customErrors')

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
      throw new DatabaseError(`Patient account already exist with the given phone number. ${err.errors[0].message}`)
    } else {
      throw err
    }
  }
}

const validatePatientLogin = async ({ email = null, phoneNumber = null, password }) => {
  try {
    const findQuery = email ? { email } : { phone_number: phoneNumber }

    const foundPatient = await db.patient.findOne({
      where: findQuery
    })
    if (foundPatient) {
      const isPasswordValid = await validatePatientPassword(password, foundPatient.password)
      if (isPasswordValid) {
        const tokens = generateTokens(foundPatient.id)
        return tokens
      }
    }
    throw new InvalidUser('Invalid username or password.')
  } catch (err) {
    if (!err.name === 'InvalidUser') {
      throw new UnknownServerError()
    } else {
      throw err
    }
  }
}

const validatePatientPassword = async (password, passwordHash) => {
  const isValidPassword = await encrypter.validateHash(
    password,
    passwordHash
  )
  return isValidPassword
}

const generateTokens = async (patientId) => {
  const accessToken = await tokenHelper.generateAccessToken({
    patientId
  })

  const refreshToken = await tokenHelper.generateRefreshToken({
    patientId
  })

  return {
    accessToken,
    refreshToken
  }
}

const issueNewTokenPair = async ({ patientId }) => {
  const newTokens = await generateTokens(patientId)
  return newTokens
}

module.exports = {
  addPatient,
  validatePatientLogin,
  issueNewTokenPair
}
