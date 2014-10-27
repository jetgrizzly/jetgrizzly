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
// initial settings
 $scope.yt = {
  width: 640,
  height: 390
 };
})
.directive('youtube', function ($window, config, youtubeApi, playerState) {
  return {
    // elements attribute settings i.e. id, height attrs
    restrict: 'E',
    scope: {
      // bind attrs to our directive scope
      // one way binding - data changed in the view is updated in javascript
      height: '@',
      width: '@'
    },
    // template to put inside of directive
    template: '<div></div>',
    link: function (scope, element) {

      // ensure the playerState service is ready
      playerState.ready().then(function(){
        // ensure the youtube api is ready
        youtubeApi.getYT().then(function(YT){
          var lastVideo = playerState.getCurrentVideoId();
          scope.player = new YT.Player(element.children()[0], {
            playerVars: {
              autoplay: 1,
              html5: 1,
              controls: 0,
              showinfo: 0,
              rel: 0,
              enablejsapi:1,
              start: playerState.getCurrentVideoTime()
            },
            // this will allow the view to change in real time
            height: scope.height,
            width: scope.width,
            videoId: lastVideo,
            events: {
              'onStateChange': function(event){
                if (event.data === 0){ // Video has ended
                  if(playerState.getCurrentVideoId() !== lastVideo){
                    // firebase changed before our playback ended so we play it right away.
                    lastVideo =playerState.getCurrentVideoId();
                    scope.player.loadVideoById(lastVideo);
                  }else{
                    // player must wait for next video from server
                    playerState.getNextVideo().then(function(nextVideo){
                      // video wait ended and new video is loaded
                      lastVideo = nextVideo.currentVideo;
                      scope.player.loadVideoById(lastVideo);
                    });
                  }
                } else if (event.data === 1) { 
                // video is playing

                } else if (event.data === 2) { 
                // video is paused
                  // if the video is playing on server
                  if(playerState.isPlaying()){
                    //scope.player.playVideo();
                  }
                } else if (event.data === 3) { 
                // video is buffering
                
                } else {
                  console.log(event.data);
                }
              }
            }
          });
        });

      });
    }
  };
  });
})();
