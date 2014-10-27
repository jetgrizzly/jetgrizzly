'use strict';

describe('Controller: VideoqueueCtrl', function () {
  var VideoqueueCtrl,
    scope,
    len;

  // load the controller's module
  beforeEach(module('jetgrizzlyApp'));


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideoqueueCtrl = $controller('VideoqueueCtrl', {
      $scope: scope
    });

    len = scope.queue.length;
  }));

  it('Queue length should be zero to start', function() {
    expect(len).toBe(0);
  });

  it('should have an addToQueue function', function () {
    expect(scope.addToQueue).not.toBe(undefined);
  });
});
