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


### Getting Started
- All of the server information can be found in doc/architecture.md
- All of our database information is stored on Firebase. The YouTube player listens for changes in firebase and then it will load the next video in the queue.
- The server listens to changes on the YouTube player state. When a video ends, it will tell the server to load up the next video
- The express server acts as the 'master user', and manages all of the Firebase changes. 
- Currently the app requires that you register and login before you can submit a chat message


### Known Bugs
- If you insert an invalid link, the server will crash and you will have to restart it. Our current regex filter checks to see if a link is a youtube url, but not if it's a valid one. 
- If the next video in queue is the same as the current video, it will not update
- Chatroom doesn't scroll to bottom as a default


### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
