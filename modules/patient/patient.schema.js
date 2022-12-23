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

const passwordResetTokenSchema = {
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
    }
  },
  oneOf: [
    { required: ['email'] },
    { required: ['phoneNumber'] }
  ],
  additionalProperties: false
}

const patientPasswordUpdateSchema = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      enum: ['change_password', 'reset_password', 'get_password_reset_token']
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
    validationCode: {
      type: 'string'
    },
    oldPassword: {
      type: 'string'
    },
    newPassword: {
      type: 'string'
    }
  },
  anyOf: [
    { required: ['action', 'email', 'oldPassword', 'newPassword'] },
    { required: ['action', 'phoneNumber', 'oldPassword', 'newPassword'] },
    { required: ['action', 'validationCode', 'newPassword'] },
    { required: ['action', 'email'] },
    { required: ['action', 'phoneNumber'] }
  ],
  additionalProperties: false
}

module.exports = {
  patientRegitserSchema,
  patientLoginSchema,
  passwordResetTokenSchema,
  patientPasswordUpdateSchema
}
