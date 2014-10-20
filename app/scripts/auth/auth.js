"use strict";

var module = angular.module('jetgrizzlyApp.Auth', ['ui.router','firebase']);
var previousLocation = null;
module.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    parent: 'app',
    templateUrl: 'views/auth/login.html',
    controller: function ($scope, currentUser, Auth,$location) {
      $scope.user = {};
      $scope.Auth = Auth;
      if(currentUser){
        $location.path('/');
      }
    }
  });
  $stateProvider.state('register', {
    url: '/register',
    parent: 'app',
    templateUrl: 'views/auth/register.html',
    controller: function ($scope, Auth, $location, currentUser) {
      $scope.user = {};
      $scope.Auth = Auth;
      if(currentUser){
        $location.path('/');
      }
    }
  });
  $stateProvider.state('logout', {
    url: '/logout',
    parent: 'app',
    controller: function ($scope, Auth,$location) {
      Auth.$logout();
      $location.path('/')
    }
  });
});
module.factory('Auth', function ($timeout, $q, config,$firebaseSimpleLogin) {
  var ref = new Firebase(config.firebase.url+'/');
  return $firebaseSimpleLogin(ref);
});