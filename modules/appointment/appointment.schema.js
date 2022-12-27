const locationSchema = {
  type: 'object',
  properties: {
    filterBy: {
      type: 'string'
    }
  },
  additionalProperties: false
}

module.exports = {
  locationSchema
}
