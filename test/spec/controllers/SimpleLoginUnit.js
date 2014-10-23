'use strict';
/* jasmine specs for controllers go here - UNIT TESTS*/

describe('jetgrizzlyApp.Auth', function(){
  var scope;
  beforeEach(function() {
    module('jetgrizzlyApp.Auth');
  });
  describe('LoginController', function() {
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('LoginController', {$scope: scope});
    }));
    it('should define login function', function() {
      expect(typeof scope.login).toEqual('function');
    });
  });
  describe('RegisterController', function() {
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('RegisterController', {$scope: scope});
    }));
    it ('should define registerUser function', function() {
      expect(typeof scope.registerUser).toEqual('function');
    });
  });
});
