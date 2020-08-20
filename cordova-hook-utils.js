const fs = require('fs')

const widgetClose = '</widget>'
const widgetRegex = /<\/widget>/
const allowedDomainElem = (value) => `    <access origin="${value}" />`
const allowedSiteElem = (value) => `    <allow-intent href="${value}" />`

function getFileAsString (filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function generateBackup (filePath, destFilePath) {
  fs.copyFileSync(filePath, destFilePath)
}

function restoreBackup (backupFilePath, destFilePath) {
  fs.renameSync(backupFilePath, destFilePath)
}

function getFileAsArrayString (filePath) {
  return getFileAsString(filePath).split(/\r?\n/g)
}

function doesFileContainWidgetElem (filePath) {
  return doesFileContainRegex(filePath, widgetRegex)
}

function doesFileContainRegex (filePath, regex) {
  const index = getFileAsArrayString(filePath).findIndex(line => line.match(regex))
  return index > 0
}

function getAllowedDomains (allowedDomains) {
  const domains = []
  for (const allowedDomain of allowedDomains) {
    const value = allowedDomain.startsWith('$') ? process.env[allowedDomain.substring(1)] : allowedDomain
    domains.push(allowedDomainElem(value))
  }
  return domains
}

function getAllowedSites (allowedSites) {
  const sites = []
  for (const allowedSite of allowedSites) {
    const value = allowedSite.startsWith('$') ? process.env[allowedSite.substring(1)] : allowedSite
    sites.push(allowedSiteElem(value))
  }
  return sites
}

function includeEntriesIntoFile (filePath, ...entries) {
  const updateFile = includeEntries(filePath, ...entries)
  fs.writeFileSync(filePath, updateFile)
}

function includeEntries (filePath, ...entries) {
  const lines = getFileAsArrayString(filePath)
  const index = lines.findIndex(line => line.match(widgetRegex))
  lines[index] = ''
  for (const entry of entries) lines.push(...entry)
  lines.push(widgetClose)
  return lines.join('\n')
}

module.exports = {
  getFileAsString,
  doesFileContainWidgetElem,
  generateBackup,
  getAllowedDomains,
  getAllowedSites,
  includeEntries,
  includeEntriesIntoFile,
  restoreBackup
}
