const callBackRequestSchema = {
  type: 'object',
  properties: {
    patientId: {
      type: 'string'
    },
    callback_reasonId: {
      type: 'string'
    },
    preferred_contact_option: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        phoneNumber: {
          type: 'string',
          minLength: 10,
          maxLength: 15
        }
      },
      oneOf: [{ required: ['email'] }, { required: ['phoneNumber'] }]
    },
    preferred_time: {
      type: 'string',
      format: 'date-time'
    },
    is_severe: {
      type: 'string',
      format: 'boolean'
    },
    remark: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['pending', 'contacted', 'not_reachable']
    }
  },
  additionalProperties: false
}

module.exports = {
  callBackRequestSchema
}
