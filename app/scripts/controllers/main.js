'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jetgrizzlyApp
 */
angular.module('jetgrizzlyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('jetgrizzlyApp')
  .controller('VideoQueueController', ['$scope', 'UserPresenceFactory', function ($scope, UserPresenceFactory) {
    //Listen for new users to lobby
    $scope.totalViewers = 0;

    $scope.$on('onOnlineUser', function() {
      $scope.$apply(function() {
        $scope.totalViewers =   
          UserPresenceFactory.getOnlineUserCount();
      });
    });

    $scope.userQueue = [];
    $scope.addToQueue = function(item) {
      $scope.userQueue.push(item);
    };
  }])
  .factory('UserPresenceFactory', ['$rootScope', function($rootScope) {
    var onlineUsers = 0;

    //Create firebase references
    var listRef = new Firebase('https://blistering-heat-6745.firebaseio.com/presence/');
    var userRef = listRef.push(); 
    var presenceRef = new Firebase('https://blistering-heat-6745.firebaseio.com/.info/connected');

    //Add ourselves to the presence list when online
    presenceRef.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.set(true);
        // Remove ourselves when we disconnect.
        userRef.onDisconnect().remove();
      }
    });

    // Get the user count and notify the application
    listRef.on('value', function(snapshot) {
      onlineUsers = snapshot.numChildren();
      $rootScope.$broadcast('onOnlineUser');
    });

    var getOnlineUserCount = function() {
      return onlineUsers;
    };

    return {
      getOnlineUserCount: getOnlineUserCount
    };
  }]);