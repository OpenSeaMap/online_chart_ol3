/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'
import './featureDevelopment.scss'

import React from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl'

import AuthorsList from './AuthorsList'
import { ExternalLink, DownloadLink } from '../../components/misc/Links'

import PACKAGE from '../../../../package.json'
import repoPathParse from 'repo-path-parse'

import AUTHORS from '../../../../AUTHORS'
import authorsParser from 'parse-authors'

const messages = {
  'issues-title': 'Bugs & Features',
  'issues-create-new': 'Create a new Issue',
  'issues-bug-found': 'If you found a bug or if you have an idea for a new feature please file a new { linkGitHubIssues }.',
  'issues-bug-found-new': 'github issue',
  'issues-bug-found-new-title': 'Bug/Feature',
  'issues-bug-found-new-body': 'Please describe how to reproduce any bugs!',

  'source-title': 'Source Code',
  'source-links': 'The sourcecode is availible on { linkGithub } and as a { linkDownload }.',
  'source-links-github': 'GitHub',
  'source-links-tarball': 'release-tarball',

  'license-title': 'License',
  'license-links': 'This Web-Application is { linkFoss } and licensed unter { linkLicense }.',
  'license-links-foss-link': 'http://www.gnu.org/philosophy/floss-and-foss.en.html',
  'license-links-foss-text': 'Free/Libre Open Source Software',
  'license-authors': 'The authors:'
}

class FeatureDevelopment extends React.Component {
  render () {
    const repoInfo = repoPathParse(PACKAGE.repository)
    const repoUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}`
    const newIssueUrl = PACKAGE.bugs.url + '/new' +
      '?title=' + encodeURIComponent(messages['issues-bug-found-new-title']) +
      '&body=' + encodeURIComponent(messages['issues-bug-found-new-body']) +
      '&labels=bug'

    return (
      <IntlProvider messages={messages}>
        <div className='featureDevelopment'>
          <section>
            <h2><FormattedMessage id='issues-title' /></h2>
            <div>
              <FormattedMessage
                id='issues-bug-found'
                values={{ linkGitHubIssues: (<ExternalLink href={PACKAGE.bugs.url}> <FormattedMessage id='issues-bug-found-new' /> </ExternalLink>) }} />
              <br />
            </div>
            <div>
              <ExternalLink
                href={newIssueUrl}
                className='button'>
                <FormattedMessage id='issues-create-new' />
              </ExternalLink>
            </div>
          </section>
          <section>
            <h2><FormattedMessage id='source-title' /></h2>
            <div>
              <FormattedMessage
                id='source-links'
                values={{ linkGithub: (<ExternalLink href={repoUrl}> <FormattedMessage id='source-links-github' /> </ExternalLink>), linkDownload: (<DownloadLink href={repoUrl + '/tarball/master'}> <FormattedMessage id='source-links-tarball' /> </DownloadLink>) }} />
            </div>
          </section>
          <section>
            <h2><FormattedMessage id='license-title' /></h2>
            <div>
              <FormattedMessage
                id='license-links'
                values={{ linkFoss: (<ExternalLink href={messages['license-links-foss-link']}> <FormattedMessage id='license-links-foss-text' /> </ExternalLink>), linkLicense: (<ExternalLink href={'https://spdx.org/licenses/' + PACKAGE.license + '.html'}> { PACKAGE.license } </ExternalLink>) }} />
            </div>
          </section>
          <section>
            <h2><FormattedMessage id='license-authors' /></h2>
            <div>
              <AuthorsList authors={authorsParser(AUTHORS)} />
            </div>
          </section>
          <section>
            <div>
              <h2>{ 'Additional Licenses' }</h2>
              <ul>
                <li>
                  <ExternalLink href='https://www.google.com/design/icons/'>
                    { 'Material Design Icons by Google' }
                  </ExternalLink>
                  { ': ' }
                  <ExternalLink href='https://github.com/google/material-design-icons/blob/master/LICENSE'>
                    { 'CC-BY 4.0' }
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href='http://fontawesome.io'>
                    { 'Font Awesome by Dave Gandy' }
                  </ExternalLink>
                  { ': ' }
                  <ExternalLink href='http://scripts.sil.org/OFL'>
                    { 'SIL OFL 1.1' }
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href='http://typicons.com'>
                    { 'Typicons by Stephen Hutchings' }
                  </ExternalLink>
                  { ': ' }
                  <ExternalLink href='http://creativecommons.org/licenses/by-sa/3.0/'>
                    { 'CC BY-SA' }
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href='https://octicons.github.com'>
                    { 'Github Octicons icons by Github' }
                  </ExternalLink>
                  { ': ' }
                  <ExternalLink href='https://github.com/github/octicons/blob/master/LICENSE.txt'>
                    { 'SIL OFL 1.1' }
                  </ExternalLink>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </IntlProvider>
      )
  }
}

FeatureDevelopment.propTypes = {

}

export default FeatureDevelopment
