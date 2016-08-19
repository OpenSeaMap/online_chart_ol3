/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
/* eslint-env mocha */
import { expect } from 'chai'

/**
 * "license": "AGPL-3.0",
 */
describe('package.json license', () => {
  var PACKAGE = require('../../../package.json')

  it('is available', () => {
    expect(PACKAGE).to.have.property('license').that.is.a('string')
  })

  it('is AGPL-3.0', () => {
    expect(PACKAGE.license).to.be.equal('AGPL-3.0')
  })
})

/**
 * "bugs": {
 *   "url": "https://github.com/aAXEe/online_chart_ol3/issues"
 * },
 */
describe('package.json bugs', () => {
  var PACKAGE = require('../../../package.json')

  it('is availible', () => {
    expect(PACKAGE).to.have.property('bugs')
    expect(PACKAGE).to.have.property('bugs').to.have.property('url')
  })

  it('has valid url', () => {
    var validUrl = require('valid-url')
    expect(validUrl.isUri(PACKAGE.bugs.url))
  })
})

/**
 * "repository": "https://github.com/aAXEe/online_chart_ol3",
 */
describe('package.json repository', () => {
  var PACKAGE = require('../../../package.json')

  it('is availible', () => {
    expect(PACKAGE).to.have.property('repository')
  })

  it('is a valid repository', () => {
    var parseRepo = require('parse-repo')
    var repoInfo = parseRepo(PACKAGE.repository)
    expect(repoInfo).to.have.property('owner')
    expect(repoInfo).to.have.property('project')
  })
})
