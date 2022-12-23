const patientRegitserSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      minLength: 10,
      maxLength: 13
    },
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other']
    },
    dateOfBirth: {
      type: 'string',
      format: 'date-time'
    },
    password: {
      type: 'string'
    }
  },
  required: ['firstName', 'lastName', 'phoneNumber', 'password'],
  additionalProperties: false
}

const patientLoginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      minLength: 10,
      maxLength: 13
    },
    password: {
      type: 'string'
    }
  },
  oneOf: [
    { required: ['email', 'password'] },
    { required: ['phoneNumber', 'password'] }
  ],
  additionalProperties: false
}

module.exports = {
  patientRegitserSchema,
  patientLoginSchema
}
