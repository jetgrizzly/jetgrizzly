'use strict';

/**
 * @ngdoc service
 * @name jetgrizzlyApp.youtubeApi
 * @description
 * # youtubeApi
 * Factory that initializes the youtube iFrame API and exposes it as a service to the rest of the application as a service.
 */
angular.module('jetgrizzlyApp')
  .factory('youtubeApi', function ($q, $window) {
    var d = $q.defer();
    // load the IFrame Player API code asynchronously
    // we can use the global document since this will only run once
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/player_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // resolve promise with YouTube player after the API code downloads
    $window.onYouTubePlayerAPIReady = function() {
      d.resolve($window.YT);
    };

    return {
      getYT: function() {
        return d.promise; 
      }
    };
  });
