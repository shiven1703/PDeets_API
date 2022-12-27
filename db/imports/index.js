
const path = require('path')

module.exports = async (sequelize, modelList) => {
  // importing locations
  const locationsImportFile = path.join(__dirname, '/locations.js')
  const locations = require(locationsImportFile)

  await modelList.location.bulkCreate(locations)
  console.log('Imported locations...')
}
