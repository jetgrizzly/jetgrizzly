'use strict';
/*jshint -W079 */
(function(){
var module = angular.module('jetgrizzlyApp.Auth', ['firebase.utils', 'ui.router', 'firebase']);
var previousLocation = null;
module.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    parent: 'app',
    templateUrl: 'views/auth/login.html',
    controller: 'LoginController'
  });
  $stateProvider.state('register', {
    url: '/register',
    parent: 'app',
    templateUrl: 'views/auth/register.html',
    controller: 'RegisterController'
  });
  $stateProvider.state('logout', {
    url: '/logout',
    parent: 'app',
    controller: 'LogoutController'
  });
});
module.controller('LoginController', function ($scope, SimpleLogin, $state, $stateParams) {
  $scope.user = {};
  $scope.login = function() {
    SimpleLogin.login($scope.user.email, $scope.user.password)
      .then(function(user) {
        $state.go('lobby', $stateParams, {
          reload: true
        });
      });
  };
});
module.controller('RegisterController', function ($scope, $state, SimpleLogin, $stateParams) {
  $scope.user = {};
  $scope.registerUser = function() {
    SimpleLogin.createAccount($scope.user.email, $scope.user.password)
      .then(function(user) {
        console.log(user, 'Registered');
        $state.go('lobby', $stateParams, {
          reload: true
        });
      });
  };
});
module.controller('LogoutController', function (config, SimpleLogin, $state, $scope, $stateParams) {
  SimpleLogin.logout();
  $state.go('login', $stateParams, {
    reload: true
  });
});
module.factory('SimpleLogin', ['fbutil', '$timeout', '$window', '$firebaseSimpleLogin', '$rootScope', function (fbutil, $timeout, $window, $firebaseSimpleLogin, $rootScope) {
  // var ref = new $window.Firebase(fbutil.ref());
  var auth = $firebaseSimpleLogin(fbutil.ref2());
  var statusChange = function() {
    functions.getUser().then(function(user) {
      functions.user = user || null;
    });
  };
  var functions = {
    user: null,
    logout: function() {
      auth.$logout();
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
      console.log(email, 'logged in.');
      return id;
    },
    createAccount: function(email, pass) {
      return auth.$createUser(email, pass)
        .then(function() {
          console.log("Registering...")
          return functions.login(email, pass);
        });
    },
  };
  $rootScope.$on('firebaseSimpleLogin:login', statusChange);
  $rootScope.$on('firebaseSimpleLogin:logout', statusChange);
  statusChange();
  return functions;
}]);
})();


