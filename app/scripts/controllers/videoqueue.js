'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:VideoqueueCtrl
 * @description
 * # VideoqueueCtrl
 * Controller of the jetgrizzlyApp
 */
angular.module('jetgrizzlyApp')
  .controller('VideoqueueCtrl', ['$rootScope', '$scope', 'userPresence', '$window', 'config', '$firebase', function ($rootScope, $scope, userPresence, $window, config, $firebase) {
    //Declare variables
    $scope.totalUsers = 0;
    // $scope.ytRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

    var queueRef = new $window.Firebase(config.firebase.url+'/queue/');
    var sync = $firebase(queueRef);
    $scope.queue = sync.$asArray();

    var videoRef = new $window.Firebase(config.firebase.url+'/youTube');

    //Listen for new users to lobby (emitted from UserPresenceFactory)
    $scope.$on('onOnlineUser', function() {
      $scope.$apply(function() {
        $scope.totalUsers = userPresence.getOnlineUserCount();
      });
    });

    $scope.$on('videoEnded', function() {
      $scope.$apply(function() {
        var newVid = $scope.queue[0].$value;
        $scope.removeFirst();
        videoRef.child('currentVideo').set(newVid);
      });
    });

    $scope.addToQueue = function(item) {
      var id = item.split('v=')[1];
      console.log(item, id);
      $scope.queue.$add(id);
    };

    $scope.removeFirst = function() {
      $scope.queue.$remove($scope.queue[0]);
    };
  }]);