'use strict';

angular.module('jetgrizzlyApp.chat', ['firebase'])
	.controller('chatController', function($scope, $firebase, $location, $anchorScroll,config) {
    var myChat = new Firebase(config.firebase.url+'/messages');
    var limit = myChat.limit(30);
    //create an AngularFire reference to the data and download the data into a local object
    var sync = $firebase(limit);
    $scope.messages = sync.$asArray();

    //synchronize the object with 3-way data binding
    $scope.addMessage = function(user, text) {
      $scope.messages.$add({user: user, text: text});
      //supposed to set location to auto scroll to bottom??
      $location.hash('bottom');
      // if ($scope.messages.length > 5) {
      //   $scope.messages[0].remove;
      // }
      $anchorScroll();
    };
  });