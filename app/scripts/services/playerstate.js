'use strict';

/**
 * @ngdoc service
 * @name jetgrizzlyApp.playerState
 * @description
 * # playerState
 * Factory in the jetgrizzlyApp.
 */
angular.module('jetgrizzlyApp')
  .factory('playerState', function (config, $window, $q) {
    var youtubeRef = new $window.Firebase(config.firebase.url+'/youTube');
    var currentVideoObject  = {isPlaying:false,currentVideo:""};

    // Video change is deferred so that player plays next when appropiate
    var deferredVideoChange = $q.defer();


    // Listen to value changes on firebase to resolve the promise when video changes.
    youtubeRef.on('value',function(snapshot){
      var data = snapshot.val();
      if(currentVideoObject.currentVideo !== data.currentVideo){
        if(data.currentVideo){

          // Video change is resolved so that players can react to it.
          deferredVideoChange.resolve(data);

          // after resolving we defer again for the next video
          deferredVideoChange = $q.defer();

          // we keep track of current video to detect videoChanges and delegate property access.
          currentVideoObject = data;
        }
      }
    });
    // Public API here
    return {
      isPlaying: function(){
        return currentVideoObject.isPlaying;
      },
      getCurrentVideoId: function () {
        return currentVideoObject.currentVideo;
      },
      getCurrentVideoTime: function(){
        return Math.floor((Date.now()-currentVideoObject.startTime)/1000);
      },
      ready:function(){
        // if the deferredVideoChange is resolved, the video will have startTime
        if(currentVideoObject.startTime){
          var d = $q.defer();
          // we resolve a promise at once with the current video.
          d.resolve(currentVideoObject);
          return d.promise;
        }else{
          // If not we get the deferred video change promise.
          return this.getNextVideo();
        }
      },
      getNextVideo: function(){
        return deferredVideoChange.promise;
      }
    };
  });
