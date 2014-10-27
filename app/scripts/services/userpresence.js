'use strict';

/**
 * @ngdoc service
 * @name jetgrizzlyApp.userPresence
 * @description
 * # userPresence
 * Factory in the jetgrizzlyApp.
 */
angular.module('jetgrizzlyApp')
  .factory('userPresence', ['$rootScope','config', function($rootScope,config) {
    var onlineUsers = 0;

    // create firebase references
    var listRef = new window.Firebase(config.firebase.url+'/presence/');
    var userRef = listRef.push(); 
    var presenceRef = new window.Firebase(config.firebase.url+'/.info/connected');

    // add ourselves to the presence list when online
    presenceRef.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.set(true);
        // remove ourselves when we disconnect
        userRef.onDisconnect().remove();
      } 
    });

    // get the user count and notify the application
    listRef.on('value', function(snapshot) {
      onlineUsers = snapshot.numChildren();
      $rootScope.$broadcast('onOnlineUser');
    });

    var getOnlineUserCount = function() {
      return onlineUsers;
    };

    return {
      getOnlineUserCount: getOnlineUserCount
    };
  }]);
