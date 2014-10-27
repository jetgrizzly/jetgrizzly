'use strict';

describe('Service: videoQueue', function () {

  // load the service's module
  beforeEach(module('jetgrizzlyApp'));

  // instantiate service
  var videoQueue;
  beforeEach(inject(function (_videoQueue_) {
    videoQueue = _videoQueue_;
  }));

  it('should exist', function () {
    expect(!!videoQueue).toBe(true);
  });

});
