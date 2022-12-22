class InvalidPayload extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidPayload'
  }
}

class DatabaseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DbError'
  }
}

module.exports = {
  InvalidPayload,
  DatabaseError
}
