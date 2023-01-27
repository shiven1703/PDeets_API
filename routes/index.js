const patientModule = require('../modules/patient')
const appointmentModule = require('../modules/appointment')
const medicationModule = require('../modules/medication')
const callBackRquestModule = require('../modules/callback-request')
const gloablErrorHandler = require('../middleware/error')

module.exports = (app) => {
  app.use('/patient', patientModule)

  app.use('/appointment', appointmentModule)

  app.use('/medication', medicationModule)

  app.use('/callback-request', callBackRquestModule)

  app.use(gloablErrorHandler)
}
