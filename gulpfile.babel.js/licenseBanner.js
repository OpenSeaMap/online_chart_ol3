var fs = require('fs')

var PACKAGE = require('../package.json')
var AUTHORS = '\t' + (fs.readFileSync('AUTHORS', 'utf8') || 'multible authors').replace('\n', '\n\t')

module.exports = PACKAGE.name + '@' + PACKAGE.version + ' - ' + PACKAGE.description + '\n' +
  '\n' +
  'Copyright (c) 2015-' + new Date().getFullYear() + ' by \n' + AUTHORS +
  '\n' +
  'This program is free software: you can redistribute it and/or modify\n' +
  'it under the terms of the GNU Affero General Public License as\n' +
  'published by the Free Software Foundation, either version 3 of the\n' +
  'License, or (at your option) any later version.\n' +
  '\n' +
  'This program is distributed in the hope that it will be useful,\n' +
  'but WITHOUT ANY WARRANTY; without even the implied warranty of\n' +
  'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n' +
  'GNU Affero General Public License for more details.\n' +
  '\n' +
  'You should have received a copy of the GNU Affero General Public License\n' +
  'along with this program. If not, see <http://www.gnu.org/licenses/agpl.txt>.\n' +
  '\n' +
  'The sources can be found here:\n' +
  PACKAGE.repository
