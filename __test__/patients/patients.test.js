const { db } = require('../setup').database
const patientService = require('../../modules/patient/patient.service')

describe('Registration', () => {
  let patient = null
  let newlyAddedPatient = null

  beforeAll(async () => {
    patient = {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      phoneNumber: '+491245226985',
      gender: 'male',
      dateOfBirth: '1994-11-05 13:15:30+00',
      password: 'test'
    }
  })

  afterAll(async () => {
    await db.patient.destroy({
      where: {
        id: newlyAddedPatient.id
      }
    })
  })

  test('Is registration successful', async () => {
    newlyAddedPatient = await patientService.addPatient(patient)

    expect(newlyAddedPatient).toMatchObject({
      id: expect.any(String)
    })
  })
})

describe('Login', () => {
  let patient = null
  let newlyAddedPatient = null

  beforeAll(async () => {
    patient = {
      firstName: 'test',
      lastName: 'user',
      email: 'test@user.com',
      phoneNumber: '+491245226985',
      gender: 'male',
      dateOfBirth: '1994-11-05 13:15:30+00',
      password: 'test'
    }
  })

  afterAll(async () => {
    await db.patient.destroy({
      where: {
        id: newlyAddedPatient.id
      }
    })
  })

  test('Is login successful', async () => {
    newlyAddedPatient = await patientService.addPatient(patient)
    const loginResponse = await patientService.validatePatientLogin({
      email: null,
      phoneNumber: newlyAddedPatient.phone_number,
      password: patient.password
    })

    expect(loginResponse).toMatchObject({
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      },
      foundPatient: expect.any(Object)
    })
  })
})
