'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:VideoqueueCtrl
 * @description
 * # VideoqueueCtrl
 * Controller of the jetgrizzlyApp
 */
angular.module('jetgrizzlyApp')
  .controller('VideoqueueCtrl', ['$scope', 'userPresence', '$window', 'config', '$firebase', function ($scope, userPresence, $window, config, $firebase) {
    //Declare variables
    $scope.totalUsers = 0;

    var ref = new $window.Firebase(config.firebase.url+'/queue/');
    var sync = $firebase(ref);
    $scope.queue = sync.$asArray();

    //Listen for new users to lobby (emitted from UserPresenceFactory)
    $scope.$on('onOnlineUser', function() {
      $scope.$apply(function() {
        $scope.totalUsers = userPresence.getOnlineUserCount();
      });
    });

    $scope.addToQueue = function(item) {
      console.log(item);
      $scope.queue.$add(item);
    };

    $scope.removeFirst = function() {
      $scope.queue.$remove($scope.queue[0]);
    };
  }]);