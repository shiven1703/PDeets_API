const updateAppointmentSchema = {
  type: 'object',
  properties: {
    appointmentId: {
      type: 'string'
    },
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
  required: ['appointmentId'],
  additionalProperties: false
}

const deleteAppointmentschema = {
  type: 'object',
  properties: {
    appointmentId: {
      type: 'string'
    }
  }
}

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
    locationId: {
      type: 'string'
    },
    departmentId: {
      type: 'string'
    },
    doctorId: {
      type: 'string'
    }
  },
  required: ['locationId', 'departmentId', 'doctorId'],
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
  updateAppointmentSchema,
  deleteAppointmentschema,
  locationSchema,
  departmentSchema,
  doctorListSchema,
  doctorScheduleSchema,
  appointmentBookingSchema
}
