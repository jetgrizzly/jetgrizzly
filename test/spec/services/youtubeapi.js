'use strict';

describe('Service: youtubeApi', function () {
  var $timeout;
  // load the service's module
  beforeEach(module('jetgrizzlyApp'));
  // instantiate service
  var youtubeApi;
  beforeEach(inject(function (_youtubeApi_,_$timeout_) {
    $timeout = _$timeout_;
    youtubeApi = _youtubeApi_;
  }));
  it('should exist', function () {
    expect(!!youtubeApi).toBe(true);
  });
  it('should have a getYT function', function () {
    expect(youtubeApi.getYT).not.toBe(undefined);

  });
  it('should resolve the promise with the YT api when the youtube callback is called', inject(function ($window) {

    var cb = jasmine.createSpy('resolve');
    //the return of login should return a promise, with that promise
    //call the cb
    youtubeApi.getYT().then(cb);

    expect($window.onYouTubePlayerAPIReady).not.toBe(undefined);

    expect(cb).not.toHaveBeenCalled();

    // This is done by the youtube api on a real scenario
    $window.onYouTubePlayerAPIReady();
    $timeout.flush();
    // It must trigger the promise resolve
    expect(cb).toHaveBeenCalled();
  }));

});
