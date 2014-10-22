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
        //This is showing as undefined
        var newVid = $scope.queue[0].$value.split('v=')[1];
        console.log("Newvid is: ", newVid);
        $scope.removeFirst();
        videoRef.child('currentVideo').set(newVid);
      });
    });

    $scope.testEvent = function() {
      var newVid = $scope.queue[0].$value.split('v=')[1];
      console.log("Newvid is: ", newVid);
      $scope.removeFirst();
      videoRef.child('currentVideo').set(newVid);
    };

    $scope.addToQueue = function(item) {
      console.log(item);
      $scope.queue.$add(item);
    };

    $scope.removeFirst = function() {
      $scope.queue.$remove($scope.queue[0]);
    };
  }]);