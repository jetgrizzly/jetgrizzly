'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jetgrizzlyApp
 */
angular.module('jetgrizzlyApp')
  .controller('QueueController', function ($scope) {
    $scope.userQueue = [];
    $scope.addToQueue = function(item) {
      $scope.userQueue.push(item);
    };
  });
