'use strict';

describe('Service: playerState', function () {

  // load the service's module
  beforeEach(module('jetgrizzlyApp'));

  // instantiate service
  var playerState;
  beforeEach(inject(function (_playerState_) {
    playerState = _playerState_;
  }));

  it('should do something', function () {
    expect(!!playerState).toBe(true);
  });

});
