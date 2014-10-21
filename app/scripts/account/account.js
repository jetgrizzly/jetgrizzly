/*jshint -W020 */
'use strict';
module = angular.module('jetgrizzlyApp.Account',['ui.router']).config(function($stateProvider){
  $stateProvider.state('account',{
    url:'/account',
    parent:'app',
    templateUrl:'views/account/account.html',
    controller:function($scope,currentUser){
      $scope.user = currentUser;
    }
  });
  $stateProvider.state('register',{
    url:'/register',
    parent: 'guest',
    templateUrl:'views/account/register.html',
    controller:function($scope){
    }
  });
});