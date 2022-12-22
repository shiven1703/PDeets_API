const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const doctor = sequelize.define('doctors', {
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
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    pincode: {
      type: DataTypes.STRING
    },
    doctor_speciality: {
      type: DataTypes.STRING
    },
    licence_no: {
      type: DataTypes.STRING
    },
    experience: {
      type: DataTypes.DOUBLE
    }
  })

  doctor.registerRelationships = (models) => {
    doctor.hasMany(models.review, {
      foreignKey: 'doctor_id'
    })

    doctor.hasMany(models.appointment, {
      foreignKey: 'doctor_id'
    })

    // many-to-many relationship with department table
    doctor.belongsToMany(models.department, {
      through: 'department_has_doctor',
      uniqueKey: 'doctor_id'
    })

    doctor.hasMany(models.doctor_schedule, {
      foreignKey: 'doctor_id'
    })
  }

  return doctor
}