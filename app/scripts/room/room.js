'use strict';
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
  .controller('PlayerController',function ($scope, $window, playerFactory, config) {
  //Initial settings
   $scope.yt = {
    width: 640,
    height: 390
   };

  //Link up with songqueue, insert new property of videoID
  // i.e. videoID: song.split('=')[1]
  $scope.queueSong = function () {
    playerFactory.playSong($scope.songUrl);
  };

}).factory('playerFactory', function () {
  //queueSong function from controller calls this
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
          var isPlaying;
          var youTubeFirebase = new $window.Firebase(config.firebase.url+'/youTube');
          var videoFirebase = new $window.Firebase(config.firebase.url+'/youTube/currentVideo')

          youTubeFirebase.once('value', function(snap){
            var youtubeInfo = snap.val();
            console.log(youtubeInfo.isPlaying);

            if(youtubeInfo.isPlaying){
              console.log('video should be playing');
              var currentVideo = youtubeInfo.currentVideo;
              var startTime = Math.floor((Date.now() - youtubeInfo.startTime) / 1000);
              console.log(startTime);
              console.log(currentVideo);

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
                    console.log("youtube player has a stateChange");
                    console.log("Event data ", event.data);
                    if(event.data === 1){
                      console.log("youtube player video ended")
                      $rootScope.$broadcast('videoEnded');
                    }
                  }
                }
             });
            }
            else {
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
                    console.log("youtube player has a stateChange");
                    console.log("Event data ", event.data);
                    if(event.data === 1){
                      console.log("youtube player video ended")
                      $rootScope.$broadcast('videoEnded');
                    }
                  }
                }
              });       
            }
          });
          
          //If a change is made to videoid via input box in view, this will see the change and runs callback
          videoFirebase.on('child_changed', function(childSnapshot, prevChildName){
             console.log('firebase value changed');
             youTubeFirebase.child('startTime').set(Date.now());
             youTubeFirebase.child('isPlaying').set(true);
             youTubeFirebase.child('currentVideo').set(childSnapshot);
             console.log('childSnapshot', childSnapshot)
             player.loadVideoById({'videoId': childSnapshot.val()}); 
          });
        };

        scope.$watch('videoid', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            console.log("setting new video value")
            var firebase = new Firebase(config.firebase.url+'/youTube');
            firebase.child('startTime').set(Date.now());
            firebase.child('isPlaying').set(true);
            firebase.child('currentVideo').set(newValue); 
          }
        });
      }
    };
});

