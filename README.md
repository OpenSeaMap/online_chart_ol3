# Online chart for [OpenSeaMap](http://openseamap.org)

[![Build Status](https://travis-ci.org/aAXEe/online_chart_ol3.svg?branch=master)](https://travis-ci.org/aAXEe/online_chart_ol3)
[![Dependency Status](https://david-dm.org/aAXEe/online_chart_ol3.svg)](https://david-dm.org/aAXEe/online_chart_ol3)
[![devDependency Status](https://david-dm.org/aAXEe/online_chart_ol3/dev-status.svg)](https://david-dm.org/aAXEe/online_chart_ol3/?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A new online chart based on [OpenLayers 3](http://openlayers.org/), [React](https://facebook.github.io/react/), [Redux](http://redux.js.org/) and [Bootstrap](http://getbootstrap.com/).


# Online preview

Latest development state: http://aaxee.github.io/online_chart_ol3

On our main server: http://alpha.openseamap.org

# Development

Want to work on this project?
Check this steps to get your development environment running!

## Clone the repository

Check the green button on the top to get a local copy of the repository.

## Use with [Docker](https://www.docker.com/) and [Docker Compose](https://www.docker.com/products/docker-compose)

No need to setup all stuff yourself! This repo provides a `Dockerfile`
and a `docker-compose.yml` for a easy start:

### Download and install Docker

You need:
- [Docker](https://www.docker.com/)
(Version 1.10.0+)
- [Docker Compose](https://www.docker.com/products/docker-compose)
(Version 1.6.0+)

### Prepare the development environment

```
docker-compose build gulp
```

This will build a docker image with `npm` and all dependencies. The build
will take some time. Grab a cup of tea.  :tea:

### Run the development environment

To start up the development build:

```
docker-compose up gulp
```

All files will compile in development mode (uncompressed with source maps). [BrowserSync](http://www.browsersync.io/) will serve up files to [localhost:3000](http://localhost:3000) and will stream live changes to the code and assets to all connected browsers. Don't forget about the additional BrowserSync tools available on [localhost:3001](http://localhost:3001)!

Start to edit the files in `src/` and watch the browser reloading!

If you removed or added files you may need to stop the container [hint: <kbd>CTRL</kbd>+<kbd>C</kbd>]
and restart it.

If you add packages or change files in `gulpfile.js` don't forget to rebuild the
container because all packages are installed and cached inside.

### More targets


```
docker-compose run lint
```

Runs the lint scripts and exits.

```
docker-compose run test
```

Builds and runs all tests.

```
docker-compose up demo
```

Builds the project in release mode and serves them to [localhost:5000](http://localhost:5000).

## Use directly with `npm`

You can use for own install of npm. See [gulpfile.babel.js/README.md](./gulpfile.js/README.md) for details.
