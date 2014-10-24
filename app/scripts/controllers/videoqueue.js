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
        console.log('Video Queue CTRL has heard videoEnded Event');
        if ($scope.queue.length > 0) {
          var newVid = $scope.queue[0].$value.split('v=')[1];
          console.log('Newvid is: ', newVid);
          $scope.removeFirst();
          videoRef.child('currentVideo').set(newVid);
        } else {
          console.log('Video Queue CTRL: There are no videos to play.');
        }
      });
    });

    $scope.addToQueue = function(item) {
      console.log('Link added: '+item);
      $scope.queue.$add(item).then(function(){
        console.log('Queue size: '+$scope.queue.length+'; Player is in state: '+$scope.playerState);
        //The if statement below never gets triggered because playerState never
        //gets set to 0 somehow... or it gets set back to 1 insanely quickly...
        if ($scope.queue.length === 1 && ($scope.playerState === 0 || $scope.playerState === undefined)) {
          var newVid = $scope.queue[0].$value.split('v=')[1];
          console.log('Newvid is: ', newVid);
          videoRef.child('currentVideo').set(newVid);
          $scope.removeFirst();
        }
      });

      //This function needs to know: 1) If there is a video currently playing, 2) The current size of the queue
      //If queue.length > 0, push item into queue
      //If queue.length === 0 && video is playing, push item into queue
      //If queue.length === 0 && video is not playing, change currentVideo in firebase and start playing video right away
    };

    $scope.removeFirst = function() {
      $scope.queue.$remove($scope.queue[0]).then(function(){
        console.log('Queue size: '+$scope.queue.length+'; Player is in state: '+$scope.playerState);
      });
    };
  }]);