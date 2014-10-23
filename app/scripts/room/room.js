'use strict';
/*jshint -W020 */
module = angular.module('jetgrizzlyApp.Room', ['ui.router']).config(function ($stateProvider) {
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
          console.log(youtubeInfo.isPlaying);

          if(youtubeInfo.isPlaying){
            var currentVideo = youtubeInfo.currentVideo;
            var startTime = Math.floor((Date.now() - youtubeInfo.startTime) / 1000);
            console.log('A video is currently playing: '+currentVideo);
            console.log('Start time: '+startTime);

            player = new window.YT.Player(element.children()[0], {
              playerVars: {
                autoplay: 1,
                html5: 1,
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
                    $rootScope.playerState = 1;
                    $rootScope.$broadcast('videoEnded');
                  } else if (event.data === 1) {
                    console.log('Player is playing');
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
          } else {
            player = new window.YT.Player(element.children()[0], {
              playerVars: {
                autoplay: 0,
                html5: 1,
              },
              //This will allow the view to change in real time
              height: scope.height,
              width: scope.width,
              videoId: scope.videoid,
              events: {
                'onStateChange': function(event){
                  console.log('youtube player has a stateChange');
                  if (event.data === 0){
                    console.log('youtube player video ended');
                    $rootScope.playerState = 0;
                    $rootScope.$broadcast('videoEnded');
                  } else if (event.data === 1) {
                    console.log('Player is playing');
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
        
        //Alex, there is an issue with this listener. Right now it works fine when there is already a video playing
        //And there are videos in the queue, but setting 'startTime' and 'isPlaying' triggers a new round of
        //'child_changed' events, which sets off another. When the queue is empty and the first video is entered, this
        //kicks off an infinite loop. We should change it so that we don't listen for changes on 'startTime' or 'isPlaying'
        videoFirebase.on('value', function(childSnapshot){
           console.log('Room.js sees new video');
           youTubeFirebase.child('startTime').set(Date.now());
           youTubeFirebase.child('isPlaying').set(true);
           console.log('childSnapshot', childSnapshot);
           player.loadVideoById({'videoId': childSnapshot.val()}); 
        });
      };

      scope.$watch('videoid', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          console.log('setting new video value');
          var firebase = new $window.Firebase(config.firebase.url+'/youTube');
          firebase.child('startTime').set(Date.now());
          firebase.child('isPlaying').set(true);
          firebase.child('currentVideo').set(newValue); 
        }
      });
    }
  };
});

