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
      type: 'number'
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
      type: 'number'
    },
    departmentId: {
      type: 'string'
    },
    filterBy: {
      type: 'string'
    }
  },
  required: ['locationId'],
  additionalProperties: false
}

const doctorScheduleSchema = {
  type: 'object',
  properties: {
    locationId: {
      type: 'string'
    },
    departmentId: {
      type: 'string'
    },
    doctorId: {
      type: 'number'
    }
  },
  required: ['doctorId'],
  additionalProperties: false
}

const appointmentBookingSchema = {
  type: 'object',
  properties: {
    appointmentId: {
      type: 'number'
    },
    locationId: {
      type: 'number'
    },
    departmentId: {
      type: 'number'
    },
    doctorId: {
      type: 'number'
    },
    patientId: {
      type: 'number'
    },
    isPreliminaryCheckup: {
      type: 'boolean'
    },
    status: {
      type: 'string',
      enum: ['pending', 'done', 'cancelled']
    }
  },
  required: ['appointmentId', 'locationId', 'doctorId', 'patientId', 'isPreliminaryCheckup'],
  additionalProperties: false
}

const updateAppointmentSchema = {
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
    appointmentTime: {
      type: 'string',
      format: 'date-time'
    },
    appointmentDuration: {
      type: 'integer'
    },
    questionaryAnswers: {
      type: 'string'
    },
    status: {
      type: 'string'
    }
  },
  additionalProperties: false
}

const appointmentDeleteSchema = {
  type: 'object',
  properties: {
    appointmentId: {
      type: 'number'
    },
    patientId: {
      type: 'number'
    }
  },
  required: ['appointmentId', 'patientId'],
  additionalProperties: false
}

module.exports = {
  updateAppointmentSchema,
  locationSchema,
  departmentSchema,
  doctorListSchema,
  doctorScheduleSchema,
  appointmentBookingSchema,
  appointmentDeleteSchema
}
