const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const patient = sequelize.define('patients', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['men', 'women', 'other']
    },
    date_of_birth: {
      type: DataTypes.DATE
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE
    }
  })

  patient.registerRelationships = (models) => {
    patient.hasMany(models.review, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.appointment, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.medication_reminder, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.patient_session, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.callback_request, {
      foreignKey: 'patient_id'
    })

    patient.hasMany(models.lab_report, {
      foreignKey: 'patient_id'
    })
  }

  return patient
}
