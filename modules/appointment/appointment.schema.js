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

module.exports = {
  locationSchema,
  departmentSchema,
  doctorListSchema,
  doctorScheduleSchema
}
