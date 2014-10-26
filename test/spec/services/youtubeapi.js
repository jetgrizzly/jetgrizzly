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
  it('should resolve the promise when the youtube callback is called', inject(function ($window) {

    var cb = jasmine.createSpy('resolve');
    //the return of login should return a promise, with that promise
    //call the cb
    youtubeApi.getYT().then(cb);

    expect($window.onYouTubePlayerAPIReady).not.toBe(undefined);
    $window.onYouTubePlayerAPIReady();
    expect(cb).not.toHaveBeenCalled();
    $timeout.flush();
    expect(cb).toHaveBeenCalled();
  }));

});
