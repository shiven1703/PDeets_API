const locationSchema = {
  type: 'object',
  properties: {
    filterBy: {
      type: 'string'
    }
  },
  additionalProperties: false
}

const departmentSchema = {
  type: 'object',
  properties: {
    locationId: {
      type: 'string'
    },
    filterBy: {
      type: 'string'
    }
  },
  required: ['locationId'],
  additionalProperties: false
}

const doctorListSchema = {
  type: 'object',
  properties: {
    locationId: {
      type: 'string'
    },
    departmentId: {
      type: 'string'
    },
    filterBy: {
      type: 'string'
    }
  },
  required: ['locationId', 'departmentId'],
  additionalProperties: false
}

const doctorScheduleSchema = {
  type: 'object',
  properties: {
    doctorId: {
      type: 'string'
    }
  },
  required: ['doctorId'],
  additionalProperties: false
}

const appointmentBookingSchema = {
  type: 'object',
  properties: {
    locationId: {
      type: 'string'
    },
    departmentId: {
      type: 'string'
    },
    doctorId: {
      type: 'string'
    },
    patientId: {
      type: 'string'
    },
    appointmentTime: {
      type: 'string'
    },
    appointmentDuration: {
      type: 'string'
    },
    questionaryAnswer: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['pending', 'done', 'cancelled']
    }
  },
  required: ['locationId', 'departmentId', 'doctorId', 'patientId', 'appointmentTime', 'questionaryAnswer'],
  additionalProperties: false
}

module.exports = {
  locationSchema,
  departmentSchema,
  doctorListSchema,
  doctorScheduleSchema,
  appointmentBookingSchema
}
