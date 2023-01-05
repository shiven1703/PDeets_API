const editAppointmentschema = {
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
    appointment_time: {
      type: 'string',
      format: 'date-time'
    },
    appointment_duration: {
      type: 'integer'
    },
    questionary_answers: {
      type: 'json'
    },
    status: {
      type: 'string'
    },
    prescription_image_url: {
      type: 'string'
    },
    createdAt: {
      type: 'string'
    },
    updatedAt: {
      type: 'string'
    }
  },
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

module.exports = {
  editAppointmentschema,
  deleteAppointmentschema,
  locationSchema,
  departmentSchema,
  doctorListSchema
}
