
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

  // importing doctors
  const doctorsImportFile = path.join(__dirname, '/doctors.js')
  const doctorList = require(doctorsImportFile)

  await modelList.doctor.bulkCreate(doctorList)
  console.log('Imported doctors...')

  // Filling up location_has_departments & department_has_doctor tables
  const locations = await modelList.location.findAll()
  const departments = await modelList.department.findAll()

  // location_has_departments
  locations.forEach((location) => {
    departments.forEach(async (department) => {
      await modelList.location_has_department.create({
        location_id: location.id,
        department_id: department.id
      })
    })
  })
  console.log('location_has_department imported...')

  // department_has_doctor
  const doctors = await modelList.doctor.findAll()
  const locationDepartment = await modelList.location_has_department.findAll()

  locationDepartment.forEach((locationDepartment) => {
    doctors.forEach(async (doctor) => {
      try {
        await modelList.department_has_doctor.create({
          location_department_id: locationDepartment.location_department_id,
          doctor_id: doctor.id
        })
      } catch (err) {
        console.log(err)
      }
    })
  })
  console.log('department_has_doctor imported...')
}
