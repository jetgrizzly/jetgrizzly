'use strict';

describe('Controller: VideoqueueCtrl', function () {

  // load the controller's module
  beforeEach(module('jetgrizzlyApp'));

  var VideoqueueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideoqueueCtrl = $controller('VideoqueueCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.addToQueue).not.toBe(undefined);
    expect(scope.removeFirst).not.toBe(undefined);
  });
});
