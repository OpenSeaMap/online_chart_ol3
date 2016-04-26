/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import './featureDevelopment.scss'

import React from 'react'
import { Button } from 'react-bootstrap'
import { IntlProvider, FormattedMessage } from 'react-intl';

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
  render() {
    const repoInfo = repoPathParse(PACKAGE.repository);
    const repoUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}`;

    return (
      <IntlProvider messages={ messages }>
        <article className="featureDevelopment">
          <section>
            <h2><FormattedMessage id="issues-title" /></h2>
            <div>
              <FormattedMessage
                id="issues-bug-found"
                values={ { linkGitHubIssues: ( <ExternalLink href={ PACKAGE.bugs.url }><FormattedMessage id="issues-bug-found-new"/></ExternalLink> ) } } />
              <br />
            </div>
            <div>
              <Button
                id="newGHIssue"
                bsStyle="info"
                href={ PACKAGE.bugs.url + '/new' }>
                <FormattedMessage id="issues-create-new" />
              </Button>
            </div>
          </section>
          <section>
            <h2><FormattedMessage id="source-title" /></h2>
            <div>
              <FormattedMessage
                id="source-links"
                values={ { linkGithub: ( <ExternalLink href={ 'repoUrl' }><FormattedMessage id="source-links-github"/></ExternalLink>), linkDownload: (<DownloadLink href={ repoUrl + '/tarball/master' }><FormattedMessage id="source-links-tarball" /></DownloadLink> ) } } />
            </div>
          </section>
          <section>
            <h2><FormattedMessage id="license-title" /></h2>
            <div>
              <FormattedMessage
                id="license-links"
                values={ { linkFoss: ( <ExternalLink href={ messages['license-links-foss-link'] }><FormattedMessage id="license-links-foss-text" /></ExternalLink>), linkLicense: (<ExternalLink href={ 'https://spdx.org/licenses/' + PACKAGE.license + '.html' }>{ PACKAGE.license }</ExternalLink> ) } } />
            </div>
            <div>
              <FormattedMessage id="license-authors" />
              <br />
              <AuthorsList authors={ authorsParser(AUTHORS) } />
            </div>
          </section>
        </article>
      </IntlProvider>
      );
  }
}

FeatureDevelopment.propTypes = {

}

export default FeatureDevelopment
