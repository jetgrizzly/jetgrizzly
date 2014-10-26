'use strict';

describe('Service: youtubeApi', function () {

  // load the service's module
  beforeEach(module('jetgrizzlyApp'));

  // instantiate service
  var youtubeApi;
  beforeEach(inject(function (_youtubeApi_) {
    youtubeApi = _youtubeApi_;
  }));

  it('should do something', function () {
    expect(!!youtubeApi).toBe(true);
  });

});
