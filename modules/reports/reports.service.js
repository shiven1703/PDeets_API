// model imports
const { db } = require('../../db')

// lib import
const config = require('config')

const addReport = async (reportData, reportFiles) => {
  let report = await db.lab_report.create({
    patient_id: reportData.patientId,
    appointment_id: reportData.appointmentId,
    report_name: reportData.reportName,
    generation_date: reportData.generationDate,
    report_files: reportFiles,
    status: reportData.status,
    remarks: reportData.remarks
  })
  report = addReportDownloadUrl(report)
  return report
}

const addReportDownloadUrl = async (report) => {
  const updatedReportFiles = report.report_files.map((file) => {
    file.download_url = process.env.HOST + '/' + config.get('modules.reports.lab.upload_location').replace('public/', '') + '/' + file.filename
    return file
  })
  report.report_files = updatedReportFiles
  return report
}

module.exports = {
  addReport
}
