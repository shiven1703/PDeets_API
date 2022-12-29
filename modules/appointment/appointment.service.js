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
      query = `SELECT doctor_id, doctors.first_name, doctors.last_name, doctors.email, doctors.phone_number, doctors.address, doctors.pincode, doctors.doctor_speciality, doctors.licence_no, doctors.experience
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
      query = `SELECT doctor_id, doctors.first_name, doctors.last_name, doctors.email, doctors.phone_number, doctors.address, doctors.pincode, doctors.doctor_speciality, doctors.licence_no, doctors.experience 
      FROM department_has_doctor 
      LEFT JOIN doctors as doctors 
      ON doctor_id=doctors.id 
      WHERE location_department_id='${locationDepartment.location_department_id}';`
    }

    const doctorList = await sequelize.query(query, { type: QueryTypes.SELECT })
    return doctorList
  } catch (err) {
    throw new DatabaseError(err.message)
  }
}

module.exports = {
  showAppointments,
  getLocations,
  getDepartments,
  getDoctors
}
