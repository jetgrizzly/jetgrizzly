'use strict';
module = angular.module('jetgrizzlyApp.Room', ['ui.router']).config(function ($stateProvider) {
  $stateProvider.state('lobby', {
    url: '/',
    parent: 'app',
    templateUrl: 'views/room/room.html',
    controller: function ($scope, currentUser) {
      $scope.user = currentUser;
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
  .directive('youtube', function ($window, config) {
    return {
      //elements attribute settings i.e. id, height attrs
      restrict: 'E',
      scope: {
        //bind attrs to our directive scope
        //one way binding - data changed in the view is updated in javascript
        height: '@',
        width: '@',
        videoid: '@',
      },
      //template to put inside of directive
      template: '<div></div>',
      link: function (scope, element) {
        //Load the iFrame player API code asynchronously
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var player;


        $window.onYouTubeIframeAPIReady = function () {
          var isPlaying
          var youTubeFirebase = new Firebase('https://blistering-heat-6745.firebaseio.com/youTube');

          youTubeFirebase.once('value', function(snap){
            var youtubeInfo = snap.val();
            console.log(youtubeInfo.isPlaying);

            if(youtubeInfo.isPlaying){
              console.log('video should be playing');
              var currentVideo = youtubeInfo.currentVideo;
              var startTime = Math.floor((Date.now() - youtubeInfo.startTime) / 1000);
              // console.log($scope.yt.start);
              console.log(startTime);
              console.log(currentVideo);

              player = new window.YT.Player(element.children()[0], {
                playerVars: {
                  autoplay: 1,
                  html5: 1,
                  start:  Math.floor((Date.now() - youtubeInfo.startTime) / 1000)
               },
               //This will allow the view to change in real time
                height: scope.height,
                width: scope.width,
                videoId: currentVideo,
               // startSeconds: startTime
             });
              // player.loadVideoById({'videoId': currentVideo, 'startSeconds': startTime });
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
              });       
            }
          });
          
        };
        //If a change is made to videoid via input box in view, this will see the change and runs callback
        scope.$watch('videoid', function (newValue, oldValue) {


          if (newValue !== oldValue) {
            console.log("setting new video value")
            var firebase = new Firebase(config.firebase.url+'/youTube');
            firebase.child('startTime').set(Date.now());
            firebase.child('isPlaying').set(true);
            firebase.child('currentVideo').set(newValue);

            var currentVideo = new Firebase('https://blistering-heat-6745.firebaseio.com/youTube');
            currentVideo.once('value', function(snap){
              var obj = snap.val();
              console.log(obj.currentVideo);
            });
            
            
          }
          //Whenever I play video, I should be recording it's timer too
          //YouTube will instantly change the currently playing video
        });
      }
    };
});

