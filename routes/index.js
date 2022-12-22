const patientModule = require('../modules/patient')
const gloablErrorHandler = require('../middleware/error')

module.exports = (app) => {
  app.use('/patient', patientModule)
  app.use(gloablErrorHandler)
}
