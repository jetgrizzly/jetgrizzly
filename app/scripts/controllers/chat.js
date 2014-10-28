'use strict';
(function(){
var module = angular.module('jetgrizzlyApp.chat', ['firebase.utils', 'firebase']);
	module.controller('ChatController', ['fbutil', '$scope', '$window', '$firebase', '$location', '$anchorScroll', function(fbutil, $scope, $window, $firebase, $location, $anchorScroll) {
    var limit = fbutil.ref2('/messages').limit(30);
    // create an AngularFire reference to the data and download the data into a local object
    var sync = $firebase(limit);
    $scope.messages = sync.$asArray();
    // synchronize the object with 3-way data binding
    $scope.addMessage = function(user, text) {
      $scope.messages.$add({user: user, text: text});
      // set location to auto scroll to bottom
      $location.hash('bottom');
      $anchorScroll();
    };
  }]);
})();