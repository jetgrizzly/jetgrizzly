'use strict';
/*jshint -W079 */
var module = angular.module('jetgrizzlyApp.Auth', ['ui.router','firebase']);
var previousLocation = null;
module.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    parent: 'app',
    templateUrl: 'views/auth/login.html',
    controller: function ($scope, SimpleLogin, $state) {
      $scope.user = {};
      $scope.login = function() {
        SimpleLogin.login($scope.user.email, $scope.user.password)
          .then(function(user) {
            $state.go('lobby');
          });
      }
    }
  });
  $stateProvider.state('register', {
    url: '/register',
    parent: 'app',
    templateUrl: 'views/auth/register.html',
    controller: function ($scope, $state, simpleLogin) {
      $scope.user = {};
      $scope.registerUser = function() {
        SimpleLogin.createAccount($scope.user.email, $scope.user.password)
          .then(function(user) {
            $state.go('login')
          })
      }
    }
  });
  $stateProvider.state('logout', {
    url: '/logout',
    parent: 'app',
    controller: function (SimpleLogin, $state) {
      SimpleLogin.logout();
      $state.go('lobby');
    }
  });
});
module.factory('SimpleLogin', function ($timeout, $q, config,$firebaseSimpleLogin, $rootScope) {
  var ref = new Firebase(config.firebase.url+'/');
  var auth = $firebaseSimpleLogin(ref);
  var statusChange = function() {
    functions.getUser().then(function(user) {
      functions.user = user || null;
    })
  };
  var functions = {
    user: null,
    logout: function() {
      auth.$logout
    },
    getUser: function() {
      return auth.$getCurrentUser();
    },
    login: function(email, password) {
      var id = auth.$login('password', {
        email: email,
        password: password,
        rememberMe: true
      });
      return id;
    },
    createAccount: function(email, pass) {
      return auth.$createUser(email, pass)
        .then(function() {
          return functions.login(email, pass)
        })
    }
  };
  $rootScope.$on('firebaseSimpleLogin:login', statusChange);
  $rootScope.$on('firebaseSimpleLogin:logout', statusChange);
  statusChange();

  return functions;
});
module.factory('Auth', function ($timeout, $q, config,$firebaseSimpleLogin) {
  var ref = new Firebase(config.firebase.url+'/');
  return $firebaseSimpleLogin(ref);
});