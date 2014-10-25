'use strict';
/*jshint -W020 */
(function(){
var module = angular.module('jetgrizzlyApp.Room', ['ui.router']).config(function ($stateProvider) {
  $stateProvider.state('lobby', {
    url: '/',
    parent: 'app',
    templateUrl: 'views/room/room.html',
    controller: function ($scope, user) {
      $scope.user = user;
    }
  });
})
.controller('PlayerController',function ($scope, $window, config) {
//Initial settings
 $scope.yt = {
  width: 640,
  height: 390
 };
})
.directive('youtube', function ($rootScope, $window, config, $firebase) {
  return {
    //elements attribute settings i.e. id, height attrs
    restrict: 'E',
    scope: {
      //bind attrs to our directive scope
      //one way binding - data changed in the view is updated in javascript
      height: '@',
      width: '@',
      videoid: '@'        
    },
    //template to put inside of directive
    template: '<div></div>',
    link: function (scope, element) {
      //Load the iFrame player API code asynchronously
      var tag = element.append('<script src="https://www.youtube.com/iframe_api">');
      var player;
      $window.onYouTubeIframeAPIReady = function () {

        var youTubeFirebase = new $window.Firebase(config.firebase.url+'/youTube');
        var videoFirebase = new $window.Firebase(config.firebase.url+'/youTube/currentVideo');
        var videoObj = $firebase(videoFirebase).$asObject();
        youTubeFirebase.once('value', function(snap){
          var youtubeInfo = snap.val();
          console.log('Video currently playing is ', youtubeInfo.isPlaying);
          // Check to see if a video is currently playing
          if(youtubeInfo.isPlaying){
            var currentVideo = youtubeInfo.currentVideo;
            var startTime = Math.floor((Date.now() - youtubeInfo.startTime) / 1000);
            console.log('A video is currently playing: '+currentVideo);
            console.log('Start time: '+startTime);
            player = new $window.YT.Player(element.children()[0], {
              playerVars: {
                autoplay: 1,
                html5: 1,
                controls: 0,
                start: startTime
             },
             //This will allow the view to change in real time
              height: scope.height,
              width: scope.width,
              videoId: currentVideo,
              events: {
                'onStateChange': function(event){
                  console.log('youtube player has a stateChange');
                  if (event.data === 0){
                    console.log('youtube player video ended');
                    youTubeFirebase.child('isPlaying').set(false);
                    youTubeFirebase.child('currentVideo').set('');
                    $rootScope.playerState = 1;
                    $rootScope.$broadcast('videoEnded');
                  } else if (event.data === 1) {
                    console.log('Player is playing');
                    youTubeFirebase.child('isPlaying').set(true);
                    $rootScope.playerState = 1;
                  } else if (event.data === 2) {
                    console.log('Player is paused');
                    $rootScope.playerState = 2;
                  } else if (event.data === 3) {
                    console.log('Player is buffering');
                    $rootScope.playerState = 3;
                  } else {
                    console.log(event.data);
                  }
                }
              }
           });
          // If no video is currently playing, check to see if there 
          //   are any in the queue
          } else {
            player = new $window.YT.Player(element.children()[0], {
              playerVars: {
                autoplay: 0,
                controls: 0,
                html5: 1,
              },
              //This will allow the view to change in real time
              height: scope.height,
              width: scope.width,
              videoId: scope.videoid,
              events: {
                'onReady': function(){
                  youTubePlayerReady(player);
                },
                'onStateChange': function(event){
                  console.log('youtube player has a stateChange');
                  if (event.data === 0){
                    console.log('youtube player video ended');
                    youTubeFirebase.child('isPlaying').set(false);
                    youTubeFirebase.child('currentVideo').set('');
                    $rootScope.playerState = 0;
                    $rootScope.$broadcast('videoEnded');
                  } else if (event.data === 1) {
                    console.log('Player is playing');
                    youTubeFirebase.child('isPlaying').set(true);
                    $rootScope.playerState = 1;
                  } else if (event.data === 2) {
                    console.log('Player is paused');
                    $rootScope.playerState = 2;
                  } else if (event.data === 3) {
                    console.log('Player is buffering');
                    $rootScope.playerState = 3;
                  } else {
                    console.log(event.data);
                  }
                }
              }
            });
          }
        });
        var youTubePlayerReady = function(player){
          console.log('YouTube player is ready');
          videoFirebase.on('value', function(newValue){
            console.log('player = ', player);
            // Check the newValue length (youtube link) to see if it exists
            // videoFirebase.on is geting triggered on the initial load which we don't want,
            //   this is a cheap fix around it
            if(newValue.val().length > 0){
              youTubeFirebase.child('startTime').set(Date.now());
              player.loadVideoById({'videoId': newValue.val()}); 
            }
          });
        };
      };
      // In case you browse to another menu, this will reload the player
      if($window.YT !== undefined){
          $window.onYouTubeIframeAPIReady();
      }
    }
  };
  });
})();
