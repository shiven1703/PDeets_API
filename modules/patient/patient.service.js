// model imports
const { db } = require('../../db')

// lib imports
const { DateTime } = require('luxon')
const config = require('config')
const otpGenerator = require('otp-generator')

// helpers imports
const encrypter = require('../../utils/encryption')
const tokenHelper = require('../../utils/token')
const mailer = require('../../utils/mailer')
const { PasswordActionEnum } = require('../../utils/enums')

// custom errors
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

    let foundPatient = await db.patient.findOne({
      where: findQuery
    })

    if (foundPatient) {
      const isPasswordValid = await validatePatientPassword(password, foundPatient.password)
      if (isPasswordValid) {
        const tokens = await generateTokens(foundPatient.id)
        await updatePatientLastLogin(foundPatient.id)

        foundPatient = foundPatient.toJSON()
        delete foundPatient.password

        return {
          tokens,
          foundPatient
        }
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

const updatePatientLastLogin = async (patientId) => {
  await db.patient.update({ last_login: DateTime.now().setZone(config.get('app.timezone')).toISO() }, {
    where: {
      id: patientId
    }
  })
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

const performPasswordAction = async ({ action, email, phoneNumber, suppliedValidationCode, actualValidationCode, oldPassword, newPassword }) => {
  const findQuery = email ? { email } : { phone_number: phoneNumber }

  const foundPatient = await db.patient.findOne({
    where: findQuery
  })

  if (!foundPatient) { throw new DatabaseError('Invalid email or phone number supplied.') }

  switch (action) {
    // change password
    case PasswordActionEnum.change_password:{
      if (!(oldPassword && newPassword)) { throw new DatabaseError('Missing oldpassword or newPassword param') }
      // checking if old password is valid
      if (await validatePatientPassword(oldPassword, foundPatient.password)) {
        // updating password
        await db.patient.update({
          password: await encrypter.makeHash(newPassword)
        }, { where: findQuery })
        return 'Password successfully updated'
      } else {
        throw new DatabaseError('Invalid old password.')
      }
    }
    // password reset token generation
    case PasswordActionEnum.get_password_reset_token: {
      const validationCode = await generateResetPasswordValidationCode()
      const passwordResetToken = tokenHelper.generatePasswordResetToken({
        patientId: foundPatient.id,
        email: foundPatient.email,
        phoneNumber: foundPatient.phone_number,
        validationCode
      })
      // sending email with validation code
      await mailer.sendEmail(foundPatient.email, 'PDeets: Password reset code', `<h3>Reset Code : ${validationCode}</h3>`)
      return passwordResetToken
    }
    // resetting password using reset token
    case PasswordActionEnum.reset_password: {
      if (suppliedValidationCode === actualValidationCode) {
        await db.patient.update({
          password: await encrypter.makeHash(newPassword)
        }, { where: findQuery })
        return 'Password reset successful. Please login again using new password'
      } else {
        throw new DatabaseError('Invalid reset password validation code received.')
      }
    }

    default:
      throw new DatabaseError('Invalid password action requested.')
  }
}

const generateResetPasswordValidationCode = async () => {
  const otp = otpGenerator.generate(5, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
  return otp
}

module.exports = {
  addPatient,
  validatePatientLogin,
  issueNewTokenPair,
  performPasswordAction
}
