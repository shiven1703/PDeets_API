const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const locationHasDepartment = sequelize.define('location_has_department', {
    department_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    location_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  })

  return locationHasDepartment
}
