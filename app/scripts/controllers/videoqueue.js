'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:VideoQueueController
 * @description
 * # VideoQueueController
 * Controller of the jetgrizzlyApp
 */
(function(){
angular.module('jetgrizzlyApp')
  .controller('VideoQueueController', ['$rootScope', '$scope', 'userPresence', '$window', 'config', '$firebase', function ($rootScope, $scope, userPresence, $window, config, $firebase) {
    // declare variables
    $scope.totalUsers = 0;

    var queueRef = new $window.Firebase(config.firebase.url+'/queue/');
    var sync = $firebase(queueRef);
    $scope.queue = sync.$asArray();

    // listen for new users to lobby (emitted from UserPresenceFactory)
    $scope.$on('onOnlineUser', function() {
      $scope.$apply(function() {
        $scope.totalUsers = userPresence.getOnlineUserCount();
      });
    });

    $scope.addToQueue = function(item) {
      console.log('Link added: '+item);
      $scope.queue.$add(item).then(function(){
        console.log('scope.item', $scope.item);
        $scope.item = '';
        $scope.queueForm.$setPristine();
        console.log('Queue size: '+$scope.queue.length+'; Player is in state: '+$scope.playerState);
      });
    };
  }]);

})();
