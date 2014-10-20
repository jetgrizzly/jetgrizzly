# Project structure

## Table of contents


## Introduction
This file describes our project structure and modules used.

## Yeoman
The app was generated using the yeoman ``generator-angular`` generator. Read their documentation for a base understanding of how to contribute to this project

Besides using the generator, we modified some parts to make deployment easier.

## Getting started
Fork the repo and install dependencies. You need to have ruby installed and the compass gem.

`gem install compass` then `npm install && bower install`

To start development just do `grunt serve`

## Building the minified app.

We modified the original angular template to generate a dist folder compatible with heroku. For this we created an index.js file that get's copied to `dist` on build. If you run `node index.js` from the project folder, this won't work, use `grunt serve` instead. The index.js file is meant to be run from the dist folder after the project has been built:
`cd dist` then `node index.js`

We also included a file Procfile that spins up a web dyno and runs the app for you.

Both `Procfile` and `index.js` are copied by the `grunt copy:dist` tasks.

## Deployment with build control

Manual deployment with build control is extremely straight forward, just do `grunt build:control`.
Note that this will only work if your computer have access to the specified