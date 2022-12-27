// model imports
const { db } = require('../../db')

// lib imports
const { Op } = require('sequelize')

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

module.exports = {
  showAppointments,
  getLocations
}
