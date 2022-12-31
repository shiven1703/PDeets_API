const patientModule = require('../modules/patient')
const gloablErrorHandler = require('../middleware/error')
const appointmentModule = require('../modules/appointment')

module.exports = (app) => {
  app.use('/patient', patientModule)
  app.use('/appointment', appointmentModule)
  app.use(gloablErrorHandler)
}
