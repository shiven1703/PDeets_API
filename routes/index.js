const patientModule = require('../modules/patient')
const gloablErrorHandler = require('../middleware/error')
const appointmentModule = require('../modules/appointment')
const medicationModule = require('../modules/medication')
const callBackRquestModule = require('../modules/callback-request')

module.exports = (app) => {
  app.use('/patient', patientModule)

  app.use('/appointment', appointmentModule)

  app.use('/medication', medicationModule)

  app.se('/callback-request', callBackRquestModule)
  app.use(gloablErrorHandler)
}
