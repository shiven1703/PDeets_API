const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const patientSession = sequelize.define('patient_sessions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  })

  return patientSession
}
