const medicationService = require('./medication.service')
const validator = require('../../utils/schemaValidator')
const schema = require('./medication.schema')

const addReminder = async (req, res, next) => {
  try {
    const params = await validator.validate(schema.addMedicationReminderSchema, req.body)
    params.patientId = req.patient.id
    const addedReminders = await medicationService.addMedicationReminder(params)
    res.status(200).json({
      message: 'Reminder added',
      data: {
        reminders: addedReminders
      }
    })
  } catch (err) {
    next(err)
  }
}

// module level error handler
const medicationModuleErrorHandler = (err, req, res, next) => {
  next(err)
}

module.exports = {
  addReminder,
  medicationModuleErrorHandler
}
