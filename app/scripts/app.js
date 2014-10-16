'use strict';

/**
 * @ngdoc overview
 * @name jetgrizzlyApp
 * @description
 * # jetgrizzlyApp
 *
 * Main module of the application.
 */
angular.module('jetgrizzlyApp', [])

.controller('PlayerController', function($scope, $window, playerFactory) {

  //Initial settings
  $scope.yt = {
    width: 640,
    height: 390,
    videoid: undefined
  };
  //test: "EJs8UWLBVVI"
  

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
    //elements attribute settings i.e. id, height attrs
    restrict: "E",

    scope: {
      //bind attrs to our directive scope
      //one way binding - data changed in the view is updated in javascript
      height: "@",
      width: "@",
      videoid: "@"
    },

    //template to put inside of directive
    template: '<div></div>',

    link: function(scope, element) {
      //Load the iFrame player API code asynchronously
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;

      $window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 1,
            html5: 1,
          },
          //This will allow the view to change in real time
          height: scope.height,
          width: scope.width,
          videoId: scope.videoid, 
        });
      }

      //If a change is made to videoid via input box in view, this will see the change and runs callback
      scope.$watch('videoid', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }
        //YouTube will instantly change the currently playing video
        player.cueVideoById(scope.videoid);

      }); 
    }  
  };
});

<<<<<<< HEAD
>>>>>>> (feat) Made directive for adding youtube link and embedding into index.html
=======


>>>>>>> (feat) Can update YouTube Player on index.html with iFrame
