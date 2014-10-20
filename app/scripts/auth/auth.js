"use strict";

var module = angular.module('jetgrizzlyApp.Auth',['ui.router']);
var previousLocation = null;
module.factory('MockAuth',function($timeout,$q){
  var getCurrentUser = function(){
    var d = $q.defer();
    $timeout(function(){
      var simulateAuth = false;
      if(simulateAuth){
        d.resolve({name:"mock user",username:'test1'});
      }else{
        d.resolve(null);
      }
    },300);
    return d.promise;
  };
  return {
    getCurrentUser: getCurrentUser
  };
});
module.run(function($rootScope,$location){
  $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
    previousLocation = $location.path();
  })
});
module.controller('LoginController',function($scope,$modalInstance){

}).controller('loginController', function($scope, $location, loginFactory, $rootScope) {
    // if (user) {
    //   $location.path('/');
    // }
    $rootScope.user = {};
    $scope.register = function() {
      loginFactory.register($rootScope.user).then(function() {
        console.log('Registered');
        return loginFactory.login($rootScope.user).then(function() {
          console.log('Logged in');
          $location.path('/');
        });
      });
    };
  })

  .factory('loginFactory', function($firebaseSimpleLogin) {
    var ref = new Firebase('https://blistering-heat-6745.firebaseio.com');
    var auth = $firebaseSimpleLogin(ref);
    var Auth = {
      register: function(user) {
        return auth.$createUser(user.email, user.password);
      },
      login: function(user) {
        return auth.$login('password', user);
      },
      logout: function() {
        auth.logout();
      }
      // resolveUser: function() {
      //   return auth.$getCurrentUser();
      // },
      // signedIn: function() {
      //   return !!Auth.user.provider;
      // }
    };

    // $rootScope.$on('$firebaseSimpleLogin: login', function(err, user) {
    //   console.log('logged in');
    //   angular.copy(user, Auth.user);
    // });
    // $rootScope.$on('$firebaseSimpleLogin: logout', function() {
    //   console.log('logged out');
    //   angular.copy({}, Auth.user);
    // });

    return Auth;
  });