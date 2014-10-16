'use strict';

/**
 * @ngdoc overview
 * @name jetgrizzlyApp
 * @description
 * # jetgrizzlyApp
 *
 * Main module of the application.
 */
<<<<<<< HEAD
angular.module('jetgrizzlyApp', []);
=======
angular.module('jetgrizzlyApp', [])

.controller('PlayerController', function($scope, playerFactory) {

  //Load the player on initial entering of room
  $scope.yt = {
    width: 640,
    height: 390,
    videoid: "M7lc1UVf-VE"
  };

  //Link up with songqueue, insert new property of videoID
  // i.e. videoID: song.split('=')[1]
  $scope.queueSong = function(){
    playerFactory.playSong($scope.songUrl);
  };

})



.factory('playerFactory', function() {
  //queueSong function from controller calls this 
  var playSong = function(song) {
  }

  return {
    playerSong: playSong
  }
})



.directive('youtube', function($window) {

  return {
    restrict: "E",

    scope: {
      height:  "@",
      width:   "@",
      videoID: "@"
    },
  
  template: '<div></div>',

  link: function(scope, element) {
    //Load the player API code asynchrounously (can move this to controller after we set up queue)
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

     // Make new YouTube player after the API code downloads
    var player;
    $window.onYouTubePlayerAPIReady = function() {
      player = new YT.Player(element.children()[0], {
        playerVars:{
          html5: 1,
          autoplay: 0
        },
        height: scope.height,
        width: scope.width,
        videoID: scope.videoid
      });
    };

    //Check if the API is ready at run-time
    if ($window.YT) {
      onYouTubePlayerAPIReady();
    }

    //Watch for change in video, maybe not needed in a queue later
    scope.$watch('videoid', function(newValue, oldValue) {
      if (newValue == oldValue) {
        return;
      }
      player.cueVideoById(scope.videoid);
    })
  },

}

});

>>>>>>> (feat) Made directive for adding youtube link and embedding into index.html
