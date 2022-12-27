const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const location = sequelize.define('locations', {
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
    },
    lan: {
      type: DataTypes.STRING
    },
    lon: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    pincode: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    }
  })

  location.registerRelationships = (models) => {
    location.hasMany(models.appointment, {
      foreignKey: 'location_id'
    })

    // many-to-many relationship with department table
    location.belongsToMany(models.department, {
      through: 'location_has_department',
      uniqueKey: 'location_id'
    })
  }

  return location
}
