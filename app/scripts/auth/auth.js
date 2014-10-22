'use strict';
/*jshint -W079 */
(function(){
var module = angular.module('jetgrizzlyApp.Auth', ['ui.router','firebase']);
var previousLocation = null;
module.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    parent: 'app',
    templateUrl: 'views/auth/login.html',
    controller: function ($scope, SimpleLogin, $state, $stateParams) {
      $scope.user = {};
      $scope.login = function() {
        SimpleLogin.login($scope.user.email, $scope.user.password)
          .then(function(user) {
            $state.go('lobby', $stateParams, {
              reload: true
            });
          });
      };
    }
  });
  $stateProvider.state('register', {
    url: '/register',
    parent: 'app',
    templateUrl: 'views/auth/register.html',
    controller: function ($scope, $state, SimpleLogin, $stateParams) {
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
    }
  });
  $stateProvider.state('logout', {
    url: '/logout',
    parent: 'app',
    controller: function (SimpleLogin, $state, $scope, $stateParams) {
        SimpleLogin.logout();
        $state.go('login', $stateParams, {
          reload: true
        });
      }
  });
})
  .factory('SimpleLogin', function ($timeout, $q, config,$firebaseSimpleLogin, $rootScope, $window) {
  var ref = new $window.Firebase(config.firebase.url+'/');
  var auth = $firebaseSimpleLogin(ref);
  // var listeners = [];
  var statusChange = function() {
    functions.getUser().then(function(user) {
      functions.user = user || null;
      // angular.forEach(listeners, function(fn) {
      //   fn(user || null);
      // })
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
          return functions.login(email, pass);
        });
    },
    // watch: function(cb, $scope) {
    //   functions.getUser().then(function(user) {
    //     cb(user);
    //   });
    //   listeners.push(cb);
    //   var unbind = function() {
    //     var i = listeners.indexOf(cb);
    //     if (i > -1) {listeners.splice(i,1); }
    //   };
    //   if ($scope) {
    //     $scope.$on('$destroy', unbind);
    //   }
    //   return unbind;
    // }
  };

  $rootScope.$on('firebaseSimpleLogin:login', statusChange);
  $rootScope.$on('firebaseSimpleLogin:logout', statusChange);
  statusChange();

  return functions;
});

})();