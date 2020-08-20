const util = require('./cordova-hook-utils')

module.exports = function (ctx) {
  const { projectRoot } = ctx.opts
  const cordovaConfigPath = `${projectRoot}/config.xml`
  const cordovaConfigBackupPath = `${projectRoot}/config.backup.xml`
  const cordovaPackageFile = require(`${projectRoot}/package.json`)
  const config = cordovaPackageFile.cordova.config
  if (ctx.hook === 'before_build') {
    if (util.doesFileContainWidgetElem(cordovaConfigPath)) {
      util.generateBackup(cordovaConfigPath, cordovaConfigBackupPath)
      const allowedDomains = util.getAllowedDomains(config.allowedDomains)
      const allowedSites = util.getAllowedSites(config.allowedSites)
      util.includeEntriesIntoFile(cordovaConfigPath, allowedDomains, allowedSites)
    }
  }
  if (ctx.hook === 'after_build') {
    util.restoreBackup(cordovaConfigBackupPath, cordovaConfigPath)
  }
}
