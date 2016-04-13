/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import './featureDevelopment.scss'

import React from 'react'
import { Button } from 'react-bootstrap'

import AuthorsList from './AuthorsList'

import PACKAGE from '../../../../package.json'
import repoPathParse from 'repo-path-parse'

import AUTHORS from '../../../../AUTHORS'
import authorsParser from 'parse-authors'


class FeatureDevelopment extends React.Component {
  render() {
    const repoInfo = repoPathParse(PACKAGE.repository);
    const repoUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}`;

    return (
      <article className="featureDevelopment">

        <section>
          <h2>{ 'Bugs & Features' }</h2>
          <div>
            { 'If you found a bug or if you have an idea for a new feature please file a new ' }
            <a href={ PACKAGE.bugs.url }>{ 'github issue' }</a>:<br />
          </div>
          <div>
            <Button id="newGHIssue" bsStyle="info"
              href={ PACKAGE.bugs.url + '/new' }>
                { 'Create a new Issue' }
            </Button>
          </div>
        </section>

        <section>
          <h2>{ 'Source Code' }</h2>
          <div>
            { 'The sourcecode is availible on ' }
            <a href={ repoUrl }>{ 'GitHub' }</a>
            { ' and as a ' }
            <a href={ repoUrl + '/releases' }>{ 'release-tarball' }</a>.
          </div>
        </section>

        <section>
          <h2>License</h2>
          <div>
            { 'This Web-Application is ' }
            <a href="http://www.gnu.org/philosophy/floss-and-foss.de.html">{ 'Free/Libre Open Source Software' }</a>
            {' and licensed unter '}
            <a href={ 'https://spdx.org/licenses/' + PACKAGE.license + '.html' }>{ PACKAGE.license }</a>.
          </div>
          <div>
            { 'The authors:' }<br />
            <AuthorsList authors={ authorsParser(AUTHORS) } />
          </div>
        </section>

      </article>
    );
  }
}

FeatureDevelopment.propTypes = {

}

export default FeatureDevelopment
