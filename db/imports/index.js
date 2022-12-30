
const path = require('path')

const importDepartments = async (sequelize, modelList) => {
  try {
    // importing departments
    const departmentsImportFile = path.join(__dirname, '/departments.js')
    const departmentList = require(departmentsImportFile)

    await modelList.department.bulkCreate(departmentList)
    console.log('Imported departments...')
  } catch (err) {
    console.log(err)
  }
}

const importLocations = async (sequelize, modelList) => {
  try {
    // importing locations
    const locationsImportFile = path.join(__dirname, '/locations.js')
    const locationList = require(locationsImportFile)

    await modelList.location.bulkCreate(locationList)
    console.log('Imported locations...')
  } catch (err) {
    console.log(err)
  }
}

const importDoctors = async (sequelize, modelList) => {
  try {
    // importing doctors
    const doctorsImportFile = path.join(__dirname, '/doctors.js')
    const doctorList = require(doctorsImportFile)

    await modelList.doctor.bulkCreate(doctorList)
    console.log('Imported doctors...')
  } catch (err) {
    console.log(err)
  }
}

const importLocationHasDepartments = async (sequelize, modelList) => {
  try {
    // Filling up location_has_departments
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
  } catch (err) {
    console.log(err)
  }
}

const importDepartmentHasDoctor = async (sequelize, modelList) => {
  try {
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
  } catch (err) {
    console.log(err)
  }
}

const importDoctorSchedule = async (sequelize, modelList) => {
  try {
    const doctors = await modelList.doctor.findAll()
    doctors.forEach(async (doctor) => {
      await modelList.doctor_schedule.create({
        doctor_id: doctor.id,
        start_time: '09:00:00',
        end_time: '17:00:00',
        appointment_duration: 30
      })
    })
    console.log('Doctor schedule imported...')
  } catch (err) {
    console.log(err)
  }
}

module.exports = async (sequelize, modelList) => {
  await importDepartments(sequelize, modelList)
  await importLocations(sequelize, modelList)
  await importDoctors(sequelize, modelList)
  await importLocationHasDepartments(sequelize, modelList)
  await importDepartmentHasDoctor(sequelize, modelList)
  await importDoctorSchedule(sequelize, modelList)
  setTimeout(() => {
    console.log('Default data imported successfully...')
  }, 5000)
}
