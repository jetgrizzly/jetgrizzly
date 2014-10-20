'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jetgrizzlyApp
 */
angular.module('jetgrizzlyApp')
  .controller('VideoQueueController', ['$scope', 'UserPresenceFactory', function ($scope, UserPresenceFactory) {
    //Declare variables
    $scope.totalUsers = 0;
    $scope.userQueue = [];
    $scope.myQueue = [];

    //Listen for new users to lobby (emitted from UserPresenceFactory)
    $scope.$on('onOnlineUser', function() {
      $scope.$apply(function() {
        $scope.totalUsers = UserPresenceFactory.getOnlineUserCount();
      });
    });

    $scope.addToQueue = function(item) {
      $scope.myQueue.push(item);
      if ($scope.myQueue.length === 1) {
        $scope.userQueue.push($scope.myQueue);
      }
    };
  }])
  .factory('UserPresenceFactory', ['$rootScope','config', function($rootScope,config) {
    var onlineUsers = 0;
    var userQueue = {};

    //Create firebase references
    var listRef = new window.Firebase(config.firebase.url+'/presence/');
    var userRef = listRef.push(); 
    var presenceRef = new window.Firebase(config.firebase.url+'/.info/connected');

    //Add ourselves to the presence list when online
    presenceRef.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.set({});
        // Remove ourselves when we disconnect.
        userRef.onDisconnect().remove();
      } 
    });

    // Get the user count and notify the application
    listRef.on('value', function(snapshot) {
      onlineUsers = snapshot.numChildren();
      userQueue = snapshot.val();
      $rootScope.$broadcast('onOnlineUser');
    });

    var getOnlineUserCount = function() {
      return onlineUsers;
    };

    return {
      getOnlineUserCount: getOnlineUserCount
    };
  }]);