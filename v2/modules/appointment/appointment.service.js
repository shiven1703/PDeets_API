// model imports
const { db, sequelize } = require('../../db')

// lib imports
const { Op, QueryTypes } = require('sequelize')

// helpers imports
const luxon = require('luxon')
const tokenHelper = require('../../utils/token')
const axios = require('axios')
const { sendPushNotification } = require('../push-notification/push-notification.service')
// custom errors
const {
  DatabaseError,
  UnknownServerError
} = require('../../utils/customErrors')

const showAppointments = async (patientId) => {
  try {
    const listOfAppointments = await db.appointment.findAll({
      attributes: ['id', 'appointment_time', 'appointment_duration', 'questionary_answers', 'status', 'prescription_image_url'],
      where: {
        patient_id: patientId
      },
      include: [{
        model: db.location
      }, {
        model: db.department
      }, {
        model: db.doctor
      }, {
        model: db.patient,
        attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'gender', 'date_of_birth', 'last_login', 'image_url']
      }]
    })
    return listOfAppointments
  } catch (err) {
    if (!err.name === 'InvalidUser') {
      throw new UnknownServerError()
    } else {
      throw err
    }
  }
}

const sendAppointmentReminder = async () => {
  try {
    const query = `SELECT appointments.id as appointment_id, patients.first_name, patients.last_name, device_tokens.device_token FROM appointments
    LEFT JOIN patients ON patients.id = appointments.patient_id
    LEFT JOIN device_tokens ON device_tokens.patient_id = patients.id
    WHERE appointment_time >= '${luxon.DateTime.now().startOf('day').toString()}' AND appointment_time <= '${luxon.DateTime.now().endOf('day').toString()}';`

    const appointments = await sequelize.query(query, { type: QueryTypes.SELECT })

    await Promise.all(appointments.map(async (appointment) => {
      await sendPushNotification('Appointment reminder', `Hello ${appointment.first_name}, you have an appointment today.`, appointment.device_token, {
        appointmentId: appointment.appointment_id
      })
    }))
    console.log('Appointment reminder cron ran...')
  } catch (err) {
    console.log(err)
  }
}

const generateAppointmentQR = async (appointmentId) => {
  const appointment = await db.appointment.findOne({ where: { id: appointmentId } })
  if (appointment) {
    const token = await tokenHelper.generateAppointmentQrToken({
      appointment: appointment.id
    })
    return {
      token
    }
  } else {
    throw new DatabaseError('Invalid appointment id.')
  }
}

const getLocations = async ({ filterBy }) => {
  try {
    const locationRequest = await axios.get(process.env.KIELSTEIN_API + '/locations')
    return locationRequest.data
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDepartments = async ({ locationId, filterBy }) => {
  try {
    let locations = []

    if (filterBy) {
      locations = await db.location.findAll({
        attributes: [],
        where: { id: locationId },
        include: [{
          model: db.department,
          attributes: ['id', 'name', 'description', 'image_url'],
          where: {
            [Op.or]: [{
              name: {
                [Op.iLike]: `%${filterBy}%`
              }
            },
            {
              description: {
                [Op.iLike]: `%${filterBy}%`
              }
            }]
          },
          through: {
            attributes: []
          }
        }]
      })
    } else {
      locations = await db.location.findAll({
        attributes: [],
        where: { id: locationId },
        include: [{
          model: db.department,
          attributes: ['id', 'name', 'description', 'image_url'],
          through: {
            attributes: []
          }
        }]
      })
    }

    return locations[0] ? locations[0] : { departments: [] }
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDoctors = async ({ locationId, departmentId, filterBy }) => {
  try {
    const doctorsRequest = await axios.get(process.env.KIELSTEIN_API + `/doctors?locationId=${locationId}`)
    return doctorsRequest.data
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDoctorSchedule = async ({ locationId, departmentId, doctorId }) => {
  try {
    const doctorSchedule = await db.doctor_schedule.findAll({
      where: {
        doctor_id: doctorId
      }
    })

    const unavailableSlots = await getDoctorUnavailableSlots({ locationId, departmentId, doctorId })
    return {
      doctorSchedule,
      unavailableSlots
    }
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getDoctorUnavailableSlots = async ({ locationId, departmentId, doctorId }) => {
  try {
    const bookedAppointments = await db.appointment.findAll({
      where: {
        location_id: locationId,
        department_id: departmentId,
        doctor_id: doctorId
      },
      raw: true
    })

    const unavailableSlots = []
    bookedAppointments.forEach((appointment) => {
      unavailableSlots.push({
        date: new Date(appointment.appointment_time).toISOString().split('T')[0],
        time: new Date(appointment.appointment_time).toLocaleTimeString('en-GB'),
        duration: appointment.appointment_duration
      })
    })

    return unavailableSlots
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const getQuestionnaire = async () => {
  try {
    const questionList = await db.question.findAll({
      attributes: ['question'],
      include: [{
        model: db.question_option,
        attributes: ['option']
      }]
    })
    return questionList
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const bookAppointment = async ({ locationId, departmentId, doctorId, patientId, appointmentTime, appointmentDuration = 30, questionaryAnswer, status = 'pending' }) => {
  try {
    const bookedAppointment = await db.appointment.create({
      location_id: locationId,
      department_id: departmentId,
      doctor_id: doctorId,
      patient_id: patientId,
      appointment_time: appointmentTime,
      appointment_duration: appointmentDuration,
      questionary_answers: questionaryAnswer,
      status
    })
    return bookedAppointment
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

const updateAppointment = async ({ appointmentId, patientId, ...updatedAppointmentdata }) => {
  const updatedAppointment = await db.appointment.update({
    location_id: updatedAppointmentdata.locationId,
    department_id: updatedAppointmentdata.departmentId,
    doctor_id: updatedAppointmentdata.doctorId,
    appointment_time: updatedAppointmentdata.appointmentTime,
    appointment_duration: updatedAppointmentdata.appointmentDuration,
    questionary_answers: updatedAppointmentdata.questionaryAnswers,
    status: updatedAppointmentdata.status
  }, {
    where: { id: appointmentId, patient_id: patientId },
    returning: true,
    raw: true
  })

  if (updatedAppointment.length > 0 && updatedAppointment[1]) {
    return updatedAppointment[1][0]
  } else {
    throw new DatabaseError('No appointment found with the provided id or no updated were supplied.')
  }
}

const deleteAppointment = async (appointmentId, patientId) => {
  const isDeleted = await db.appointment.destroy({
    where: {
      id: appointmentId,
      patient_id: patientId
    }
  })

  if (!isDeleted) {
    throw new DatabaseError('No appointment found with the provided id.')
  }
  return true
}

const decodeAppointmentQR = async ({ appointmentId, ...updatedAppointmentdata }) => {
  const appointment = await db.appointment.findOne({
    attributes: ['id', 'appointment_time', 'appointment_duration', 'questionary_answers', 'status', 'prescription_image_url'],
    where: {
      id: appointmentId
    },
    include: [{
      model: db.location
    }, {
      model: db.department
    }, {
      model: db.doctor
    }, {
      model: db.patient,
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'gender', 'date_of_birth', 'last_login', 'image_url']
    }],
    nest: true
  })

  if (appointment) {
    if (updatedAppointmentdata.status) {
      await db.appointment.update({ status: updatedAppointmentdata.status }, { where: { id: appointmentId } })
      appointment.status = updatedAppointmentdata.status
    }
    return appointment
  } else {
    throw new DatabaseError('No appointment found with the provided id.')
  }
}

module.exports = {
  showAppointments,
  sendAppointmentReminder,
  generateAppointmentQR,
  decodeAppointmentQR,
  updateAppointment,
  deleteAppointment,
  getLocations,
  getDepartments,
  getDoctors,
  getDoctorSchedule,
  getQuestionnaire,
  bookAppointment
}
