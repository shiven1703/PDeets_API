
const token = require('../utils/token')

module.exports = () => {
  return async (req, res, next) => {
    const receivedToken = req.headers.authorization

    try {
      if (receivedToken) {
        const accessToken = await token.verifyAccessToken(receivedToken)
        req.patient = {
          id: accessToken.patientId,
          email: accessToken.email,
          phoneNumber: accessToken.phoneNumber,
          validationCode: accessToken.validationCode
        }
        return next()
      } else {
        res.status(401).json({
          error: 'Auhtnetication header not found in the request header.'
        })
      }
    } catch (err) {
      next(err)
    }
  }
}
