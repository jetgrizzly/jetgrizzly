'use strict';

describe('Service: userPresence', function () {

  // load the service's module
  beforeEach(module('jetgrizzlyApp'));

  // instantiate service
  var userPresence;
  beforeEach(inject(function (_userPresence_) {
    userPresence = _userPresence_;
  }));

  it('should do something', function () {
    expect(!!userPresence).toBe(true);
  });

});
