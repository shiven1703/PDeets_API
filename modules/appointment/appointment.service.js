// model imports
const { db, sequelize } = require('../../db')

// lib imports
const { Op, QueryTypes } = require('sequelize')

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

const getLocations = async ({ filterBy }) => {
  try {
    let locations = []
    if (filterBy) {
      // setting up filter value (search value in all columns)
      const where = {
        [Op.or]: [{
          name: {
            [Op.iLike]: `%${filterBy}%`
          }
        },
        {
          description: {
            [Op.iLike]: `%${filterBy}%`
          }
        },
        {
          address: {
            [Op.iLike]: `%${filterBy}%`
          }
        },
        {
          pincode: {
            [Op.iLike]: `%${filterBy}%`
          }
        },
        {
          city: {
            [Op.iLike]: `%${filterBy}%`
          }
        }]
      }
      // fetching data
      locations = await db.location.findAll({
        where
      })
    } else {
      locations = await db.location.findAll()
    }
    return locations
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
          attributes: ['id', 'name', 'description'],
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
          attributes: ['id', 'name', 'description'],
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
    const locationDepartment = await db.location_has_department.findOne({
      attributes: ['location_department_id'],
      where: {
        location_id: locationId,
        department_id: departmentId
      },
      raw: true
    })

    let query = null

    if (filterBy) {
      query = `SELECT doctor_id, doctors.first_name, doctors.last_name, doctors.email, doctors.phone_number, doctors.education, doctors.about, doctors.address, doctors.pincode, doctors.doctor_speciality, doctors.licence_no, doctors.experience
      FROM department_has_doctor 
      LEFT JOIN doctors as doctors 
      ON doctor_id=doctors.id 
      WHERE location_department_id='${locationDepartment.location_department_id}' AND (
        doctors.first_name ILIKE '%${filterBy}%' OR
        doctors.last_name ILIKE '%${filterBy}%' OR
        doctors.email ILIKE '%${filterBy}%' OR
        doctors.phone_number ILIKE '%${filterBy}%' OR
        doctors.address ILIKE '%${filterBy}%' OR
        doctors.pincode ILIKE '%${filterBy}%' OR
        doctors.licence_no ILIKE '%${filterBy}%'
      );`
    } else {
      query = `SELECT doctor_id, doctors.first_name, doctors.last_name, doctors.email, doctors.phone_number, doctors.education, doctors.about, doctors.address, doctors.pincode, doctors.doctor_speciality, doctors.licence_no, doctors.experience 
      FROM department_has_doctor 
      LEFT JOIN doctors as doctors 
      ON doctor_id=doctors.id 
      WHERE location_department_id='${locationDepartment.location_department_id}';`
    }

    let doctorList = await sequelize.query(query, { type: QueryTypes.SELECT })
    doctorList = JSON.parse(JSON.stringify(doctorList))

    // fetching reviews for each doctor
    let doctorListWithReviews = await Promise.all(doctorList.map(async (doctor) => {
      const query = `SELECT first_name, last_name, number_of_stars, review_text FROM reviews
      LEFT JOIN doctors ON doctors.id = reviews.doctor_id
      WHERE reviews.doctor_id = '${doctor.doctor_id}';`
      const reviews = await sequelize.query(query, { type: QueryTypes.SELECT })
      doctor.reviews = reviews
      return doctor
    }))

    // avg review
    doctorListWithReviews = doctorListWithReviews.map((doctor) => {
      const reviewCount = doctor.reviews.length
      let reviewTotal = 0

      if (reviewCount > 0) {
        doctor.reviews.forEach((review) => {
          reviewTotal = reviewTotal + review.number_of_stars
        })

        doctor.avg_review = reviewTotal / reviewCount
      } else {
        doctor.avg_review = 5
      }
      return doctor
    })

    return doctorListWithReviews
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
      }
    })

    const unavailableSlots = []
    bookedAppointments.forEach((appointment) => {
      unavailableSlots.push({
        from: appointment.appointment_time,
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

module.exports = {
  showAppointments,
  getLocations,
  getDepartments,
  getDoctors,
  getDoctorSchedule,
  getQuestionnaire,
  bookAppointment
}
