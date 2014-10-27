[![Stories in Ready](https://badge.waffle.io/jetgrizzly/jetgrizzly.png?label=ready&title=Ready)](https://waffle.io/jetgrizzly/jetgrizzly)[![Build Status](https://travis-ci.org/jetgrizzly/jetgrizzly.svg?branch=master)](https://travis-ci.org/jetgrizzly/jetgrizzly)

# jetgrizzly

> Providing an open, accessible forum for exchanging videos and interacting online.

## Team

  - __Product Owner__: Alex Jeng
  - __Scrum Master__: Jose Merino
  - __Development Team Members__: Moxi Zhou, Jeff Gladchun
  
## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Architecture](#architecture)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```
### Architecture

1. Heroku + Build Control
    1. Easy Build and deployment process
1. Travis CI
    1. Automated CI Testing
    1. Continuous Deployment
1. Firebase
    1. The only backend structure for the app
    1. Simple Login / Auth
    1. Real-time 3-way Data-binding
1. Express Master Client
    1. Serves static assets
    1. Manages video queue
1. Grunt
    1. Testing
    1. Build
    1. Tasks
1. Karma
    1. Unit tests
1. Angular
1. Youtube API
1. Bootstrap

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
