'use strict';

/**
 * @ngdoc function
 * @name jetgrizzlyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jetgrizzlyApp
 */
angular.module('jetgrizzlyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
