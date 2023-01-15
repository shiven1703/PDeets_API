const cron = require('node-cron')
const config = require('config')
const appointmentService = require('../modules/appointment/appointment.service')

module.exports = () => {
  // appointment reminder cron: every day 5 am
  cron.schedule('0 5 * * *', async () => {
    await appointmentService.sendAppointmentReminder()
  }, {
    timezone: config.get('crons.timezone')
  })
}
