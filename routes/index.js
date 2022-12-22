const userModule = require('../modules/patient')
const gloablErrorHandler = require('../middleware/error')

module.exports = (app) => {
  app.use('/patient', userModule)
  app.use(gloablErrorHandler)
}
