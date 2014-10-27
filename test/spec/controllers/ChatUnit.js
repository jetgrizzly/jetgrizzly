'use strict';
/* jasmine specs for controllers go here - UNIT TESTS*/
describe('jetgrizzlyApp.chat', function(){
  var scope;
  beforeEach(function() {
    module('jetgrizzlyApp.chat');
  });
  describe('ChatController', function() {
    beforeEach(inject(function ($rootScope, $controller) {
      //need to make a new scope with module
      scope = $rootScope.$new();
      //specify the controller and use that scope
      $controller('ChatController', {$scope: scope});
    }));
    it('should define addmessage function', function() {
      expect(typeof scope.addMessage).toEqual('function');
    });
  });
});

