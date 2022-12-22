
const globalErrorHandler = (err, req, res, next) => {
  // console.log(err.name)
  switch (err.name) {
    case 'InvalidPayload':
      return res.status(400).json({
        error: err.message
      })
    default:
      return res.status(500).json({
        error: 'Something went wrong...please try again'
      })
  }
}

module.exports = globalErrorHandler
