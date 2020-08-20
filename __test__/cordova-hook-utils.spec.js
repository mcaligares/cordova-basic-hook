const util = require('../cordova-hook-utils')

const cordovaConfigPath = './__test__/config-test.xml'

describe('test cordova-hook-utils', () => {
  test('should return a file as string', () => {
    expect(util.getFileAsString(cordovaConfigPath)).toContain('xml')
  })

  test('should return true if file contain the regex', () => {
    expect(util.doesFileContainWidgetElem(cordovaConfigPath)).toBe(true)
  })

  test('should return an access element with domain', () => {
    const domain = 'https://example.com'
    const domainsResult = util.getAllowedDomains([domain])
    expect(domainsResult[0]).toContain(`<access origin="${domain}" />`)
  })

  test('should return an access element with domain from env', () => {
    const domain = 'https://example.com'
    process.env.TEST_DOMAIN = domain
    const domainEnv = '$TEST_DOMAIN'
    const domainsResult = util.getAllowedDomains([domainEnv])
    expect(domainsResult[0]).toContain(`<access origin="${domain}" />`)
  })

  test('should return an allow-intent element with site', () => {
    const site = 'https://example.com'
    const sitesResult = util.getAllowedSites([site])
    expect(sitesResult[0]).toContain(`<allow-intent href="${site}" />`)
  })

  test('should return an allow-intent element with site from env', () => {
    const site = 'https://example.com'
    process.env.TEST_SITE = site
    const siteEnv = '$TEST_SITE'
    const siteResult = util.getAllowedSites([siteEnv])
    expect(siteResult[0]).toContain(`<allow-intent href="${site}" />`)
  })

  test('should return a string included domains and sites', () => {
    const domain1 = 'https://uno.example.com'
    const domain2 = 'https://dos.example.com'
    process.env.TEST_DOMAIN = domain2
    const domainEnv = '$TEST_DOMAIN'
    const domainsResult = util.getAllowedDomains([domain1, domainEnv])

    const siteA = 'https://a.example.com'
    const siteB = 'https://b.example.com'
    process.env.TEST_SITE = siteB
    const siteEnv = '$TEST_SITE'
    const siteResult = util.getAllowedSites([siteA, siteEnv])

    const updatedFile = util.includeEntries(cordovaConfigPath, domainsResult, siteResult)
    expect(updatedFile).toContain(`<access origin="${domain1}" />`)
    expect(updatedFile).toContain(`<access origin="${domain2}" />`)
    expect(updatedFile).toContain(`<allow-intent href="${siteA}" />`)
    expect(updatedFile).toContain(`<allow-intent href="${siteB}" />`)
  })
})
