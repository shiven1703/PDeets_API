
const path = require('path')

module.exports = async (sequelize, modelList) => {
  // importing departments
  const departmentsImportFile = path.join(__dirname, '/departments.js')
  const departmentList = require(departmentsImportFile)

  await modelList.department.bulkCreate(departmentList)
  console.log('Imported departments...')

  // importing locations
  const locationsImportFile = path.join(__dirname, '/locations.js')
  const locationList = require(locationsImportFile)

  await modelList.location.bulkCreate(locationList)
  console.log('Imported locations...')

  // assigning each location all departments (many to many between department and location)
  const locations = await modelList.location.findAll()
  const departments = await modelList.department.findAll()

  locations.forEach((location) => {
    departments.forEach(async (department) => {
      await modelList.location_has_department.create({
        location_id: location.id,
        department_id: department.id
      })
    })
  })
  // imported location_has_department table...
}
