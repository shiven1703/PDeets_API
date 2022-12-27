const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const departmentHasDoctor = sequelize.define('department_has_doctor', {
    department_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    doctor_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  })

  return departmentHasDoctor
}
