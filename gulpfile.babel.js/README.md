# Build system

This directory contains the build system for the website.
This readme describes details for the build.

The build system is based on [Gulp Starter](https://github.com/vigetlabs/gulp-starter).


# Usage with local npm
Make sure Node 4.4.3 (lts) is installed!
We recommend using [NVM](https://github.com/creationix/nvm) or [n](https://github.com/tj/n) to manage node versions.

All commands should be run in the top level folder.

#### Install Dependencies
```
npm install
```

Note: this will call `bower install` automatically.

#### Start compiling, serving, and watching files
```
npm run gulp
```

This runs `gulp` from `./node_modules/bin`, using the version installed with this project, rather than a globally installed instance. All commands in the package.json `scripts` work this way. The `gulp` command runs the `default` task, defined in `gulpfile.babel.js/tasks/default.js`.

All files will compile in development mode (uncompressed with source maps). [BrowserSync](http://www.browsersync.io/) will serve up files to [localhost:3000](http://localhost:3000) and will stream live changes to the code and assets to all connected browsers. Don't forget about the additional BrowserSync tools available on [localhost:3001](http://localhost:3001)!

To run any other existing task, simply add the task name after the `gulp` command. Example:

```bash
npm run gulp production
```

#### Configuration
Directory and top level settings are convienently exposed in `gulpfile.js/config.json`. All task configuration objects have `src` and `dest` directories specfied. These are relative to `root.src` and `root.dest` respectively. Each configuration also has an extensions array. This is used for file watching, and file deleting/replacing.

If there is a feature you do not wish to use on your project, simply delete the configuration, and the task will be skipped.

### Run JavaScript Tests
```
npm run test
```
Test files located in `__tests__` folders are picked up and run using
[Karma](http://karma-runner.github.io/0.12/index.html), [Mocha](http://mochajs.org/), [Chai](http://chaijs.com/), and [Sinon](http://sinonjs.org/). The test script right now first compiles a production build, and then, if successful runs Karma. This is nice when using something like [Travis CI](https://travis-ci.org/vigetlabs/gulp-starter) in that if an error occurs during the build step, Travis alerts me that it failed. To pass, the files have to compile properly AND pass the JS tests.

### Build production-ready files
```
npm run production
```

This will compile revisioned and compressed files to `./public`. To build production files and preview them localy, run

```
npm start
```

This will start a static server that serves your production files to http://localhost:5000. This is primarily meant as a way to preview your production build locally, not necessarily for use as a live production server.

### Deploy to gh-pages
```
npm run deploy
```
This task compiles production code and then uses [gulp-gh-pages](https://github.com/shinnn/gulp-gh-pages) to push the contents of your `dest.root` to a `gh-pages` (or other specified) branch, viewable at http://[your-username].github.io/[your-repo-name]. Be sure to update the `homepage` property in your `package.json`.

GitHub Pages isn't the most robust of hosting solutions (you'll eventually run into relative path issues), but it's a great place to quickly share in-progress work, and you get it for free.

[Surge.sh](http://surge.sh/) is a great alternative for production-ready static hosting to check out, and are just as easy to deploy to. Where ever you're deploying to, all you need to do is `npm run gulp production` and transfer the contents of the `public` folder to your server however you see fit.

# Task Details

#### JS
```
gulpfile.js/tasks/webpackWatch
gulpfile.js/tasks/webpackProduction
```
Modular ES6 with [Babel](http://babeljs.io/) and [Webpack](http://webpack.github.io/)

I've included various examples of generating mulitple files, async module loading and splitting out shared dependences to show the power of Webpack. Adjust the webpack config (`.gulpfile.js/config/webpack`) to fit your project. For smaller one-pagers, you'll probably want to skip the async stuff, and just compile a single bundle.

There are a couple of webpack options exposed in the top-level `gulpfile.js/config.json` file.

`entries`: Discrete js bundle entry points. A js file will be bundled for each item. Paths are relative to the `javascripts` folder. This maps directly to `webpackConfig.entry`.

`extractSharedJs`: Creates a `shared.js` file that contains any modules shared by multiple bundles. Useful on large sites with descrete js running on different pages that may share common modules or libraries. Not typically needed on smaller sites.

If you want to mess with the specifics of the webpack config, check out `gulpfile.js/lib/webpack-multi-config.js`.

#### CSS
```
gulpfile.js/tasks/css
```
Your Sass gets run through Autoprefixer, so don't prefix! The examples use the indented `.sass` syntax, but use whichever you prefer.

#### HTML
```
gulpfile.js/tasks/html
```
Robust templating with [Nunjucks](https://mozilla.github.io/nunjucks/). Nunjucks is nearly identical in syntax to Twig (PHP), and replaces Swig (and Twig-like js templating language), which is no longer maintained.

#### Static Files (favicons, app icons, etc.)
There are some files that belong in your root destination directory that you won't want to process or revision in production. Things like [favicons, app icons, etc.](http://realfavicongenerator.net/), should go in `src/static`, and will get copied over to `public` as a last step (after revisioning in production). *Nothing* should ever go directly in `public`, since it gets completely trashed and re-built when running the `default` or `production` tasks.
