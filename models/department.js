const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const department = sequelize.define('departments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  })

  department.registerRelationships = (models) => {
    department.hasMany(models.appointment, {
      foreignKey: 'department_id'
    })

    // many-to-many relationship with location table
    department.belongsToMany(models.location, {
      through: 'location_has_department',
      uniqueKey: 'department_id'
    })

    // many-to-many relationship with doctor table
    department.belongsToMany(models.doctor, {
      through: 'department_has_doctor',
      uniqueKey: 'department_id'
    })
  }

  return department
}
