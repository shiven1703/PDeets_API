// model imports
const { DateTime } = require('luxon')
const { db } = require('../../db')

// lib imports
const { Op } = require('sequelize')

// helpers imports
// custom errors
const {
  UnknownServerError
} = require('../../utils/customErrors')

const addMedicationReminder = async ({ patientId, medicineName, dosageQty, dosageUnit = null, dosageInterval, dosageIntervalUnit, medicationTime, reminderTime, reminderTimeUnit, startDate, specialRemarks = null }) => {
  try {
    const reminders = await Promise.all(medicineName.map(async (medicine) => {
      return db.medication_reminder.create({
        patient_id: patientId,
        medicine_name: medicine,
        dosage_qty: dosageQty,
        dosage_unit: dosageUnit,
        dosage_interval: dosageInterval,
        dosage_interval_unit: dosageIntervalUnit,
        medication_time: medicationTime,
        reminder_time: reminderTime,
        reminder_unit: reminderTimeUnit,
        start_date: startDate,
        end_date: getEndDate(startDate, reminderTimeUnit, reminderTime),
        special_remarks: specialRemarks
      })
    }))
    return reminders
  } catch (err) {
    console.log(err)
    throw new UnknownServerError(err.message)
  }
}

const getEndDate = (startDate, reminderTimeUnit, reminderTime) => {
  const plusObj = {}
  if (reminderTimeUnit === 'day') {
    plusObj.days = reminderTime
  } else if (reminderTimeUnit === 'week') {
    plusObj.weeks = reminderTime
  } else if (reminderTimeUnit === 'month') {
    plusObj.months = reminderTime
  }
  return DateTime.fromISO(startDate).plus(plusObj).endOf('day')
}

const getReminders = async ({ patientId, filterBy = null }) => {
  let reminders = []
  if (filterBy) {
    reminders = await db.medication_reminder.findAll({
      where: {
        patient_id: patientId,
        [Op.or]: [{
          medicine_name: {
            [Op.iLike]: `%${filterBy}%`
          }
        }]
      }
    })
  } else {
    reminders = await db.medication_reminder.findAll({
      where: {
        patient_id: patientId
      }
    })
  }
  return reminders
}

module.exports = {
  addMedicationReminder,
  getReminders
}
