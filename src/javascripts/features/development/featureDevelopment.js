/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'
import './featureDevelopment.scss'

import React from 'react'
import { FormattedMessage } from 'react-intl'

import AuthorsList from './AuthorsList'
import { ExternalLink, DownloadLink } from '../../components/misc/Links'

import PACKAGE from '../../../../package.json'
import repoPathParse from 'repo-path-parse'

import AUTHORS from '../../../../AUTHORS'
import authorsParser from 'parse-authors'

class FeatureDevelopment extends React.Component {
  render () {
    const repoInfo = repoPathParse(PACKAGE.repository)
    const repoUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}`
    const newIssueUrl = PACKAGE.bugs.url + '/new' + '?labels=bug'

    return (
      <div className='featureDevelopment'>
        <section>
          <h2><FormattedMessage
            id='issues-title'
            defaultMessage='Bugs & Features' />
          </h2>
          <div>
            <FormattedMessage
              id='issues-bug-found'
              defaultMessage='If you found a bug or if you have an idea for a new feature please file a new { linkGitHubIssues }.'
              values={{ linkGitHubIssues: (
                <ExternalLink href={PACKAGE.bugs.url}>
                  <FormattedMessage id='issues-bug-found-new' defaultMessage='github issue' />
                </ExternalLink>
                ) }} />
            <br />
          </div>
          <div>
            <ExternalLink
              href={newIssueUrl}
              className='button'>
              <FormattedMessage id='issues-create-new' defaultMessage='Create a new issue' />
            </ExternalLink>
          </div>
        </section>
        <section>
          <h2><FormattedMessage id='source-title' defaultMessage='Source code' /></h2>
          <div>
            <FormattedMessage
              id='source-links'
              defaultMessage='The source code is available on { linkGithub } and as a { linkDownload }.'
              values={{
                linkGithub: (
                  <ExternalLink href={repoUrl}>
                    <FormattedMessage id='source-links-github' defaultMessage='GitHub' />
                  </ExternalLink>),
                linkDownload: (
                  <DownloadLink href={repoUrl + '/tarball/master'}>
                    <FormattedMessage id='source-links-tarball' defaultMessage='release tarball' />
                  </DownloadLink>
                   ) }} />
          </div>
        </section>
        <section>
          <h2><FormattedMessage id='license-title' defaultMessage='License' /></h2>
          <div>
            <FormattedMessage
              id='license-links'
              defaultMessage='This Web-Application is { linkFoss } and licensed unter { linkLicense }.'
              values={{
                linkFoss: (
                  <ExternalLink href='http://www.gnu.org/philosophy/floss-and-foss.en.html'>
                    <FormattedMessage id='license-links-foss-text' defaultMessage='Free/Libre Open Source Software' />
                  </ExternalLink>
                    ),
                linkLicense: (
                  <ExternalLink href={'https://spdx.org/licenses/' + PACKAGE.license + '.html'}>
                    { PACKAGE.license }
                  </ExternalLink>
                     ) }} />
          </div>
        </section>
        <section>
          <h2>
            <FormattedMessage id='license-authors' defaultMessage='The authors:' />
          </h2>
          <div>
            <AuthorsList authors={authorsParser(AUTHORS)} />
          </div>
        </section>
        <section>
          <div>
            <h2>{ 'Additional licenses' }</h2>
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
    )
  }
}

FeatureDevelopment.propTypes = {

}

export default FeatureDevelopment
